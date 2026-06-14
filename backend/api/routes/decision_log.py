from fastapi import APIRouter

from decision_log.logger import clear_decision_log, get_decision_log
from models.schemas import DecisionLogEntry

router = APIRouter()


@router.get("/", response_model=list[DecisionLogEntry])
async def read_decision_log() -> list[DecisionLogEntry]:
    entries = get_decision_log()
    return [DecisionLogEntry(**e) for e in entries]


@router.delete("/")
async def reset_decision_log() -> dict[str, str]:
    clear_decision_log()
    return {"status": "cleared"}
