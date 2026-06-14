from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ClaimStatus(str, Enum):
    PENDING = "pending"
    INTAKE = "intake"
    FIREWALL = "firewall"
    ASSESSMENT = "assessment"
    PAYOUT = "payout"
    APPROVED = "approved"
    DENIED = "denied"
    PAID = "paid"


class ClaimCreate(BaseModel):
    claimant_name: str
    policy_number: str
    amount: float = Field(gt=0)
    description: str
    ssn: str | None = None


class ClaimResponse(BaseModel):
    id: str
    claimant_name: str
    policy_number: str
    amount: float
    description: str
    status: ClaimStatus
    created_at: datetime
    updated_at: datetime


class DecisionLogEntry(BaseModel):
    timestamp: str
    agent: str
    action: str
    claim_id: str | None = None
    details: str | None = None
