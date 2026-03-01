'use strict';

const crypto = require('node:crypto');

class InMemoryWebhookEventStore {
  constructor() {
    this.records = new Map();
  }

  has(key) {
    return this.records.has(key);
  }

  set(key, value) {
    this.records.set(key, value);
  }

  get(key) {
    return this.records.get(key);
  }
}

function computeGitHubSignature(secret, body) {
  const digest = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return `sha256=${digest}`;
}

function constantTimeMatch(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parseTimestampSeconds(timestampValue) {
  if (!timestampValue) {
    return null;
  }

  const numericTimestamp = Number.parseInt(timestampValue, 10);
  if (!Number.isNaN(numericTimestamp)) {
    return numericTimestamp;
  }

  const parsedMs = Date.parse(timestampValue);
  if (Number.isNaN(parsedMs)) {
    return null;
  }

  return Math.floor(parsedMs / 1000);
}

function verifySignature({ config, signature, body }) {
  if (!config.githubWebhookSecret) {
    return { ok: false, reason: 'secret_not_configured' };
  }

  const expectedCurrent = computeGitHubSignature(config.githubWebhookSecret, body);
  if (constantTimeMatch(expectedCurrent, signature)) {
    return { ok: true, usedPreviousSecret: false };
  }

  if (config.githubWebhookPreviousSecret) {
    const expectedPrevious = computeGitHubSignature(config.githubWebhookPreviousSecret, body);
    if (constantTimeMatch(expectedPrevious, signature)) {
      return { ok: true, usedPreviousSecret: true };
    }
  }

  return { ok: false, reason: 'signature_mismatch' };
}

function verifyTimestamp({ timestampHeader, nowSeconds, toleranceSeconds, allowMissingTimestamp }) {
  if (!timestampHeader) {
    if (allowMissingTimestamp) {
      return { ok: true, skipped: true, reason: 'timestamp_missing_allowed' };
    }
    return { ok: false, reason: 'missing_timestamp' };
  }

  const parsedSeconds = parseTimestampSeconds(timestampHeader);
  if (parsedSeconds === null) {
    return { ok: false, reason: 'invalid_timestamp' };
  }

  const skew = Math.abs(nowSeconds - parsedSeconds);
  if (skew > toleranceSeconds) {
    return { ok: false, reason: 'timestamp_out_of_tolerance' };
  }

  return { ok: true, skipped: false };
}

function extractBranchFromRef(ref) {
  if (!ref || typeof ref !== 'string') {
    return '';
  }

  if (ref.startsWith('refs/heads/')) {
    return ref.slice('refs/heads/'.length);
  }

  return ref;
}

function evaluateAutoexecute({ config, event }) {
  if (!config.autoexecuteEnabled) {
    return {
      evaluated: true,
      triggered: false,
      reason: 'autoexecute_disabled',
    };
  }

  if (!config.autoexecuteEvents.includes(event.type)) {
    return {
      evaluated: true,
      triggered: false,
      reason: 'criteria_not_matched',
    };
  }

  if (config.autoexecuteRepositories.length > 0 && !config.autoexecuteRepositories.includes(event.repository)) {
    return {
      evaluated: true,
      triggered: false,
      reason: 'criteria_not_matched',
    };
  }

  if (config.autoexecuteBranches.length > 0) {
    const branch = extractBranchFromRef(event.ref);
    if (!config.autoexecuteBranches.includes(branch)) {
      return {
        evaluated: true,
        triggered: false,
        reason: 'criteria_not_matched',
      };
    }
  }

  return {
    evaluated: true,
    triggered: true,
    reason: 'matched_trigger',
  };
}

function toJsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
}

