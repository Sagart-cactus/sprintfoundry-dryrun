from __future__ import annotations

import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from auth_token import create_auth_token, validate_auth_token


class AuthTokenQATests(unittest.TestCase):
    def test_create_rejects_empty_user_id(self) -> None:
        with self.assertRaisesRegex(ValueError, "user_id"):
            create_auth_token(user_id="", secret="top-secret")

    def test_validate_rejects_empty_token(self) -> None:
        with self.assertRaisesRegex(ValueError, "token"):
            validate_auth_token(token="", secret="top-secret")

    def test_validate_rejects_invalid_token_format(self) -> None:
        with self.assertRaisesRegex(ValueError, "format"):
            validate_auth_token(token="not-a-dot-token", secret="top-secret")

    def test_validate_accepts_valid_token_on_expiry_boundary(self) -> None:
        now = datetime(2026, 2, 28, 12, 0, 0, tzinfo=timezone.utc)
        token = create_auth_token("user-qa", "top-secret", expires_in_seconds=1, now=now)
        subject = validate_auth_token(token=token, secret="top-secret", now=now)
        self.assertEqual(subject, "user-qa")


if __name__ == "__main__":
    unittest.main()
