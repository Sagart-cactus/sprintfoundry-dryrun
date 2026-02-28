"""Minimal auth token utility."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(raw: str) -> bytes:
    padding = "=" * (-len(raw) % 4)
    return base64.urlsafe_b64decode((raw + padding).encode("ascii"))


def create_auth_token(
    user_id: str,
    secret: str,
    expires_in_seconds: int = 3600,
    now: datetime | None = None,
) -> str:
    """Create a signed token carrying a user id and UTC expiry timestamp."""
    if not user_id:
        raise ValueError("user_id must not be empty")
    if not secret:
        raise ValueError("secret must not be empty")
    if expires_in_seconds <= 0:
        raise ValueError("expires_in_seconds must be positive")

    current = now or datetime.now(tz=timezone.utc)
    exp = int((current + timedelta(seconds=expires_in_seconds)).timestamp())
    payload = json.dumps({"sub": user_id, "exp": exp}, separators=(",", ":")).encode(
        "utf-8"
    )
    payload_part = _b64url_encode(payload)
    signature = hmac.new(
        secret.encode("utf-8"),
        payload_part.encode("ascii"),
        hashlib.sha256,
    ).digest()
    signature_part = _b64url_encode(signature)
    return f"{payload_part}.{signature_part}"


def validate_auth_token(token: str, secret: str, now: datetime | None = None) -> str:
    """Validate token signature and expiry, then return the user id."""
    if not token:
        raise ValueError("token must not be empty")
    if not secret:
        raise ValueError("secret must not be empty")

    try:
        payload_part, signature_part = token.split(".", 1)
    except ValueError as exc:
        raise ValueError("invalid token format") from exc

    expected_signature = hmac.new(
        secret.encode("utf-8"),
        payload_part.encode("ascii"),
        hashlib.sha256,
    ).digest()
    actual_signature = _b64url_decode(signature_part)
    if not hmac.compare_digest(actual_signature, expected_signature):
        raise ValueError("invalid token signature")

    payload = json.loads(_b64url_decode(payload_part).decode("utf-8"))
    user_id = payload.get("sub")
    expiry = payload.get("exp")
    if not isinstance(user_id, str) or not user_id:
        raise ValueError("invalid token payload: subject")
    if not isinstance(expiry, int):
        raise ValueError("invalid token payload: expiry")

    current = now or datetime.now(tz=timezone.utc)
    if int(current.timestamp()) >= expiry:
        raise ValueError("token expired")

    return user_id
