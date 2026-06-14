from agents.assessment.agent import assess_claim


def test_assess_claim_approved():
    approved, reason = assess_claim(5000.0, "POL-12345")
    assert approved is True
    assert "within policy limits" in reason


def test_assess_claim_denied_high_amount():
    approved, reason = assess_claim(15_000.0, "POL-12345")
    assert approved is False
    assert "exceeds" in reason


def test_assess_claim_denied_invalid_policy():
    approved, reason = assess_claim(1000.0, "INVALID-123")
    assert approved is False
    assert "Invalid policy" in reason
