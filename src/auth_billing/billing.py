from __future__ import annotations

import hashlib
from datetime import datetime
from uuid import uuid4

from .idempotency import IdempotencyStore
from .models import ActorContext, AuditEvent, PaymentMethod, Subscription
from .rate_limit import FixedWindowRateLimiter, RateLimitRule, ThrottledError


class BillingError(Exception):
    pass


class AuthorizationError(BillingError):
    pass


class NotFoundError(BillingError):
    pass


class BillingThrottledError(BillingError):
    pass


class BillingService:
    """Applies permission checks, tenant scoping, idempotency, and audit logging."""

    def __init__(
        self,
        idempotency_store: IdempotencyStore | None = None,
        rate_limiter: FixedWindowRateLimiter | None = None,
    ) -> None:
        self.idempotency_store = idempotency_store or IdempotencyStore()
        self.rate_limiter = rate_limiter or FixedWindowRateLimiter()
        self._per_user_mutation_rule = RateLimitRule(limit=30, window_seconds=60)
        self._per_tenant_mutation_rule = RateLimitRule(limit=120, window_seconds=60)
        self.payment_methods: dict[str, PaymentMethod] = {}
        self.subscriptions: dict[str, Subscription] = {}
        self.audit_events: list[AuditEvent] = []

    def create_subscription(self, tenant_id: str) -> Subscription:
        subscription = Subscription(subscription_id=str(uuid4()), tenant_id=tenant_id)
        self.subscriptions[subscription.subscription_id] = subscription
        return subscription

    def add_payment_method(
        self,
        actor: ActorContext,
        idempotency_key: str,
        provider_token: str,
        set_default: bool = False,
        mfa_passed: bool = False,
    ) -> dict[str, str | bool]:
        self._enforce_mutation_rate_limits(actor)
        self._require_permission(actor, "billing:write")
        if not mfa_passed:
            raise AuthorizationError("MFA_REQUIRED")

        fingerprint = self._fingerprint("add_payment_method", actor.user_id, provider_token, str(set_default))

        def _create() -> dict[str, str | bool]:
            payment_method = PaymentMethod(
                payment_method_id=str(uuid4()),
                tenant_id=actor.tenant_id,
                user_id=actor.user_id,
                provider_fingerprint=self._fingerprint(provider_token),
                is_default=set_default,
            )
            self.payment_methods[payment_method.payment_method_id] = payment_method
            self._audit("billing.payment_method.added", actor, "/api/v1/billing/payment-methods")
            return {
                "payment_method_id": payment_method.payment_method_id,
                "tenant_id": payment_method.tenant_id,
                "is_default": payment_method.is_default,
            }

        result, _ = self.idempotency_store.execute(
            scope=f"{actor.tenant_id}:payment-method:add",
            key=idempotency_key,
            fingerprint=fingerprint,
            callback=_create,
        )
        return result

    def delete_payment_method(
        self,
        actor: ActorContext,
        payment_method_id: str,
        idempotency_key: str,
        mfa_passed: bool = False,
    ) -> None:
        self._enforce_mutation_rate_limits(actor)
        self._require_permission(actor, "billing:write")
        if not mfa_passed:
            raise AuthorizationError("MFA_REQUIRED")

        fingerprint = self._fingerprint("delete_payment_method", actor.user_id, payment_method_id)

        def _delete() -> None:
            payment_method = self.payment_methods.get(payment_method_id)
            if payment_method is None:
                raise NotFoundError("Payment method not found")
            if payment_method.tenant_id != actor.tenant_id:
                raise AuthorizationError("Cross-tenant payment method access denied")
            if payment_method.user_id != actor.user_id:
                raise AuthorizationError("Payment method ownership mismatch")

            del self.payment_methods[payment_method_id]
            self._audit(
                "billing.payment_method.deleted",
                actor,
                f"/api/v1/billing/payment-methods/{payment_method_id}",
            )

        self.idempotency_store.execute(
            scope=f"{actor.tenant_id}:payment-method:delete",
            key=idempotency_key,
            fingerprint=fingerprint,
            callback=_delete,
        )

    def cancel_subscription(
        self,
        actor: ActorContext,
        subscription_id: str,
        idempotency_key: str,
        reason: str,
        mfa_passed: bool = False,
    ) -> dict[str, str]:
        self._enforce_mutation_rate_limits(actor)
        self._require_permission(actor, "billing:admin")
        if not mfa_passed:
            raise AuthorizationError("MFA_REQUIRED")

        fingerprint = self._fingerprint("cancel_subscription", actor.user_id, subscription_id, reason)

        def _cancel() -> dict[str, str]:
            subscription = self.subscriptions.get(subscription_id)
            if subscription is None:
                raise NotFoundError("Subscription not found")
            if subscription.tenant_id != actor.tenant_id:
                raise AuthorizationError("Cross-tenant subscription access denied")

            now = datetime.utcnow()
            subscription.status = "canceled"
            subscription.canceled_at = now
            self._audit(
                "billing.subscription.canceled",
                actor,
                f"/api/v1/billing/subscriptions/{subscription_id}/cancel",
                {"reason": reason[:256]},
            )
            return {
                "subscription_id": subscription.subscription_id,
                "status": subscription.status,
                "canceled_at": now.isoformat(),
            }

        result, _ = self.idempotency_store.execute(
            scope=f"{actor.tenant_id}:subscription:cancel",
            key=idempotency_key,
            fingerprint=fingerprint,
            callback=_cancel,
        )
        return result

    def _require_permission(self, actor: ActorContext, permission: str) -> None:
        if permission not in actor.permissions:
            raise AuthorizationError(f"Missing permission: {permission}")

    def _enforce_mutation_rate_limits(self, actor: ActorContext) -> None:
        try:
            self.rate_limiter.enforce(
                scope="billing:mutation:user",
                key=actor.user_id,
                rule=self._per_user_mutation_rule,
            )
            self.rate_limiter.enforce(
                scope="billing:mutation:tenant",
                key=actor.tenant_id,
                rule=self._per_tenant_mutation_rule,
            )
        except ThrottledError as exc:
            raise BillingThrottledError("BILLING_RATE_LIMITED") from exc

    def _audit(
        self,
        event_type: str,
        actor: ActorContext,
        endpoint: str,
        details: dict[str, str] | None = None,
    ) -> None:
        self.audit_events.append(
            AuditEvent(
                event_type=event_type,
                actor_user_id=actor.user_id,
                tenant_id=actor.tenant_id,
                endpoint=endpoint,
                correlation_id=str(uuid4()),
                details=details or {},
            )
        )

    @staticmethod
    def _fingerprint(*parts: str) -> str:
        raw = "|".join(parts).encode("utf-8")
        return hashlib.sha256(raw).hexdigest()
