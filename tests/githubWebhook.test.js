'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { computeGitHubSignature, ingestGitHubWebhook, InMemoryWebhookEventStore } = require('../src/monitor/githubWebhook');

function createBaseConfig(overrides = {}) {
  return {
    githubWebhookSecret: 'test-secret',
    githubWebhookPreviousSecret: '',
    timestampToleranceSeconds: 300,
    allowMissingTimestamp: true,
    autoexecuteEnabled: true,
    autoexecuteEvents: ['push'],
    autoexecuteBranches: ['main'],
    autoexecuteRepositories: ['owner/repo'],
    ...overrides,
  };
}

function createHeaders(payload, config, overrides = {}) {
  return {
    'x-github-delivery': 'evt-1',
    'x-github-event': 'push',
    'x-hub-signature-256': computeGitHubSignature(config.githubWebhookSecret, payload),
    ...overrides,
  };
}

function parseBody(response) {
  return JSON.parse(response.body);
}

test('accepts valid webhook and triggers autoexecute', async () => {
  const payload = JSON.stringify({
    ref: 'refs/heads/main',
    repository: { full_name: 'owner/repo' },
  });
  const config = createBaseConfig();
  const store = new InMemoryWebhookEventStore();
  const logger = { info() {}, warn() {}, error() {} };
  let dispatchCount = 0;

  const response = await ingestGitHubWebhook({
    headers: createHeaders(payload, config),
    rawBody: payload,
    config,
    logger,
    store,
    dispatcher: async () => {
      dispatchCount += 1;
      return { executionId: 'exec-1' };
    },
    now: new Date('2026-03-01T12:00:00Z').valueOf(),
  });

  assert.equal(response.statusCode, 200);
  const body = parseBody(response);
  assert.equal(body.duplicate, false);
  assert.equal(body.autoexecute.triggered, true);
  assert.equal(dispatchCount, 1);
});

test('rejects webhook when signature is invalid', async () => {
  const payload = JSON.stringify({ ref: 'refs/heads/main', repository: { full_name: 'owner/repo' } });
  const config = createBaseConfig();
  const store = new InMemoryWebhookEventStore();
  const logger = { info() {}, warn() {}, error() {} };

  const response = await ingestGitHubWebhook({
    headers: {
      'x-github-delivery': 'evt-2',
      'x-github-event': 'push',
      'x-hub-signature-256': 'sha256=bad',
    },
    rawBody: payload,
    config,
    logger,
    store,
    dispatcher: async () => ({ executionId: 'never' }),
    now: new Date('2026-03-01T12:00:00Z').valueOf(),
  });

  assert.equal(response.statusCode, 401);
  assert.equal(store.has('evt-2'), false);
});

test('suppresses duplicate delivery and does not dispatch twice', async () => {
  const payload = JSON.stringify({ ref: 'refs/heads/main', repository: { full_name: 'owner/repo' } });
  const config = createBaseConfig();
  const store = new InMemoryWebhookEventStore();
  const logger = { info() {}, warn() {}, error() {} };
  let dispatchCount = 0;

  const request = {
    headers: createHeaders(payload, config, { 'x-github-delivery': 'evt-3' }),
    rawBody: payload,
    config,
    logger,
    store,
    dispatcher: async () => {
      dispatchCount += 1;
      return { executionId: 'exec-3' };
    },
    now: new Date('2026-03-01T12:00:00Z').valueOf(),
  };

  const first = await ingestGitHubWebhook(request);
  const second = await ingestGitHubWebhook(request);

  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 200);
  assert.equal(parseBody(second).duplicate, true);
  assert.equal(dispatchCount, 1);
});

test('records event but skips execution when autoexecute disabled', async () => {
  const payload = JSON.stringify({ ref: 'refs/heads/main', repository: { full_name: 'owner/repo' } });
  const config = createBaseConfig({ autoexecuteEnabled: false });
  const store = new InMemoryWebhookEventStore();
  const logger = { info() {}, warn() {}, error() {} };

  const response = await ingestGitHubWebhook({
    headers: createHeaders(payload, config, { 'x-github-delivery': 'evt-4' }),
    rawBody: payload,
    config,
    logger,
    store,
    dispatcher: async () => {
      throw new Error('dispatcher should not be called');
    },
    now: new Date('2026-03-01T12:00:00Z').valueOf(),
  });

  assert.equal(response.statusCode, 200);
  const body = parseBody(response);
  assert.equal(body.autoexecute.reason, 'autoexecute_disabled');
});
