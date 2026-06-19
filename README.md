# Agent Mesh

Agent Mesh is a 4-agent insurance-claims pipeline demo. It can run as a synchronous local API (FastAPI) for development or as four long-running Band agents that communicate in a Band chatroom.

**Architecture**

User → Intake → Firewall → Assessment ⇄ Payout

- Local API: FastAPI runs the full pipeline synchronously (Intake → Firewall → Assessment → Payout).
- Band mode: four agents (`intake`, `firewall`, `assessment`, `payout`) run continuously and interact via @mentions in a Band chatroom.

## Project layout

- `frontend/` — Next.js dashboard
- `backend/` — FastAPI + agents and shared backend helpers
  - `backend/agents/` — agent runners and tools
  - `backend/data/` — mock policies, RAG chunks, docs
  - `backend/scripts/` — helpers: `ingest_rag.py`, `start_agents.py`
- `claimguard-zeineb/` — original reference implementation used for components

## Agents and responsibilities

- Intake — Extracts structured claim fields from free-text reports, validates policy existence and status, and forwards the structured claim to the pipeline or posts to `@assessment` in Band.
- Firewall — Field-level governance: applies `policy.yaml` rules to block, transform, or annotate sensitive fields. Processes clearance requests and returns a filtered claim + decisions.
- Assessment — Performs RAG lookups and coverage analysis, requests clearance from the Firewall before touching sensitive data, and decides to approve/deny/escalate.
- Payout — Simulates payment processing after a claim is approved by Assessment.

## Band mode interaction (step-by-step)

1. Register four agents on the Band dashboard: `intake`, `firewall`, `assessment`, `payout`.
2. Add all four agents to the same Band chatroom.
3. User posts a free-text claim addressed to `@intake`.
4. `intake` extracts fields (claimant, policy number, date, coverage type, amount, description), validates the policy, and posts/forwards a structured claim to `@assessment`.
5. `assessment` asks `@firewall` for clearance by sending a JSON clearance request (role + claim).
6. `firewall` responds with a filtered claim and a `decisions` list describing any blocking/transformations.
7. `assessment` runs RAG lookups, makes a decision, and if approved, `payout` simulates payment.
8. All agent actions are logged in the decision audit and firewall logs.

## Local API mode

- Use the synchronous pipeline for development and tests; the backend handles Intake → Firewall → Assessment → Payout within HTTP request flows.

## Mock policies (available now)

These are the policy IDs you can use in sample claims (file: `backend/data/mock_policies.json`):

- NVC-10001 — holder: Jane Doe — coverages: collision, liability — active
- NVC-10002 — holder: John Smith — coverages: collision, medical, theft — active
- NVC-10003 — holder: Maria Garcia — coverages: collision, liability, medical — active
- NVC-10004 — holder: Bob Wilson — coverages: collision — INACTIVE
- NVC-10005 — holder: Alice Chen — coverages: theft, liability — active

## Files & logs

- Agent config: `backend/agent_config.yaml` — add `agent_id` and `api_key` for each agent.
- Start all agents: `backend/scripts/start_agents.py`.
- RAG ingestion: `backend/scripts/ingest_rag.py`.
- Decision audit: `decision_log/audit_log.json`.
- Firewall decisions: `logs/decisions.jsonl`.

## Quick start (development)

1. Backend (local pipeline):

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python scripts/ingest_rag.py
uvicorn main:app --reload
```

2. Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

3. Band agents (demo): copy config and start agents from `backend`:

```bash
cd backend
cp agent_config.yaml.example agent_config.yaml
cp .env.example .env
# edit backend/agent_config.yaml to add agent IDs and keys
python scripts/start_agents.py
```

Start a single agent (example — Intake):
```bash
cd backend
python -m agents.intake.band_runner
```

## Sample claim (post to Band chat addressed to `@intake`)

@intake Hi, I'm Jane Doe, policy NVC-10001. On January 15 2026 I was rear-ended at a red light on Main Street Austin by an uninsured driver. My 2022 Toyota Camry has significant bumper damage. Filing a collision claim for $4,800. Police report APD-2026-0042.

## Vercel (frontend) for monorepo

Add a `vercel.json` at the repo root to map the Next.js frontend. See the included `vercel.json` for a minimal monorepo mapping. Note: Vercel is ideal for the frontend — the FastAPI backend is typically hosted on a platform that supports long-running processes (Render, Railway, Fly, etc.) and proxied via rewrites.

## Common troubleshooting

- `401/403` or `API key not linked to a user or agent`: ensure `agent_id` and `api_key` in `backend/agent_config.yaml` are a matching, active pair copied from the Band dashboard. Runners call `load_dotenv()` so check for environment overrides in `.env`.
- WebSocket blocked: confirm network allows `wss://app.band.ai`.

## Testing

```bash
cd backend
.venv\Scripts\python.exe -m pytest -v
cd frontend
npm test
```

## Next steps

- Want me to add this `vercel.json` to the repo root and commit? I already added it — I can also create a short `AGENTS.md` with example messages for each agent if you want.

