import re
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from band.client import publish_agent_event
from decision_log.logger import log_decision
from models.claim import Claim
from models.schemas import ClaimCreate, ClaimStatus


async def run_claim_pipeline(session: AsyncSession, claim_data: ClaimCreate) -> Claim:
    """Process a claim through all four agents sequentially."""
    claim = Claim(
        id=str(uuid.uuid4()),
        claimant_name=claim_data.claimant_name,
        policy_number=claim_data.policy_number,
        amount=claim_data.amount,
        description=claim_data.description,
        ssn=claim_data.ssn,
        status=ClaimStatus.PENDING.value,
    )
    session.add(claim)
    await session.flush()

    claim = await _run_intake(session, claim)
    claim = await _run_firewall(session, claim)
    claim = await _run_assessment(session, claim)
    claim = await _run_payout(session, claim)

    await session.commit()
    await session.refresh(claim)
    return claim


async def _run_intake(session: AsyncSession, claim: Claim) -> Claim:
    claim.status = ClaimStatus.INTAKE.value
    claim.updated_at = datetime.now(UTC)

    log_decision(
        agent="Intake Agent",
        action="Received claim",
        claim_id=claim.id,
        details=f"Policy {claim.policy_number}, amount ${claim.amount:.2f}",
    )
    await publish_agent_event("Intake Agent", "Claim received", claim.id)
    await session.flush()
    return claim


async def _run_firewall(session: AsyncSession, claim: Claim) -> Claim:
    claim.status = ClaimStatus.FIREWALL.value
    claim.updated_at = datetime.now(UTC)

    if claim.ssn:
        claim.ssn = re.sub(r"\d", "X", claim.ssn)
        log_decision(
            agent="Firewall Agent",
            action="Redacted SSN",
            claim_id=claim.id,
            details="PII sanitized before downstream processing",
        )
        await publish_agent_event("Firewall Agent", "SSN redacted", claim.id)
    else:
        log_decision(
            agent="Firewall Agent",
            action="No PII found",
            claim_id=claim.id,
        )

    await session.flush()
    return claim


async def _run_assessment(session: AsyncSession, claim: Claim) -> Claim:
    claim.status = ClaimStatus.ASSESSMENT.value
    claim.updated_at = datetime.now(UTC)

    approved = claim.amount <= 10_000

    if approved:
        claim.status = ClaimStatus.APPROVED.value
        log_decision(
            agent="Assessment Agent",
            action="Approved claim",
            claim_id=claim.id,
            details=f"Amount ${claim.amount:.2f} within policy limits",
        )
        await publish_agent_event("Assessment Agent", "Claim approved", claim.id)
    else:
        claim.status = ClaimStatus.DENIED.value
        log_decision(
            agent="Assessment Agent",
            action="Denied claim",
            claim_id=claim.id,
            details=f"Amount ${claim.amount:.2f} exceeds $10,000 limit",
        )
        await publish_agent_event("Assessment Agent", "Claim denied", claim.id)

    await session.flush()
    return claim


async def _run_payout(session: AsyncSession, claim: Claim) -> Claim:
    if claim.status != ClaimStatus.APPROVED.value:
        log_decision(
            agent="Payout Agent",
            action="Skipped payout",
            claim_id=claim.id,
            details="Claim not approved",
        )
        await session.flush()
        return claim

    claim.status = ClaimStatus.PAYOUT.value
    claim.updated_at = datetime.now(UTC)

    log_decision(
        agent="Payout Agent",
        action="Processed payout",
        claim_id=claim.id,
        details=f"${claim.amount:.2f} disbursed to {claim.claimant_name}",
    )
    await publish_agent_event("Payout Agent", "Payout processed", claim.id)

    claim.status = ClaimStatus.PAID.value
    await session.flush()
    return claim


async def get_claim_by_id(session: AsyncSession, claim_id: str) -> Claim | None:
    result = await session.execute(select(Claim).where(Claim.id == claim_id))
    return result.scalar_one_or_none()


async def list_claims(session: AsyncSession) -> list[Claim]:
    result = await session.execute(select(Claim).order_by(Claim.created_at.desc()))
    return list(result.scalars().all())
