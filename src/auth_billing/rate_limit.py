from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta


class ThrottledError(Exception):
    """Raised when an operation exceeds configured request limits."""


@dataclass(frozen=True)
class RateLimitRule:
    limit: int
    window_seconds: int


@dataclass
class _WindowCounter:
    window_start: datetime
    count: int


class FixedWindowRateLimiter:
    """In-memory fixed-window limiter for service-boundary abuse controls."""

    def __init__(self) -> None:
        self._counters: dict[tuple[str, str], _WindowCounter] = {}

    def enforce(self, scope: str, key: str, rule: RateLimitRule) -> None:
        now = datetime.utcnow()
        counter_key = (scope, key)
        counter = self._counters.get(counter_key)

        if counter is None:
            self._counters[counter_key] = _WindowCounter(window_start=now, count=1)
            return

        window = timedelta(seconds=rule.window_seconds)
        if now - counter.window_start >= window:
            self._counters[counter_key] = _WindowCounter(window_start=now, count=1)
            return

        if counter.count >= rule.limit:
            raise ThrottledError(f"Rate limit exceeded for {scope}")

        counter.count += 1