async function ingestGitHubWebhook({ headers, rawBody, config, logger, store, dispatcher, now }) {
  const deliveryId = headers['x-github-delivery'];
  const eventType = headers['x-github-event'];
  const signature = headers['x-hub-signature-256'];
  const timestampHeader = headers['x-webhook-timestamp'] || '';
  const nowSeconds = Math.floor((now || Date.now()) / 1000);

  if (!deliveryId || !eventType || !signature) {
    logger.warn('webhook.rejected', {
      provider: 'github',
      event_id: deliveryId || 'unknown',
      verification_status: 'missing_headers',
    });
    return toJsonResponse(400, {
      error: 'bad_request',
      message: 'Missing required webhook headers',
    });
  }

  const timestampResult = verifyTimestamp({
    timestampHeader,
    nowSeconds,
    toleranceSeconds: config.timestampToleranceSeconds,
    allowMissingTimestamp: config.allowMissingTimestamp,
  });

  if (!timestampResult.ok) {
    logger.warn('webhook.rejected', {
      provider: 'github',
      event_id: deliveryId,
      verification_status: timestampResult.reason,
    });
    return toJsonResponse(401, {
      error: 'unauthorized',
      message: 'Timestamp verification failed',
    });
  }

  const signatureResult = verifySignature({
    config,
    signature,
    body: rawBody,
  });

  if (!signatureResult.ok) {
    logger.warn('webhook.rejected', {
      provider: 'github',
      event_id: deliveryId,
      verification_status: signatureResult.reason,
    });
    return toJsonResponse(401, {
      error: 'unauthorized',
      message: 'Signature verification failed',
    });
  }

  let parsedPayload;
  try {
    parsedPayload = JSON.parse(rawBody || '{}');
  } catch {
    logger.warn('webhook.rejected', {
      provider: 'github',
      event_id: deliveryId,
      verification_status: 'invalid_json',
    });
    return toJsonResponse(400, {
      error: 'bad_request',
      message: 'Malformed JSON payload',
    });
  }

  if (store.has(deliveryId)) {
    logger.info('webhook.duplicate', {
      provider: 'github',
      event_id: deliveryId,
      verification_status: 'verified',
      autoexecute_status: 'duplicate_event',
    });
    return toJsonResponse(200, {
      status: 'accepted',
      provider: 'github',
      event_id: deliveryId,
      duplicate: true,
      autoexecute: {
        evaluated: false,
        triggered: false,
        reason: 'duplicate_event',
      },
    });
  }

  const event = {
    id: deliveryId,
    type: eventType,
    action: parsedPayload.action || '',
    repository: parsedPayload.repository && parsedPayload.repository.full_name ? parsedPayload.repository.full_name : '',
    ref: parsedPayload.ref || '',
    received_at: new Date((now || Date.now())).toISOString(),
  };

  const autoexecuteDecision = evaluateAutoexecute({ config, event });
  let execution;

  if (autoexecuteDecision.triggered) {
    execution = await dispatcher(event);
  }

  store.set(deliveryId, {
    event,
    autoexecuteDecision,
    execution,
    signatureUsedPreviousSecret: signatureResult.usedPreviousSecret,
  });

  logger.info('webhook.processed', {
    provider: 'github',
    event_id: deliveryId,
    verification_status: timestampResult.skipped ? 'verified_no_timestamp' : 'verified',
    autoexecute_status: autoexecuteDecision.reason,
    execution_id: execution ? execution.executionId : '',
  });

  return toJsonResponse(200, {
    status: 'accepted',
    provider: 'github',
    event_id: deliveryId,
    duplicate: false,
    autoexecute: autoexecuteDecision,
  });
}

function webhookHealth({ config }) {
  return {
    provider: 'github',
    verifier: {
      configured: Boolean(config.githubWebhookSecret),
      algorithm: 'hmac-sha256',
      tolerance_seconds: config.timestampToleranceSeconds,
      accepts_rotated_secret: Boolean(config.githubWebhookPreviousSecret),
      allows_missing_timestamp: config.allowMissingTimestamp,
    },
  };
}

module.exports = {
  InMemoryWebhookEventStore,
  computeGitHubSignature,
  ingestGitHubWebhook,
  webhookHealth,
};
