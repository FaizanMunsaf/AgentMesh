import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from agents.assessment.logic import assess_claim
from agents.firewall.engine import apply_policy
from agents.intake.tools import lookup_policy_sync
from decision_log.logger import log_decision, log_firewall_decisions
from mesh_platform.client import publish_agent_event
from models.claim import Claim
from models.claim_record import ClaimRecord
from models.schemas import ClaimCreate, ClaimStatus


def _to_claim_record(data: ClaimCreate, claim_id: str) -> ClaimRecord:
    return ClaimRecord(
        claim_id=claim_id,
        name=data.claimant_name.strip().title(),
        policy_number=data.policy_number.strip().upper(),
        accident_description=data.description.strip(),
        claim_amount=round(data.amount, 2),
        coverage_type="collision",
        claim_category="collision",
        confidence=0.95,
        ssn=data.ssn,
        bank_account=data.bank_account,
    )


async def run_claim_pipeline(session: AsyncSession, claim_data: ClaimCreate) -> Claim:
    """Process a claim through the 4-agent pipeline with firewall clearance."""
    claim_id = str(uuid.uuid4())
    record = _to_claim_record(claim_data, claim_id)

    claim = Claim(
        id=claim_id,
        claimant_name=record.name,
        policy_number=record.policy_number,
        amount=record.claim_amount,
        description=record.accident_description or "",
        ssn=record.ssn,
        status=ClaimStatus.PENDING.value,
    )
    session.add(claim)
    await session.flush()

    # Intake
    claim.status = ClaimStatus.INTAKE.value
    claim.updated_at = datetime.now(UTC)
    policy = lookup_policy_sync(record.policy_number)
    if not policy.get("active"):
        claim.status = ClaimStatus.DENIED.value
        log_decision(
            agent="Intake Agent",
            action="Policy invalid",
            claim_id=claim.id,
            details=policy.get("error", "Policy not found or inactive"),
        )
        await session.commit()
        await session.refresh(claim)
        return claim

    log_decision(
        agent="Intake Agent",
        action="Received claim",
        claim_id=claim.id,
        details=f"Policy {record.policy_number}, amount ${record.claim_amount:.2f}",
    )
    await publish_agent_event("Intake Agent", "Claim received", claim.id)

    # Assessment clearance via Firewall
    claim.status = ClaimStatus.FIREWALL.value
    assessment_record, fw_decisions = apply_policy(record, "assessment")
    log_firewall_decisions(assessment_record.claim_id, "assessment", fw_decisions)
    log_decision(
        agent="Firewall Agent",
        action="Cleared for assessment",
        claim_id=claim.id,
        details=f"{len(fw_decisions)} field decisions applied",
    )
    await publish_agent_event("Firewall Agent", "Assessment clearance", claim.id)

    # Assessment
    claim.status = ClaimStatus.ASSESSMENT.value
    decision, reason = assess_claim(assessment_record)
    assessment_record.decision = decision
    assessment_record.decision_reason = reason

    if decision == "approve":
        claim.status = ClaimStatus.APPROVED.value
        log_decision(
            agent="Assessment Agent",
            action="Approved claim",
            claim_id=claim.id,
            details=reason,
        )
        await publish_agent_event("Assessment Agent", "Claim approved", claim.id)
    else:
        claim.status = ClaimStatus.DENIED.value
        log_decision(
            agent="Assessment Agent",
            action=f"{decision.title()} claim",
            claim_id=claim.id,
            details=reason,
        )
        await publish_agent_event("Assessment Agent", f"Claim {decision}", claim.id)
        await session.commit()
        await session.refresh(claim)
        return claim

    # Payout clearance via Firewall
    payout_record, payout_decisions = apply_policy(assessment_record, "payout")
    log_firewall_decisions(payout_record.claim_id, "payout", payout_decisions)
    log_decision(
        agent="Firewall Agent",
        action="Cleared for payout",
        claim_id=claim.id,
        details=f"{len(payout_decisions)} field decisions applied",
    )

    # Payout
    claim.status = ClaimStatus.PAYOUT.value
    last_four = (
        payout_record.bank_account[-4:]
        if payout_record.bank_account and len(payout_record.bank_account) >= 4
        else "****"
    )
    log_decision(
        agent="Payout Agent",
        action="Processed payout",
        claim_id=claim.id,
        details=(
            f"${payout_record.claim_amount:.2f} disbursed to account ending {last_four}"
        ),
    )
    await publish_agent_event("Payout Agent", "Payout processed", claim.id)
    claim.status = ClaimStatus.PAID.value

    await session.commit()
    await session.refresh(claim)
    return claim


async def get_claim_by_id(session: AsyncSession, claim_id: str) -> Claim | None:
    result = await session.execute(select(Claim).where(Claim.id == claim_id))
    return result.scalar_one_or_none()


async def list_claims(session: AsyncSession) -> list[Claim]:
    result = await session.execute(select(Claim).order_by(Claim.created_at.desc()))
    return list(result.scalars().all())
