import unittest

from auth_billing.auth import AuthError, AuthSessionService, AuthThrottledError, RefreshReuseDetected


class AuthSessionServiceTests(unittest.TestCase):
    def test_refresh_rotates_token(self) -> None:
        service = AuthSessionService()
        token = service.issue_refresh_token(user_id="user-1", tenant_id="tenant-a")

        refreshed = service.refresh(token)

        self.assertIn("access_token", refreshed)
        self.assertIn("refresh_token", refreshed)
        self.assertNotEqual(token, refreshed["refresh_token"])

    def test_reuse_detected_revokes_family(self) -> None:
        service = AuthSessionService()
        token = service.issue_refresh_token(user_id="user-1", tenant_id="tenant-a")
        next_token = service.refresh(token)["refresh_token"]

        with self.assertRaises(RefreshReuseDetected):
            service.refresh(token)

        with self.assertRaises(AuthError):
            service.refresh(next_token)

    def test_logout_revokes_refresh_token(self) -> None:
        service = AuthSessionService()
        token = service.issue_refresh_token(user_id="user-1", tenant_id="tenant-a")

        service.logout(token)

        with self.assertRaises(AuthError):
            service.refresh(token)

    def test_refresh_rate_limit_by_ip(self) -> None:
        service = AuthSessionService()
        malformed_token = "invalid-token"

        for _ in range(5):
            with self.assertRaises(AuthError):
                service.refresh(
                    malformed_token,
                    source_ip="192.0.2.10",
                    account_identifier="user-1",
                )

        with self.assertRaises(AuthThrottledError):
            service.refresh(
                malformed_token,
                source_ip="192.0.2.10",
                account_identifier="user-1",
            )


if __name__ == "__main__":
    unittest.main()
