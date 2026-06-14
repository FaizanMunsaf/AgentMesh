# Workflow

## Submitting a Claim

1. User submits claim via dashboard form
2. Frontend POSTs to `/api/claims/`
3. Backend runs the 4-agent pipeline
4. Decision log updates after each agent step
5. Dashboard refreshes to show the timeline

## Agent Responsibilities

### Intake Agent
- Normalizes claimant name, policy number, amount
- Logs "Received claim"

### Firewall Agent
- Redacts SSN and other PII
- Logs "Redacted SSN" or "No PII found"

### Assessment Agent
- Evaluates amount against $10,000 auto-approve threshold
- Logs "Approved claim" or "Denied claim"

### Payout Agent
- Processes disbursement for approved claims
- Logs "Processed payout" or "Skipped payout"

## Demo Scenario

```json
{
  "claimant_name": "Jane Doe",
  "policy_number": "POL-12345",
  "amount": 5000.00,
  "description": "Auto collision damage",
  "ssn": "123-45-6789"
}
```

Expected timeline:

```
10:01 Intake Agent      — Received claim
10:02 Firewall Agent    — Redacted SSN
10:03 Assessment Agent  — Approved claim
10:04 Payout Agent      — Processed payout
```
