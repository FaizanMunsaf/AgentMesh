import pytest
from claimguard.shared.schemas import ClaimRecord, ClearanceRequest, ClearanceResponse


def test_claim_record_defaults():
    r = ClaimRecord(
        name="Jane Doe",
        policy_number="NVC-10001",
        incident_date="2026-01-15",
        coverage_type="collision",
        accident_description="Rear-ended at a red light on Main Street",
        claim_amount=3200.0,
    )
    assert r.claim_id is not None
    assert len(r.claim_id) == 36  # UUID4 format
    assert r.ssn is None
    assert r.bank_account is None
    assert r.decision is None


def test_claim_record_roundtrip():
    r = ClaimRecord(
        name="Jane Doe",
        policy_number="NVC-10001",
        incident_date="2026-01-15",
        coverage_type="collision",
        accident_description="Rear-ended at a red light on Main Street",
        claim_amount=3200.0,
        ssn="123-45-6789",
    )
    dumped = r.model_dump_json()
    restored = ClaimRecord.model_validate_json(dumped)
    assert restored.ssn == "123-45-6789"
    assert restored.claim_id == r.claim_id


def test_clearance_request_serializes():
    r = ClaimRecord(
        name="Jane",
        policy_number="NVC-10001",
        incident_date="2026-01-15",
        coverage_type="collision",
        accident_description="Car hit barrier at 40mph on highway",
        claim_amount=5000.0,
    )
    req = ClearanceRequest(role="assessment", claim=r)
    assert req.type == "clearance_request"
    assert req.role == "assessment"


def test_clearance_response_serializes():
    r = ClaimRecord(
        name="Jane",
        policy_number="NVC-10001",
        incident_date="2026-01-15",
        coverage_type="collision",
        accident_description="Car hit barrier at 40mph on highway",
        claim_amount=5000.0,
    )
    resp = ClearanceResponse(filtered_claim=r, decisions=[])
    assert resp.type == "clearance_response"
