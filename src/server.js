'use strict';

const http = require('node:http');
const { loadWebhookConfig } = require('./config/webhookConfig');
const { createLogger } = require('./monitor/logger');
const { InMemoryWebhookEventStore, ingestGitHubWebhook, webhookHealth } = require('./monitor/githubWebhook');

function getHeaderMap(req) {
  const result = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    result[key.toLowerCase()] = Array.isArray(value) ? value.join(',') : value || '';
  });
  return result;
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      resolve(raw);
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

function writeJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload));
}

function createExecutionDispatcher(logger) {
  return async (event) => {
    const executionId = `exec-${event.id}`;
    logger.info('webhook.autoexecute.triggered', {
      provider: 'github',
      event_id: event.id,
      execution_id: executionId,
    });

    return {
      executionId,
      queued: true,
    };
  };
}

function createServer(deps = {}) {
  const config = deps.config || loadWebhookConfig();
  const logger = deps.logger || createLogger();
  const store = deps.store || new InMemoryWebhookEventStore();
  const dispatcher = deps.dispatcher || createExecutionDispatcher(logger);

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/webhooks/github/health') {
      const authHeader = req.headers.authorization || '';
      if (config.healthToken && authHeader !== `Bearer ${config.healthToken}`) {
        writeJson(res, 401, {
          error: 'unauthorized',
          message: 'Missing or invalid token',
        });
        return;
      }

      writeJson(res, 200, webhookHealth({ config }));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/webhooks/github') {
      try {
        const rawBody = await readRawBody(req);
        const response = await ingestGitHubWebhook({
          headers: getHeaderMap(req),
          rawBody,
          config,
          logger,
          store,
          dispatcher,
        });
        res.statusCode = response.statusCode;
        Object.entries(response.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.end(response.body);
        return;
      } catch (error) {
        logger.error('webhook.processing.failed', {
          provider: 'github',
          error_message: error instanceof Error ? error.message : 'unknown_error',
        });
        writeJson(res, 500, {
          error: 'internal_error',
          message: 'Failed to process webhook',
        });
        return;
      }
    }

    writeJson(res, 404, {
      error: 'not_found',
      message: 'Route not found',
    });
  });
}

if (require.main === module) {
  const config = loadWebhookConfig();
  const logger = createLogger();
  const server = createServer({ config, logger });

  server.listen(config.port, () => {
    logger.info('server.started', {
      port: config.port,
      webhook_path: '/api/webhooks/github',
    });
  });
}

module.exports = {
  createServer,
};
