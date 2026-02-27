from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta
from uuid import uuid4

from .models import RefreshTokenRecord


class AuthError(Exception):
    pass


class RefreshReuseDetected(AuthError):
    pass


class AuthSessionService:
    """Handles refresh token issuance, rotation, and token-family revocation."""

    def __init__(self, refresh_ttl_seconds: int = 60 * 60 * 24 * 7) -> None:
        self.refresh_ttl = timedelta(seconds=refresh_ttl_seconds)
        self._records_by_id: dict[str, RefreshTokenRecord] = {}
        self._family_index: dict[str, set[str]] = {}

    def issue_refresh_token(self, user_id: str, tenant_id: str) -> str:
        return self._create_token(user_id=user_id, tenant_id=tenant_id, family_id=str(uuid4()))

    def refresh(self, refresh_token: str) -> dict[str, str | int]:
        record, secret = self._get_record_and_secret(refresh_token)

        if record.expires_at <= datetime.utcnow():
            raise AuthError("Refresh token expired")

        expected = self._hash_secret(secret, record.salt)
        if expected != record.token_hash:
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

    def logout(self, refresh_token: str) -> None:
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
        if expected != record.token_hash:
            raise AuthError("Refresh token invalid")

        return record, secret

    def _revoke_family(self, family_id: str) -> None:
        for token_id in self._family_index.get(family_id, set()):
            self._records_by_id[token_id].revoked = True

    @staticmethod
    def _hash_secret(secret: str, salt: str) -> str:
        payload = f"{salt}:{secret}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()
