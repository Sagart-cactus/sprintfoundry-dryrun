from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(frozen=True)
class ActorContext:
    user_id: str
    tenant_id: str
    permissions: set[str]


@dataclass
class RefreshTokenRecord:
    token_id: str
    family_id: str
    user_id: str
    tenant_id: str
    salt: str
    token_hash: str
    issued_at: datetime
    expires_at: datetime
    revoked: bool = False
    rotated_to: str | None = None


@dataclass
class PaymentMethod:
    payment_method_id: str
    tenant_id: str
    user_id: str
    provider_fingerprint: str
    is_default: bool = False


@dataclass
class Subscription:
    subscription_id: str
    tenant_id: str
    status: str = "active"
    canceled_at: datetime | None = None


@dataclass
class AuditEvent:
    event_type: str
    actor_user_id: str
    tenant_id: str
    endpoint: str
    correlation_id: str
    details: dict[str, str] = field(default_factory=dict)
