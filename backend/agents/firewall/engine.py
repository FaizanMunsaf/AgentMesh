import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

import yaml

from models.claim_record import ClaimRecord

POLICY_PATH = Path(__file__).parent / "policy.yaml"
DECISIONS_LOG = Path("logs/decisions.jsonl")

TargetAgent = Literal["assessment", "payout"]
FirewallDecision = dict


def _load_policy() -> dict:
    with open(POLICY_PATH) as f:
        return yaml.safe_load(f)


def _severity_category(medical_text: str) -> str:
    text = medical_text.lower()
    if any(
        w in text for w in ["surgery", "hospitali", "fracture", "critical", "severe"]
    ):
        return "high"
    if any(w in text for w in ["injury", "pain", "treatment", "doctor", "clinic"]):
        return "medium"
    return "low"


_TRANSFORMS = {"severity_category": _severity_category}


def _write_log(
    claim_id: str,
    target_agent: str,
    field: str,
    action: str,
    reason: str,
    sensitivity: str,
) -> None:
    DECISIONS_LOG.parent.mkdir(exist_ok=True)
    entry = {
        "timestamp": datetime.now(UTC).strftime("%H:%M"),
        "claim_id": claim_id,
        "target_agent": target_agent,
        "field": field,
        "action": action,
        "reason": reason,
        "sensitivity": sensitivity,
    }
    with open(DECISIONS_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def apply_policy(
    record: ClaimRecord, target_agent: TargetAgent
) -> tuple[ClaimRecord, list[FirewallDecision]]:
    """Apply field-level policy rules for target_agent."""
    policy = _load_policy()
    data = record.model_dump()
    decisions: list[FirewallDecision] = []

    for field, rules in policy["fields"].items():
        if field not in data or data[field] is None:
            continue

        agent_rule = rules.get(target_agent, {})
        if isinstance(agent_rule, str):
            action, reason = agent_rule, ""
        else:
            action = agent_rule.get("action", "pass")
            reason = agent_rule.get("reason", "")

        sensitivity = rules.get("sensitivity", "LOW")

        if action == "block":
            data[field] = None
            decision = {
                "field": field,
                "action": "block",
                "reason": f"not needed by {target_agent}",
                "sensitivity": sensitivity,
            }
            decisions.append(decision)
            _write_log(
                record.claim_id,
                target_agent,
                field,
                "block",
                decision["reason"],
                sensitivity,
            )

        elif action == "transform":
            transform_key = agent_rule.get("transform")
            fn = _TRANSFORMS.get(transform_key)
            if fn and isinstance(data[field], str):
                data[field] = fn(data[field])
            decision = {
                "field": field,
                "action": "transform",
                "reason": reason,
                "sensitivity": sensitivity,
            }
            decisions.append(decision)
            _write_log(
                record.claim_id, target_agent, field, "transform", reason, sensitivity
            )

        elif action == "pass_justify":
            decision = {
                "field": field,
                "action": "pass_justify",
                "reason": reason,
                "sensitivity": sensitivity,
            }
            decisions.append(decision)
            _write_log(
                record.claim_id,
                target_agent,
                field,
                "pass_justify",
                reason,
                sensitivity,
            )

    return ClaimRecord(**data), decisions
