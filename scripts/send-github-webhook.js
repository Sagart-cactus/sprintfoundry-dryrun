#!/usr/bin/env node
'use strict';

const { randomUUID, createHmac } = require('node:crypto');

function getArg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return fallback;
  }
  return process.argv[index + 1];
}

async function main() {
  const target = getArg('--url', process.env.WEBHOOK_TARGET_URL || 'http://localhost:3000/api/webhooks/github');
  const secret = getArg('--secret', process.env.GITHUB_WEBHOOK_SECRET || 'local-secret');
  const eventType = getArg('--event', process.env.GITHUB_WEBHOOK_EVENT || 'push');
  const deliveryId = getArg('--delivery', randomUUID());
  const timestamp = getArg('--timestamp', `${Math.floor(Date.now() / 1000)}`);
  const repository = getArg('--repo', process.env.GITHUB_WEBHOOK_REPO || 'local/demo-repo');
  const ref = getArg('--ref', process.env.GITHUB_WEBHOOK_REF || 'refs/heads/main');

  const payload = JSON.stringify({
    action: 'synchronize',
    ref,
    repository: {
      full_name: repository,
    },
    sender: {
      login: 'local-tester',
    },
  });

  const signature = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;

  const response = await fetch(target, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-github-event': eventType,
      'x-github-delivery': deliveryId,
      'x-hub-signature-256': signature,
      'x-webhook-timestamp': timestamp,
      'user-agent': 'sprintfoundry-local-webhook-sender',
    },
    body: payload,
  });

  const body = await response.text();
  process.stdout.write(`${response.status} ${response.statusText}\n`);
  process.stdout.write(`${body}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'unknown_error'}\n`);
  process.exitCode = 1;
});
