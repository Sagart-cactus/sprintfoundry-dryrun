# Auth/Billing Security Hardening

## API Updates

### Required Headers
- `Idempotency-Key` is required for all billing mutation endpoints.
- `X-Request-Id` should be propagated from client to server and included in audit traces.

### Error Semantics
- `401`: invalid credentials/session/signature.
- `403`: missing permission (`billing:write` or `billing:admin`) or cross-tenant/ownership denial.
- `409`: idempotency key conflict (same key with different request fingerprint) or refresh-token reuse conflict.
- `429`: rate limited requests.

## Operator Runbook

### Rotate Webhook Signing Secret
1. Generate a new provider webhook secret.
2. Deploy with dual verification window (old + new secrets).
3. Verify signed event acceptance and zero `invalid signature` spikes.
4. Remove old secret after propagation.

### Investigate Refresh Token Reuse Alerts
1. Locate token family by user/tenant in auth refresh token storage.
2. Confirm family-wide revocation occurred.
3. Force interactive re-authentication for affected users.
4. Correlate with suspicious IP/user-agent telemetry.

### Trace Billing Mutations
1. Query `billing_audit_events` by tenant/user and endpoint.
2. Correlate via `correlation_id` and `X-Request-Id`.
3. Confirm idempotency entry and final persisted billing state.

## Security Model
- Refresh tokens are rotated on every refresh.
- Reuse of a rotated refresh token revokes the full token family.
- Billing writes require explicit role permissions and tenant + owner checks.
- High-risk billing mutations require MFA step-up.
- Webhooks require HMAC signature validation, timestamp tolerance checks, and event-ID dedupe.

## Incident Response
- If webhook replay/flood is detected: enforce IP controls, keep signature verification strict, review dedupe metrics.
- If auth abuse is detected: revoke token families, increase auth throttling, collect audit trails.
- If cross-tenant access attempts are detected: capture request metadata, review authorization policy logs, and escalate to security review.

## Human Review Gate
- All P0 auth/billing changes require explicit human security/code-owner approval before merge.
- Pull requests must include completed checklist entries from `.github/pull_request_template.md`.
