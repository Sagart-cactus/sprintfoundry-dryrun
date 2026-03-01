'use strict';

function parseList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function parseBoolean(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === '1' || value.toLowerCase() === 'true';
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}

function loadWebhookConfig(env) {
  const source = env || process.env;

  return {
    githubWebhookSecret: source.GITHUB_WEBHOOK_SECRET || '',
    githubWebhookPreviousSecret: source.GITHUB_WEBHOOK_PREVIOUS_SECRET || '',
    timestampToleranceSeconds: parseInteger(source.WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS, 300),
    allowMissingTimestamp: parseBoolean(source.WEBHOOK_ALLOW_MISSING_TIMESTAMP, true),
    autoexecuteEnabled: parseBoolean(source.MONITOR_AUTOEXECUTE, false),
    autoexecuteEvents: parseList(source.MONITOR_AUTOEXECUTE_EVENTS || 'push,pull_request,workflow_run'),
    autoexecuteBranches: parseList(source.MONITOR_AUTOEXECUTE_BRANCHES || ''),
    autoexecuteRepositories: parseList(source.MONITOR_AUTOEXECUTE_REPOSITORIES || ''),
    healthToken: source.WEBHOOK_HEALTH_TOKEN || '',
    port: parseInteger(source.PORT, 3000),
  };
}

module.exports = {
  loadWebhookConfig,
};
