import json
import pytest
from claimguard.agents.intake.tools import lookup_policy


def test_lookup_active_policy():
    result = json.loads(lookup_policy.invoke({"policy_number": "NVC-10001"}))
    assert result["active"] is True
    assert result["holder_name"] == "Jane Doe"
    assert "collision" in result["coverage_types"]


def test_lookup_inactive_policy():
    result = json.loads(lookup_policy.invoke({"policy_number": "NVC-10004"}))
    assert result["active"] is False


def test_lookup_nonexistent_policy():
    result = json.loads(lookup_policy.invoke({"policy_number": "NVC-99999"}))
    assert result["active"] is False
    assert "error" in result
