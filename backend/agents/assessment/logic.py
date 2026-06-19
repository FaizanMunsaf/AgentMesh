"""Local assessment logic for the FastAPI pipeline (no LLM)."""

from agents.intake.tools import lookup_policy_sync
from models.claim_record import ClaimRecord


def assess_claim(record: ClaimRecord) -> tuple[str, str]:
    """
    Assess a cleared claim record.
    Returns (decision, reason) where decision is approve|deny|escalate.
    """
    policy = lookup_policy_sync(record.policy_number)
    if not policy.get("active"):
        return "deny", "Policy not found or inactive"

    coverage_types = policy.get("coverage_types", [])
    coverage_type = (record.coverage_type or record.claim_category or "").lower()

    if coverage_type and coverage_type not in [c.lower() for c in coverage_types]:
        return "deny", f"Coverage type '{coverage_type}' not included in policy"

    limit = policy.get("coverage_limit", 10_000)
    if record.claim_amount > limit:
        return "escalate", (
            f"Amount ${record.claim_amount:.2f} exceeds coverage limit ${limit:,.0f}"
        )

    if record.claim_amount <= 0:
        return "deny", "Claim amount must be positive"

    return "approve", f"Amount ${record.claim_amount:.2f} within policy limits"
