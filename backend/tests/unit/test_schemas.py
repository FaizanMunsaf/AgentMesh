from models.claim_record import ClaimRecord, ClearanceRequest, ClearanceResponse


def test_claim_record_defaults():
    record = ClaimRecord(name="Jane", policy_number="NVC-10001", claim_amount=100.0)
    assert record.claim_id
    assert record.ssn is None


def test_clearance_envelope_roundtrip():
    claim = ClaimRecord(name="Jane", policy_number="NVC-10001", claim_amount=100.0)
    req = ClearanceRequest(role="assessment", claim=claim)
    data = req.model_dump()
    assert data["type"] == "clearance_request"
    assert ClearanceRequest.model_validate(data).role == "assessment"

    resp = ClearanceResponse(filtered_claim=claim, decisions=[])
    assert resp.type == "clearance_response"
