from __future__ import annotations

import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from auth_token import create_auth_token, validate_auth_token


class AuthTokenTests(unittest.TestCase):
    def test_create_and_validate_token(self) -> None:
        fixed_now = datetime(2026, 2, 28, 12, 0, 0, tzinfo=timezone.utc)
        token = create_auth_token(
            user_id="user-123",
            secret="top-secret",
            expires_in_seconds=60,
            now=fixed_now,
        )

        subject = validate_auth_token(token, secret="top-secret", now=fixed_now)

        self.assertEqual(subject, "user-123")

    def test_validate_rejects_tampered_token(self) -> None:
        fixed_now = datetime(2026, 2, 28, 12, 0, 0, tzinfo=timezone.utc)
        token = create_auth_token(
            user_id="user-123",
            secret="top-secret",
            expires_in_seconds=60,
            now=fixed_now,
        )
        tampered = token[:-1] + ("A" if token[-1] != "A" else "B")

        with self.assertRaisesRegex(ValueError, "signature"):
            validate_auth_token(tampered, secret="top-secret", now=fixed_now)

    def test_validate_rejects_expired_token(self) -> None:
        fixed_now = datetime(2026, 2, 28, 12, 0, 0, tzinfo=timezone.utc)
        token = create_auth_token(
            user_id="user-123",
            secret="top-secret",
            expires_in_seconds=1,
            now=fixed_now,
        )

        with self.assertRaisesRegex(ValueError, "expired"):
            validate_auth_token(
                token,
                secret="top-secret",
                now=fixed_now + timedelta(seconds=2),
            )

    def test_create_rejects_non_positive_expiry(self) -> None:
        fixed_now = datetime(2026, 2, 28, 12, 0, 0, tzinfo=timezone.utc)
        with self.assertRaisesRegex(ValueError, "positive"):
            create_auth_token("user-123", "top-secret", expires_in_seconds=0, now=fixed_now)


if __name__ == "__main__":
    unittest.main()
