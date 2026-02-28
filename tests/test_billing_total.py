from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from billing_total import calculate_billing_total


class BillingTotalTests(unittest.TestCase):
    def test_calculates_total_with_tax_and_discount(self) -> None:
        total = calculate_billing_total([10.00, 20.00], tax_rate=0.1, discount=5.00)
        self.assertEqual(total, 27.5)

    def test_rounds_to_two_decimals(self) -> None:
        total = calculate_billing_total([10.005], tax_rate=0.075, discount=0.0)
        self.assertEqual(total, 10.76)

    def test_rejects_negative_line_items(self) -> None:
        with self.assertRaisesRegex(ValueError, "non-negative"):
            calculate_billing_total([5.0, -1.0])

    def test_rejects_discount_greater_than_subtotal(self) -> None:
        with self.assertRaisesRegex(ValueError, "exceed subtotal"):
            calculate_billing_total([5.0], discount=6.0)


if __name__ == "__main__":
    unittest.main()
