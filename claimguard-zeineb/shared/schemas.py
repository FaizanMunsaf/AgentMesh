from uuid import uuid4
from typing import Literal
from pydantic import BaseModel, Field


class ClaimRecord(BaseModel):
    claim_id: str = Field(default_factory=lambda: str(uuid4()))
    # Identity
    name: str
    ssn: str | None = None
    policy_number: str
    # Incident
    incident_date: str | None = None
    incident_location: str | None = None
    coverage_type: str | None = None
    accident_description: str | None = None
    medical_details: str | None = None
    police_report_number: str | None = None
    other_party_info: str | None = None
    vehicle_info: str | None = None
    # Financial
    claim_amount: float
    bank_account: str | None = None
    # Pipeline metadata
    claim_category: str | None = None
    confidence: float | None = None
    decision: str | None = None
    decision_reason: str | None = None
    policy_clause_cited: str | None = None


class ClearanceRequest(BaseModel):
    type: Literal["clearance_request"] = "clearance_request"
    role: Literal["assessment", "payout"]
    claim: ClaimRecord


class ClearanceResponse(BaseModel):
    type: Literal["clearance_response"] = "clearance_response"
    filtered_claim: ClaimRecord
    decisions: list[dict]
