from __future__ import annotations

import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from uuid import uuid4

from .models import RefreshTokenRecord
from .rate_limit import FixedWindowRateLimiter, RateLimitRule, ThrottledError


class AuthError(Exception):
    pass


class RefreshReuseDetected(AuthError):
    pass


class AuthThrottledError(AuthError):
    pass


class AuthSessionService:
    """Handles refresh token issuance, rotation, and token-family revocation."""

    def __init__(
        self,
        refresh_ttl_seconds: int = 60 * 60 * 24 * 7,
        rate_limiter: FixedWindowRateLimiter | None = None,
    ) -> None:
        self.refresh_ttl = timedelta(seconds=refresh_ttl_seconds)
        self._records_by_id: dict[str, RefreshTokenRecord] = {}
        self._family_index: dict[str, set[str]] = {}
        self.rate_limiter = rate_limiter or FixedWindowRateLimiter()
        self._auth_by_ip_rule = RateLimitRule(limit=5, window_seconds=60)
        self._auth_by_account_rule = RateLimitRule(limit=10, window_seconds=60)

    def issue_refresh_token(self, user_id: str, tenant_id: str) -> str:
        return self._create_token(user_id=user_id, tenant_id=tenant_id, family_id=str(uuid4()))

    def refresh(
        self,
        refresh_token: str,
        source_ip: str = "unknown",
        account_identifier: str = "unknown",
    ) -> dict[str, str | int]:
        self._enforce_auth_rate_limit(scope="auth:refresh:ip", key=source_ip, by_ip=True)
        self._enforce_auth_rate_limit(
            scope="auth:refresh:account",
            key=account_identifier,
            by_ip=False,
        )
        record, secret = self._get_record_and_secret(refresh_token)

        if record.expires_at <= datetime.utcnow():
            raise AuthError("Refresh token expired")

        expected = self._hash_secret(secret, record.salt)
        if not hmac.compare_digest(expected, record.token_hash):
            raise AuthError("Refresh token invalid")

        if record.rotated_to is not None:
            self._revoke_family(record.family_id)
            raise RefreshReuseDetected("Refresh token reuse detected; family revoked")

        if record.revoked:
            raise AuthError("Refresh token revoked")

        record.revoked = True
        new_refresh = self._create_token(
            user_id=record.user_id,
            tenant_id=record.tenant_id,
            family_id=record.family_id,
        )
        rotated_to = new_refresh.split(".", maxsplit=1)[0]
        record.rotated_to = rotated_to

        return {
            "access_token": secrets.token_urlsafe(24),
            "refresh_token": new_refresh,
            "expires_in": 900,
        }

    def logout(
        self,
        refresh_token: str,
        source_ip: str = "unknown",
        account_identifier: str = "unknown",
    ) -> None:
        self._enforce_auth_rate_limit(scope="auth:logout:ip", key=source_ip, by_ip=True)
        self._enforce_auth_rate_limit(
            scope="auth:logout:account",
            key=account_identifier,
            by_ip=False,
        )
        record, _ = self._parse_and_validate(refresh_token)
        record.revoked = True

    def _create_token(self, user_id: str, tenant_id: str, family_id: str) -> str:
        token_id = str(uuid4())
        secret = secrets.token_urlsafe(32)
        salt = secrets.token_hex(16)
        now = datetime.utcnow()
        record = RefreshTokenRecord(
            token_id=token_id,
            family_id=family_id,
            user_id=user_id,
            tenant_id=tenant_id,
            salt=salt,
            token_hash=self._hash_secret(secret, salt),
            issued_at=now,
            expires_at=now + self.refresh_ttl,
        )
        self._records_by_id[token_id] = record
        self._family_index.setdefault(family_id, set()).add(token_id)
        return f"{token_id}.{secret}"

    def _get_record_and_secret(self, refresh_token: str) -> tuple[RefreshTokenRecord, str]:
        try:
            token_id, secret = refresh_token.split(".", maxsplit=1)
        except ValueError as exc:
            raise AuthError("Malformed refresh token") from exc

        record = self._records_by_id.get(token_id)
        if record is None:
            raise AuthError("Unknown refresh token")
        return record, secret

    def _parse_and_validate(self, refresh_token: str) -> tuple[RefreshTokenRecord, str]:
        record, secret = self._get_record_and_secret(refresh_token)

        if record.revoked:
            raise AuthError("Refresh token revoked")

        if record.expires_at <= datetime.utcnow():
            raise AuthError("Refresh token expired")

        expected = self._hash_secret(secret, record.salt)
        if not hmac.compare_digest(expected, record.token_hash):
            raise AuthError("Refresh token invalid")

        return record, secret

    def _enforce_auth_rate_limit(self, scope: str, key: str, by_ip: bool) -> None:
        rule = self._auth_by_ip_rule if by_ip else self._auth_by_account_rule
        try:
            self.rate_limiter.enforce(scope=scope, key=key, rule=rule)
        except ThrottledError as exc:
            raise AuthThrottledError("AUTH_RATE_LIMITED") from exc

    def _revoke_family(self, family_id: str) -> None:
        for token_id in self._family_index.get(family_id, set()):
            self._records_by_id[token_id].revoked = True

    @staticmethod
    def _hash_secret(secret: str, salt: str) -> str:
        payload = f"{salt}:{secret}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()
