# Agent Mesh

Production-grade hackathon project demonstrating a 4-agent insurance claims pipeline powered by the Band SDK.

## Architecture

```
Claim → Intake Agent → Firewall Agent → Assessment Agent → Payout Agent
```

Each agent communicates via Band and logs decisions to a shared audit trail visible on the dashboard.

## Project Structure

```
├── frontend/     Next.js 15 dashboard
├── backend/      FastAPI + Band SDK agents
├── docs/         Architecture & workflow docs
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker (optional)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
pip install pre-commit
pre-commit install
uvicorn main:app --reload
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Dashboard: http://localhost:3000

### Docker

```bash
docker compose up --build
```

## Agents

| Agent | Role |
|-------|------|
| **Intake** | Receives and normalizes incoming claims |
| **Firewall** | Redacts PII (SSN, etc.) before downstream processing |
| **Assessment** | Evaluates claim validity and approves/denies |
| **Payout** | Processes approved payouts |

## Decision Log

The dashboard reads from `backend/decision_log/audit_log.json` to visualize the agent pipeline in real time:

```
10:01 Intake Agent
10:02 Firewall Redacted SSN
10:03 Assessment Approved Claim
10:04 Payout Processed
```

## Testing

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

## CI

GitHub Actions workflows run on every push:

- `backend-ci.yml` — Ruff lint/format + pytest
- `frontend-ci.yml` — ESLint + Jest
