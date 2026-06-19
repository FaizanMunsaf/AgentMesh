import json

from agents.firewall.engine import apply_policy
from models.claim_record import ClaimRecord

SAMPLE_CLAIM = ClaimRecord(
    name="Jane Doe",
    policy_number="NVC-10001",
    incident_date="2026-01-15",
    incident_location="Main St, Austin TX",
    coverage_type="collision",
    accident_description="Rear-ended at a red light by an uninsured driver",
    medical_details="Patient experienced mild whiplash, saw doctor twice",
    police_report_number="APD-2026-0042",
    other_party_info="John Smith, uninsured",
    vehicle_info="2022 Toyota Camry",
    claim_amount=4800.0,
    bank_account="9876543210",
    ssn="123-45-6789",
    claim_category="collision",
    confidence=0.95,
)


def test_assessment_clearance_removes_sensitive_fields(tmp_path, monkeypatch):
    import agents.firewall.engine as engine_module

    monkeypatch.setattr(engine_module, "DECISIONS_LOG", tmp_path / "decisions.jsonl")
    filtered, decisions = apply_policy(SAMPLE_CLAIM, "assessment")
    assert filtered.ssn is None
    assert filtered.bank_account is None
    assert filtered.medical_details in ("low", "medium", "high")
    assert filtered.accident_description is not None
    assert filtered.claim_amount == 4800.0
    assert len(decisions) >= 1


def test_payout_clearance_keeps_only_payment_fields(tmp_path, monkeypatch):
    import agents.firewall.engine as engine_module

    monkeypatch.setattr(engine_module, "DECISIONS_LOG", tmp_path / "decisions.jsonl")
    filtered, _ = apply_policy(SAMPLE_CLAIM, "payout")
    assert filtered.name == "Jane Doe"
    assert filtered.policy_number == "NVC-10001"
    assert filtered.claim_amount == 4800.0
    assert filtered.bank_account == "9876543210"
    assert filtered.ssn is None
    assert filtered.medical_details is None
    assert filtered.accident_description is None


def test_decisions_log_written(tmp_path, monkeypatch):
    import agents.firewall.engine as engine_module

    monkeypatch.setattr(engine_module, "DECISIONS_LOG", tmp_path / "decisions.jsonl")
    apply_policy(SAMPLE_CLAIM, "assessment")
    log_path = tmp_path / "decisions.jsonl"
    assert log_path.exists()
    lines = log_path.read_text().strip().split("\n")
    assert len(lines) >= 1
    entry = json.loads(lines[0])
    assert "field" in entry
    assert "action" in entry
