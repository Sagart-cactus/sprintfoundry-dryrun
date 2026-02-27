import unittest

from auth_billing.billing import AuthorizationError, BillingService
from auth_billing.idempotency import IdempotencyConflict
from auth_billing.models import ActorContext


class BillingServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.service = BillingService()
        self.writer = ActorContext(
            user_id="user-1",
            tenant_id="tenant-a",
            permissions={"billing:read", "billing:write"},
        )
        self.admin = ActorContext(
            user_id="admin-1",
            tenant_id="tenant-a",
            permissions={"billing:read", "billing:write", "billing:admin"},
        )
        self.other_tenant_admin = ActorContext(
            user_id="admin-2",
            tenant_id="tenant-b",
            permissions={"billing:read", "billing:write", "billing:admin"},
        )

    def test_permission_matrix_enforced(self) -> None:
        reader = ActorContext(
            user_id="reader-1",
            tenant_id="tenant-a",
            permissions={"billing:read"},
        )
        with self.assertRaises(AuthorizationError):
            self.service.add_payment_method(
                actor=reader,
                idempotency_key="k" * 16,
                provider_token="provider-token",
                mfa_passed=True,
            )

    def test_idempotency_duplicate_request_returns_same_response(self) -> None:
        first = self.service.add_payment_method(
            actor=self.writer,
            idempotency_key="a" * 16,
            provider_token="provider-token",
            mfa_passed=True,
        )
        second = self.service.add_payment_method(
            actor=self.writer,
            idempotency_key="a" * 16,
            provider_token="provider-token",
            mfa_passed=True,
        )
        self.assertEqual(first, second)

    def test_idempotency_key_conflict_raises(self) -> None:
        self.service.add_payment_method(
            actor=self.writer,
            idempotency_key="b" * 16,
            provider_token="provider-token-1",
            mfa_passed=True,
        )
        with self.assertRaises(IdempotencyConflict):
            self.service.add_payment_method(
                actor=self.writer,
                idempotency_key="b" * 16,
                provider_token="provider-token-2",
                mfa_passed=True,
            )

    def test_cross_tenant_subscription_cancel_is_denied(self) -> None:
        subscription = self.service.create_subscription(tenant_id="tenant-a")

        with self.assertRaises(AuthorizationError):
            self.service.cancel_subscription(
                actor=self.other_tenant_admin,
                subscription_id=subscription.subscription_id,
                idempotency_key="c" * 16,
                reason="security test",
                mfa_passed=True,
            )

    def test_audit_event_created_for_privileged_operations(self) -> None:
        payment_method = self.service.add_payment_method(
            actor=self.writer,
            idempotency_key="d" * 16,
            provider_token="provider-token",
            mfa_passed=True,
        )
        self.service.delete_payment_method(
            actor=self.writer,
            payment_method_id=payment_method["payment_method_id"],
            idempotency_key="e" * 16,
            mfa_passed=True,
        )
        subscription = self.service.create_subscription(tenant_id="tenant-a")
        self.service.cancel_subscription(
            actor=self.admin,
            subscription_id=subscription.subscription_id,
            idempotency_key="f" * 16,
            reason="requested",
            mfa_passed=True,
        )

        event_types = [event.event_type for event in self.service.audit_events]
        self.assertIn("billing.payment_method.added", event_types)
        self.assertIn("billing.payment_method.deleted", event_types)
        self.assertIn("billing.subscription.canceled", event_types)


if __name__ == "__main__":
    unittest.main()
