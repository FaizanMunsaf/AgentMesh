from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from agents.intake.agent import normalize_claim
from agents.pipeline import get_claim_by_id, list_claims, run_claim_pipeline
from database.session import get_session
from models.schemas import ClaimCreate, ClaimResponse, ClaimStatus

router = APIRouter()


def _to_response(claim) -> ClaimResponse:
    return ClaimResponse(
        id=claim.id,
        claimant_name=claim.claimant_name,
        policy_number=claim.policy_number,
        amount=claim.amount,
        description=claim.description,
        status=ClaimStatus(claim.status),
        created_at=claim.created_at,
        updated_at=claim.updated_at,
    )


@router.post("/", response_model=ClaimResponse)
async def submit_claim(
    data: ClaimCreate,
    session: AsyncSession = Depends(get_session),
) -> ClaimResponse:
    normalized = normalize_claim(data)
    claim = await run_claim_pipeline(session, normalized)
    return _to_response(claim)


@router.get("/", response_model=list[ClaimResponse])
async def get_claims(
    session: AsyncSession = Depends(get_session),
) -> list[ClaimResponse]:
    claims = await list_claims(session)
    return [_to_response(c) for c in claims]


@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(
    claim_id: str,
    session: AsyncSession = Depends(get_session),
) -> ClaimResponse:
    claim = await get_claim_by_id(session, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return _to_response(claim)
