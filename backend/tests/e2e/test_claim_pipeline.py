import pytest
from httpx import ASGITransport, AsyncClient

from decision_log.logger import clear_decision_log
from main import app


@pytest.fixture(autouse=True)
def reset_log():
    clear_decision_log()
    yield
    clear_decision_log()


@pytest.mark.asyncio
async def test_claim_pipeline_e2e():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/claims/",
            json={
                "claimant_name": "john doe",
                "policy_number": "pol-98765",
                "amount": 5000.0,
                "description": "Water damage claim",
                "ssn": "123-45-6789",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "paid"
        assert data["claimant_name"] == "John Doe"
        assert data["policy_number"] == "POL-98765"

        log_response = await client.get("/api/decision-log/")
        log_entries = log_response.json()
    assert len(log_entries) >= 4
    agents = [e["agent"] for e in log_entries]
    assert "Intake Agent" in agents
    assert "Firewall Agent" in agents
    assert "Assessment Agent" in agents
    assert "Payout Agent" in agents
