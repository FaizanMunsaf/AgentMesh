import json
from pathlib import Path

_DATA_ROOT = Path(__file__).resolve().parents[2] / "data"
_POLICIES_PATH = _DATA_ROOT / "mock_policies.json"


def lookup_policy_sync(policy_number: str) -> dict:
    """Synchronous policy lookup for the local API pipeline."""
    with open(_POLICIES_PATH, encoding="utf-8-sig") as f:
        policies = json.load(f)
    policy = policies.get(policy_number)
    if not policy:
        return {"active": False, "error": "Policy not found"}
    return policy


def lookup_policy_for_agent(policy_number: str) -> str:
    """JSON string result for LangChain tool and tests."""
    return json.dumps(lookup_policy_sync(policy_number))
