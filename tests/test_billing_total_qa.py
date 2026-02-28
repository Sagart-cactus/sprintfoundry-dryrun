from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from billing_total import calculate_billing_total


class BillingTotalQATests(unittest.TestCase):
    def test_rejects_negative_tax_rate(self) -> None:
        with self.assertRaisesRegex(ValueError, "tax_rate"):
            calculate_billing_total([10.0], tax_rate=-0.01)

    def test_rejects_negative_discount(self) -> None:
        with self.assertRaisesRegex(ValueError, "discount"):
            calculate_billing_total([10.0], discount=-1.0)

    def test_empty_line_items_with_no_tax_or_discount_is_zero(self) -> None:
        self.assertEqual(calculate_billing_total([]), 0.0)


if __name__ == "__main__":
    unittest.main()
