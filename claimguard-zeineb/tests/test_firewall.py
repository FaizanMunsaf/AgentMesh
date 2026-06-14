import json
import pytest
from pathlib import Path
from claimguard.shared.schemas import ClaimRecord
from claimguard.agents.firewall.engine import apply_policy, FirewallDecision


FULL_CLAIM = ClaimRecord(
    name="Jane Doe",
    policy_number="NVC-10001",
    incident_date="2026-01-15",
    incident_location="Main St, Austin TX",
    coverage_type="collision",
    accident_description="Rear-ended at a red light, sustained whiplash and vehicle damage",
    medical_details="Patient required hospitalization for severe cervical fracture",
    police_report_number="APD-2026-0042",
    other_party_info="John Smith, license TX-ABC-1234",
    vehicle_info="2022 Toyota Camry, VIN 1HGCM82633A123456",
    claim_amount=12500.0,
    bank_account="1234567890",
    ssn="123-45-6789",
)


def test_ssn_blocked_for_assessment():
    result, decisions = apply_policy(FULL_CLAIM, "assessment")
    assert result.ssn is None


def test_ssn_blocked_for_payout():
    result, decisions = apply_policy(FULL_CLAIM, "payout")
    assert result.ssn is None


def test_bank_account_blocked_for_assessment():
    result, decisions = apply_policy(FULL_CLAIM, "assessment")
    assert result.bank_account is None


def test_bank_account_passes_for_payout():
    result, decisions = apply_policy(FULL_CLAIM, "payout")
    assert result.bank_account == "1234567890"


def test_medical_details_transformed_for_assessment():
    result, decisions = apply_policy(FULL_CLAIM, "assessment")
    assert result.medical_details in ("low", "medium", "high")
    assert result.medical_details == "high"


def test_medical_details_blocked_for_payout():
    result, decisions = apply_policy(FULL_CLAIM, "payout")
    assert result.medical_details is None


def test_other_party_info_passes_for_assessment_with_justification():
    result, decisions = apply_policy(FULL_CLAIM, "assessment")
    assert result.other_party_info is not None
    pass_justify_decisions = [d for d in decisions if d["field"] == "other_party_info" and d["action"] == "pass_justify"]
    assert len(pass_justify_decisions) == 1


def test_incident_date_blocked_for_payout():
    result, decisions = apply_policy(FULL_CLAIM, "payout")
    assert result.incident_date is None


def test_name_passes_for_both_agents():
    result_a, _ = apply_policy(FULL_CLAIM, "assessment")
    result_p, _ = apply_policy(FULL_CLAIM, "payout")
    assert result_a.name == "Jane Doe"
    assert result_p.name == "Jane Doe"


def test_decisions_log_has_no_silent_pass():
    _, decisions = apply_policy(FULL_CLAIM, "assessment")
    actions = {d["action"] for d in decisions}
    assert "pass" not in actions


def test_claim_id_preserved():
    result, _ = apply_policy(FULL_CLAIM, "assessment")
    assert result.claim_id == FULL_CLAIM.claim_id
