import json

from agents.intake.tools import lookup_policy_for_agent


def test_policy_lookup_active():
    result = json.loads(lookup_policy_for_agent("NVC-10001"))
    assert result["active"] is True


def test_policy_lookup_not_found():
    result = json.loads(lookup_policy_for_agent("NVC-99999"))
    assert result["active"] is False
