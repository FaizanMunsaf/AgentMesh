from agents.assessment.logic import assess_claim
from models.claim_record import ClaimRecord


def test_assess_claim_approved():
    record = ClaimRecord(
        name="Jane Doe",
        policy_number="NVC-10001",
        coverage_type="collision",
        claim_amount=5000.0,
    )
    decision, reason = assess_claim(record)
    assert decision == "approve"
    assert "within policy limits" in reason


def test_assess_claim_denied_invalid_policy():
    record = ClaimRecord(
        name="Jane Doe",
        policy_number="INVALID-123",
        claim_amount=1000.0,
    )
    decision, reason = assess_claim(record)
    assert decision == "deny"
    assert "inactive" in reason.lower() or "not found" in reason.lower()
