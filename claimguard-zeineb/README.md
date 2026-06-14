# ClaimGuard Agents — Zeineb's Implementation

This folder contains the 4 agents built for the ClaimGuard auto-insurance claims pipeline, plus shared schemas and tests. All 24 tests pass locally. This is ready for review before merging into `backend/agents/`.

---

## What Was Built

### Agents

| Agent | Location | Type | Status |
|---|---|---|---|
| Intake | `agents/intake/` | LangGraph ReAct + Band | ✅ Done |
| Compliance Firewall | `agents/firewall/` | Deterministic LangGraph + Band | ✅ Done |
| Assessment | `agents/assessment/` | LangGraph ReAct + Band + RAG | ✅ Done |
| Payout | `agents/payout/` | LangGraph ReAct + Band | ✅ Done |

### Shared

| File | Purpose |
|---|---|
| `shared/schemas.py` | `ClaimRecord`, `ClearanceRequest`, `ClearanceResponse` — Pydantic v2 models used by all agents |
| `shared/llm.py` | `get_chat_model()` — factory for the LangChain ChatOpenAI client pointed at AI/ML API |

### Tests

| File | Coverage |
|---|---|
| `tests/test_schemas.py` | ClaimRecord defaults, roundtrip serialization, envelope types |
| `tests/test_firewall.py` | All 13 policy fields — block / transform / pass_justify per agent role |
| `tests/test_intake_tools.py` | Policy lookup tool (active, inactive, not found) |
| `tests/test_assessment_rag.py` | ChromaDB retrieval for policy clauses and NAIC regulations |
| `tests/test_e2e_local.py` | Full pipeline as direct Python calls — no Band connection needed |

---

## How the Agents Work Together

```
User (Band chat)
    │ free-text claim message
    ▼
[Intake Agent]
    │ extracts ClaimRecord from text, validates policy via mock DB
    │ @mention @assessment with full ClaimRecord JSON
    ▼
[Assessment Agent]
    │ 1. @mention @firewall — "clear me for role=assessment"
    │          ▼
    │   [Compliance Firewall]
    │   applies policy.yaml rules field-by-field
    │   blocks SSN, bank_account; transforms medical_details → severity
    │   responds with filtered ClaimRecord + justifications
    │          ▲
    │ 2. runs RAG on ChromaDB (novacover_policy + naic_regulations)
    │ 3. Four-Point Coverage Analysis → approve / deny / escalate
    │
    ├─ deny/escalate → reply to user with decision + NAIC citation
    └─ approve → @mention @payout with approved ClaimRecord
                    ▼
             [Payout Agent]
             1. @mention @firewall — "clear me for role=payout"
             2. receives only: name, policy_number, claim_amount, bank_account
             3. simulates payment → confirms to user
```

### Key design point for the orchestrator

The Firewall is **not** a preprocessing step — it is a queryable Band participant. Assessment and Payout each send it a `clearance_request` message and wait for a `clearance_response` before acting. Band is the medium of an actual governance negotiation, not just a transport layer.

---

## What the Orchestration Teammate Needs to Do

### 1. Register 4 agents on the Band dashboard

Create one agent per role: `intake`, `firewall`, `assessment`, `payout`. Each gets its own `agent_id` and `api_key` from the dashboard.

### 2. Fill `agent_config.yaml`

```yaml
intake:
  agent_id: "<uuid>"
  api_key: "<per-agent key>"
firewall:
  agent_id: "<uuid>"
  api_key: "<per-agent key>"
assessment:
  agent_id: "<uuid>"
  api_key: "<per-agent key>"
payout:
  agent_id: "<uuid>"
  api_key: "<per-agent key>"
```

### 3. Fill `.env`

```
AIML_API_KEY=dbdf526519af297091f07734c5ae09f0
AIML_BASE_URL=https://api.aimlapi.com/v1
MODEL_NAME=<model name from AI/ML API dashboard>
THENVOI_REST_URL=<from Band dashboard>
THENVOI_WS_URL=<from Band dashboard>
```

### 4. Set up ChromaDB (one-time)

The Assessment agent uses RAG. Before running it, extract the PDFs and build the vector store:

```bash
# Extract PDFs to markdown
python -c "
from pypdf import PdfReader
def extract(path):
    reader = PdfReader(path)
    return '\n\n'.join(page.extract_text() or '' for page in reader.pages)
with open('data/novacover_policy.md', 'w', encoding='utf-8') as f:
    f.write(extract('novacover_policy.md.pdf'))
with open('data/naic_regulations.md', 'w', encoding='utf-8') as f:
    f.write(extract('NAIC Model Laws, Regulations, Guidelines and Other Resources—July 1997.pdf'))
"

# Build ChromaDB (downloads ~80MB model on first run)
python scripts/ingest_rag.py
```

### 5. Start all 4 agents in separate terminals

```bash
python -m claimguard.agents.firewall.agent   # start firewall first
python -m claimguard.agents.intake.agent
python -m claimguard.agents.assessment.agent
python -m claimguard.agents.payout.agent
```

### 6. Add all 4 agents to the same Band chatroom

On the Band dashboard: create a chatroom and add all 4 agents as participants.

### 7. Test with a sample claim

Send this to `@intake` in the chatroom:

```
@intake Hi, I'm Jane Doe, policy NVC-10001. On January 15 2026 I was rear-ended at a red light on Main Street Austin by an uninsured driver. My 2022 Toyota Camry has significant bumper damage. Filing a collision claim for $4,800. Police report APD-2026-0042.
```

**Expected flow:**
- Intake extracts fields → validates policy → forwards to @assessment
- Assessment requests clearance from @firewall → gets filtered record → RAG analysis → approve → forwards to @payout
- Payout requests clearance from @firewall → gets payment fields only → confirms to user
- `logs/decisions.jsonl` has entries for every blocked/transformed/justified field

---

## Dependencies

```
band-sdk[langgraph]
langchain-openai
langgraph
pydantic>=2
chromadb
sentence-transformers   # all-MiniLM-L6-v2
python-dotenv
PyYAML
pypdf
pytest
pytest-asyncio
```

Install with:
```bash
pip install -e .
```

---

## Firewall Policy Reference

The Firewall applies `agents/firewall/policy.yaml`. Key rules:

| Field | Assessment | Payout |
|---|---|---|
| `ssn` | blocked | blocked |
| `bank_account` | blocked | passed (with justification) |
| `medical_details` | transformed → low/medium/high | blocked |
| `other_party_info` | passed (with justification) | blocked |
| `incident_date` | passed | blocked |
| `accident_description` | passed | blocked |
| `name`, `policy_number`, `claim_amount` | passed | passed |

Every non-silent decision is logged to `logs/decisions.jsonl`.
