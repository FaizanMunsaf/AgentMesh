export interface Claim {
  id: string;
  claimant_name: string;
  policy_number: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ClaimCreate {
  claimant_name: string;
  policy_number: string;
  amount: number;
  description: string;
  ssn?: string;
}

export interface DecisionLogEntry {
  timestamp: string;
  agent: string;
  action: string;
  claim_id?: string;
  details?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function submitClaim(data: ClaimCreate): Promise<Claim> {
  return request<Claim>("/api/claims/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchClaims(): Promise<Claim[]> {
  return request<Claim[]>("/api/claims/");
}

export async function fetchDecisionLog(): Promise<DecisionLogEntry[]> {
  return request<DecisionLogEntry[]>("/api/decision-log/");
}
