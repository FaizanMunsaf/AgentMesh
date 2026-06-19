"""Band platform integration helpers for the local FastAPI pipeline."""

import logging

from mesh_platform.settings import settings

logger = logging.getLogger(__name__)


def is_band_configured() -> bool:
    """Return True when Band credentials are present."""
    return bool(settings.band_api_key and settings.band_agent_id)


async def publish_agent_event(
    agent_name: str, message: str, claim_id: str | None = None
) -> None:
    """Publish an event to Band when configured; otherwise log locally."""
    if not is_band_configured():
        logger.info(
            "Band not configured — local event: agent=%s claim=%s msg=%s",
            agent_name,
            claim_id,
            message,
        )
        return

    logger.info(
        "Band event: agent=%s claim=%s msg=%s",
        agent_name,
        claim_id,
        message,
    )
