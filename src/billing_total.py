"""Minimal billing total utility."""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

TWOPLACES = Decimal("0.01")


def calculate_billing_total(
    line_items: list[float],
    tax_rate: float = 0.0,
    discount: float = 0.0,
) -> float:
    """Calculate final total from line items.

    The calculation order is:
    1. subtotal = sum(line_items)
    2. discounted = subtotal - discount
    3. total = discounted + (discounted * tax_rate)
    """
    if tax_rate < 0:
        raise ValueError("tax_rate must be non-negative")
    if discount < 0:
        raise ValueError("discount must be non-negative")

    decimal_items: list[Decimal] = []
    for item in line_items:
        if item < 0:
            raise ValueError("line items must be non-negative")
        decimal_items.append(Decimal(str(item)))

    subtotal = sum(decimal_items, start=Decimal("0"))
    discounted = subtotal - Decimal(str(discount))
    if discounted < 0:
        raise ValueError("discount cannot exceed subtotal")

    total = discounted + (discounted * Decimal(str(tax_rate)))
    return float(total.quantize(TWOPLACES, rounding=ROUND_HALF_UP))
