import json
from pathlib import Path
from langchain_core.tools import tool

_POLICIES_PATH = Path("data/mock_policies.json")


@tool
def lookup_policy(policy_number: str) -> str:
    """Look up a policy by number. Returns active status, holder name, and coverage types."""
    with open(_POLICIES_PATH, encoding="utf-8-sig") as f:
        policies = json.load(f)
    policy = policies.get(policy_number)
    if not policy:
        return json.dumps({"active": False, "error": "Policy not found"})
    return json.dumps(policy)
