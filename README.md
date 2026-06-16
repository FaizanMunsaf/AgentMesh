# Agent Mesh

Production-grade hackathon project demonstrating a 4-agent insurance claims pipeline powered by the Band SDK.

## Architecture

```
User → Intake → Assessment ⇄ Firewall → Payout
```

- **Local API mode**: FastAPI runs the full pipeline synchronously with firewall clearance
- **Band mode**: 4 long-running agents communicate via @mentions in a Band chatroom

## Project Structure

```
├── frontend/              Next.js dashboard
├── backend/               FastAPI + merged claimguard agents
│   ├── agents/            intake, firewall, assessment, payout
│   ├── scripts/           ingest_rag.py, start_agents.py
│   └── data/              mock policies, policy docs, RAG chunks
├── claimguard-zeineb/     Original reference implementation
└── docker-compose.yml
```

## Quick Start

### Backend API (local pipeline)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python scripts/ingest_rag.py
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Dashboard: http://localhost:3000

### Band agents (production demo)

1. Register 4 agents on the Band dashboard (`intake`, `firewall`, `assessment`, `payout`)
2. Copy config files:
   ```bash
   cd backend
   cp agent_config.yaml.example agent_config.yaml
   cp .env.example .env
   # Fill in agent IDs, API keys, and AIML_API_KEY
   ```
3. Ingest RAG data: `python scripts/ingest_rag.py`
4. Start all agents:
   ```bash
   python scripts/start_agents.py
   ```
5. Add all 4 agents to the same Band chatroom and message `@intake`

## Agents

| Agent | Role |
|-------|------|
| **Intake** | Extracts claim fields, validates policy via mock DB |
| **Firewall** | Field-level governance via `policy.yaml` (block/transform/justify) |
| **Assessment** | RAG-based coverage analysis, approve/deny/escalate |
| **Payout** | Payment-only clearance, simulated disbursement |

## Decision Log

The dashboard reads `/api/decision-log` showing:
- Agent pipeline steps (`audit_log.json`)
- Firewall field-level decisions (`logs/decisions.jsonl`)

## Testing

```bash
cd backend && .venv\Scripts\python.exe -m pytest -v
cd frontend && npm test
```

## Sample claim (API or Band)

Policy `NVC-10001`, amount `$4,800`, include SSN and bank account to demo firewall redaction.
