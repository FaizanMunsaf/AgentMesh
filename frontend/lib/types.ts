export type AgentStatus = 'pending' | 'active' | 'complete' | 'blocked' | 'escalated';

export type Sensitivity = 'LOW' | 'MEDIUM' | 'HIGH';

export type FirewallDecision = 'PASS' | 'BLOCK' | 'TRANSFORM' | 'JUSTIFY';

export type ClaimStatus = 'approved' | 'in-review' | 'escalated' | 'denied';

export type CoverageType = 'Collision' | 'Liability' | 'Comprehensive';

export interface AgentStep {
  id: string;
  name: string;
  label: string;
  icon: string;
  status: AgentStatus;
  message: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  claimSummary?: ClaimSummary;
}

export interface ClaimSummary {
  policyNumber: string;
  incidentDate: string;
  coverageType: CoverageType;
  claimAmount: string;
  status: ClaimStatus;
}

export interface FirewallLog {
  field: string;
  sensitivity: Sensitivity;
  decision: FirewallDecision;
  destination: string;
  reason: string;
  timestamp: string;
}

export interface ClaimRecord {
  id: string;
  claimant: string;
  coverageType: CoverageType;
  amount: string;
  status: ClaimStatus;
  agentStage: string;
  time: string;
}

export interface ActivityItem {
  agent: string;
  agentColor: string;
  message: string;
  time: string;
  icon: string;
}
