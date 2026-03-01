# SprintFoundry GitHub Webhook Ingestion (Monitor Autoexecute)

This workspace now includes a minimal webhook ingestion service for GitHub events with:

- HMAC SHA-256 signature validation (`x-hub-signature-256`)
- Optional timestamp validation (`x-webhook-timestamp`)
- Duplicate delivery suppression by `x-github-delivery`
- Autoexecute trigger evaluation for monitor workflows
- Structured logging for verification and decision outcomes
- Health endpoint with verifier configuration status

## Run locally

```bash
cp .env.webhook.local.example .env.webhook.local
set -a && source .env.webhook.local && set +a
node src/server.js
```

Webhook endpoint:

- `POST /api/webhooks/github`

Health endpoint:

- `GET /api/webhooks/github/health`
- If `WEBHOOK_HEALTH_TOKEN` is set, call with `Authorization: Bearer <token>`

## Local live testing with ngrok

1. Start the server:
```bash
set -a && source .env.webhook.local && set +a
node src/server.js
```
2. Start ngrok tunnel to local port `3000`.
3. Point GitHub webhook to `https://<ngrok-host>/api/webhooks/github`.
4. Configure GitHub secret to match `GITHUB_WEBHOOK_SECRET`.
5. Trigger events from GitHub and watch JSON logs.

## Signed test event utility

Use the helper to send a correctly signed event to local or ngrok endpoint:

```bash
node scripts/send-github-webhook.js \
  --url http://localhost:3000/api/webhooks/github \
  --secret replace-me \
  --event push \
  --repo owner/repo \
  --ref refs/heads/main
```

## Test

```bash
node --test tests/githubWebhook.test.js
```
