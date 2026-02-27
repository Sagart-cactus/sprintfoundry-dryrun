from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Callable, Generic, TypeVar

T = TypeVar("T")


class IdempotencyConflict(Exception):
    pass


@dataclass
class _Record(Generic[T]):
    fingerprint: str
    response: T
    created_at: datetime


class IdempotencyStore:
    """Simple in-memory idempotency cache with fingerprint conflict protection."""

    def __init__(self, ttl_hours: int = 24) -> None:
        self.ttl = timedelta(hours=ttl_hours)
        self._records: dict[tuple[str, str], _Record[object]] = {}

    def execute(self, scope: str, key: str, fingerprint: str, callback: Callable[[], T]) -> tuple[T, bool]:
        if len(key) < 16:
            raise ValueError("Idempotency-Key must be at least 16 characters")
        if len(key) > 128:
            raise ValueError("Idempotency-Key must be at most 128 characters")

        now = datetime.utcnow()
        self._evict(now)
        record_key = (scope, key)

        existing = self._records.get(record_key)
        if existing is not None:
            if existing.fingerprint != fingerprint:
                raise IdempotencyConflict("Idempotency key reused with different payload")
            return existing.response, True

        response = callback()
        self._records[record_key] = _Record(
            fingerprint=fingerprint,
            response=response,
            created_at=now,
        )
        return response, False

    def _evict(self, now: datetime) -> None:
        expired = [
            key
            for key, record in self._records.items()
            if now - record.created_at > self.ttl
        ]
        for key in expired:
            del self._records[key]
