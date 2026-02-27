from __future__ import annotations

import hmac
import json
from dataclasses import dataclass
from datetime import datetime, timedelta
from hashlib import sha256

from .rate_limit import FixedWindowRateLimiter, RateLimitRule, ThrottledError


class WebhookVerificationError(Exception):
    pass


class WebhookThrottledError(WebhookVerificationError):
    pass


@dataclass
class WebhookEnvelope:
    event_id: str
    received_at: datetime
    signature_header: str
    payload: dict[str, object]


class WebhookIngestService:
    """Verifies signed provider webhooks and deduplicates event IDs."""

    def __init__(
        self,
        signing_secret: str,
        timestamp_tolerance_seconds: int = 300,
        dedupe_ttl_days: int = 7,
        rate_limiter: FixedWindowRateLimiter | None = None,
    ) -> None:
        self.signing_secret = signing_secret.encode("utf-8")
        self.timestamp_tolerance = timedelta(seconds=timestamp_tolerance_seconds)
        self.dedupe_ttl = timedelta(days=dedupe_ttl_days)
        self.rate_limiter = rate_limiter or FixedWindowRateLimiter()
        self._source_rate_limit_rule = RateLimitRule(limit=300, window_seconds=60)
        self._seen_events: dict[str, datetime] = {}
        self.envelopes: list[WebhookEnvelope] = []
        self.processing_queue: list[str] = []

    def ingest(self, signature_header: str, body: str, source_ip: str = "unknown") -> dict[str, object]:
        try:
            self.rate_limiter.enforce(
                scope="webhook:ingest:source",
                key=source_ip,
                rule=self._source_rate_limit_rule,
            )
        except ThrottledError as exc:
            raise WebhookThrottledError("WEBHOOK_RATE_LIMITED") from exc

        now = datetime.utcnow()
        timestamp, signature = self._parse_signature(signature_header)
        self._verify_timestamp(now, timestamp)
        self._verify_signature(timestamp, body, signature)

        try:
            payload = json.loads(body)
        except json.JSONDecodeError as exc:
            raise WebhookVerificationError("Malformed payload") from exc
        event_id = str(payload.get("id", ""))
        if not event_id:
            raise WebhookVerificationError("Missing event id")

        self._evict_seen(now)
        if event_id in self._seen_events:
            return {"status": "duplicate", "accepted": True}

        self._seen_events[event_id] = now
        self.envelopes.append(
            WebhookEnvelope(
                event_id=event_id,
                received_at=now,
                signature_header=signature_header,
                payload=payload,
            )
        )
        self.processing_queue.append(event_id)
        return {"status": "accepted", "accepted": True}

    def _parse_signature(self, signature_header: str) -> tuple[int, str]:
        pairs = dict(part.split("=", maxsplit=1) for part in signature_header.split(",") if "=" in part)
        if "t" not in pairs or "v1" not in pairs:
            raise WebhookVerificationError("Malformed signature header")
        try:
            return int(pairs["t"]), pairs["v1"]
        except ValueError as exc:
            raise WebhookVerificationError("Malformed signature header") from exc

    def _verify_timestamp(self, now: datetime, timestamp: int) -> None:
        try:
            signature_time = datetime.utcfromtimestamp(timestamp)
        except (OverflowError, OSError, ValueError) as exc:
            raise WebhookVerificationError("Malformed signature header") from exc
        if abs(now - signature_time) > self.timestamp_tolerance:
            raise WebhookVerificationError("Signature timestamp outside tolerance")

    def _verify_signature(self, timestamp: int, body: str, provided_signature: str) -> None:
        payload = f"{timestamp}.{body}".encode("utf-8")
        expected = hmac.new(self.signing_secret, payload, digestmod=sha256).hexdigest()
        if not hmac.compare_digest(expected, provided_signature):
            raise WebhookVerificationError("Invalid signature")

    def _evict_seen(self, now: datetime) -> None:
        expired = [
            event_id
            for event_id, created_at in self._seen_events.items()
            if now - created_at > self.dedupe_ttl
        ]
        for event_id in expired:
            del self._seen_events[event_id]
