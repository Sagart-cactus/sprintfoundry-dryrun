import hmac
import json
import unittest
from hashlib import sha256
from time import time

from auth_billing.webhook import WebhookIngestService, WebhookVerificationError


def make_signature(secret: str, body: str, ts: int) -> str:
    payload = f"{ts}.{body}".encode("utf-8")
    digest = hmac.new(secret.encode("utf-8"), payload, sha256).hexdigest()
    return f"t={ts},v1={digest}"


class WebhookIngestServiceTests(unittest.TestCase):
    def test_signature_verification_and_dedupe(self) -> None:
        service = WebhookIngestService(signing_secret="whsec_test")
        body = json.dumps({"id": "evt_1", "type": "invoice.paid"})
        ts = int(time())
        sig = make_signature("whsec_test", body, ts)

        first = service.ingest(sig, body)
        second = service.ingest(sig, body)

        self.assertEqual(first["status"], "accepted")
        self.assertEqual(second["status"], "duplicate")
        self.assertEqual(len(service.processing_queue), 1)

    def test_timestamp_tolerance_rejection(self) -> None:
        service = WebhookIngestService(signing_secret="whsec_test", timestamp_tolerance_seconds=300)
        body = json.dumps({"id": "evt_2", "type": "invoice.paid"})
        old_ts = int(time()) - 3600
        sig = make_signature("whsec_test", body, old_ts)

        with self.assertRaises(WebhookVerificationError):
            service.ingest(sig, body)

    def test_invalid_signature_rejected(self) -> None:
        service = WebhookIngestService(signing_secret="whsec_test")
        body = json.dumps({"id": "evt_3", "type": "invoice.paid"})
        sig = f"t={int(time())},v1=bad"

        with self.assertRaises(WebhookVerificationError):
            service.ingest(sig, body)

    def test_malformed_signature_timestamp_rejected(self) -> None:
        service = WebhookIngestService(signing_secret="whsec_test")
        body = json.dumps({"id": "evt_4", "type": "invoice.paid"})
        sig = "t=not-a-number,v1=abcd"

        with self.assertRaisesRegex(WebhookVerificationError, "Malformed signature header"):
            service.ingest(sig, body)

    def test_malformed_json_payload_rejected(self) -> None:
        service = WebhookIngestService(signing_secret="whsec_test")
        body = '{"id":"evt_5",'
        ts = int(time())
        sig = make_signature("whsec_test", body, ts)

        with self.assertRaisesRegex(WebhookVerificationError, "Malformed payload"):
            service.ingest(sig, body)


if __name__ == "__main__":
    unittest.main()
