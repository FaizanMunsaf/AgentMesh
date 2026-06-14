"""Intake agent — receives and normalizes incoming claims."""

from models.schemas import ClaimCreate


def normalize_claim(data: ClaimCreate) -> ClaimCreate:
    """Normalize claimant data before pipeline processing."""
    return ClaimCreate(
        claimant_name=data.claimant_name.strip().title(),
        policy_number=data.policy_number.strip().upper(),
        amount=round(data.amount, 2),
        description=data.description.strip(),
        ssn=data.ssn.strip() if data.ssn else None,
    )
