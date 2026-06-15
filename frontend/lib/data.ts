import { AgentStep, ChatMessage, FirewallLog, ClaimRecord, ActivityItem } from './types';

export const mockAgentSteps: AgentStep[] = [
  {
    id: 'intake',
    name: 'Intake Agent',
    label: 'intake',
    icon: '📥',
    status: 'complete',
    message: 'Claimant verified. Policy POL-2024-8821 active.',
    timestamp: '14:02:11',
  },
  {
    id: 'firewall',
    name: 'Firewall Agent',
    label: 'firewall',
    icon: '🛡',
    status: 'complete',
    message: '3 fields blocked, 1 transformed, 8 passed.',
    timestamp: '14:02:14',
  },
  {
    id: 'assessment',
    name: 'Assessment Agent',
    label: 'assessment',
    icon: '🔍',
    status: 'active',
    message: 'Running 4-point coverage analysis…',
    timestamp: '14:02:17',
  },
  {
    id: 'payout',
    name: 'Payout Agent',
    label: 'payout',
    icon: '💳',
    status: 'pending',
    message: 'Awaiting assessment result.',
    timestamp: undefined,
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'I was in a car accident last Tuesday. My policy number is POL-2024-8821.',
    timestamp: '14:02:08',
  },
  {
    id: '2',
    role: 'assistant',
    content: "I've received your claim. Let me verify your policy and collect the details needed to process this. Your policy is active — here's a summary of what I have so far.",
    timestamp: '14:02:11',
    claimSummary: {
      policyNumber: 'POL-2024-8821',
      incidentDate: '2024-01-09',
      coverageType: 'Collision',
      claimAmount: '$4,200',
      status: 'in-review',
    },
  },
  {
    id: '3',
    role: 'user',
    content: 'The other car ran a red light and hit my front bumper. I have a police report.',
    timestamp: '14:02:44',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Thank you. Police report noted — this strengthens your claim. The Assessment Agent is now running a 4-point coverage analysis against your NovaCover policy. This will check coverage type, policy status, exclusions, and authority limits. I\'ll update you shortly.',
    timestamp: '14:02:47',
  },
];

export const mockFirewallLogs: FirewallLog[] = [
  { field: 'name', sensitivity: 'LOW', decision: 'PASS', destination: 'Assessment + Payout', reason: 'Identity check / payee match', timestamp: '14:02:14' },
  { field: 'ssn', sensitivity: 'HIGH', decision: 'BLOCK', destination: 'Both', reason: 'Not needed by either agent', timestamp: '14:02:14' },
  { field: 'policy_number', sensitivity: 'LOW', decision: 'PASS', destination: 'Assessment + Payout', reason: 'Coverage check / audit trail', timestamp: '14:02:14' },
  { field: 'incident_date', sensitivity: 'LOW', decision: 'PASS', destination: 'Assessment', reason: 'Policy-active check', timestamp: '14:02:14' },
  { field: 'incident_location', sensitivity: 'MEDIUM', decision: 'PASS', destination: 'Assessment', reason: 'Jurisdiction check', timestamp: '14:02:14' },
  { field: 'coverage_type', sensitivity: 'LOW', decision: 'PASS', destination: 'Assessment', reason: 'Peril match verification', timestamp: '14:02:14' },
  { field: 'accident_description', sensitivity: 'MEDIUM', decision: 'PASS', destination: 'Assessment', reason: 'Core decision input', timestamp: '14:02:14' },
  { field: 'medical_details', sensitivity: 'HIGH', decision: 'TRANSFORM', destination: 'Assessment', reason: 'Summarized to severity level only', timestamp: '14:02:14' },
  { field: 'police_report_number', sensitivity: 'LOW', decision: 'PASS', destination: 'Assessment', reason: 'Fraud check corroboration', timestamp: '14:02:14' },
  { field: 'other_party_info', sensitivity: 'MEDIUM', decision: 'JUSTIFY', destination: 'Assessment', reason: 'Third-party PII needed for liability', timestamp: '14:02:14' },
  { field: 'vehicle_info', sensitivity: 'MEDIUM', decision: 'PASS', destination: 'Assessment', reason: 'Coverage match verification', timestamp: '14:02:14' },
  { field: 'claim_amount', sensitivity: 'LOW', decision: 'PASS', destination: 'Assessment + Payout', reason: 'Authority-limit check / disbursement', timestamp: '14:02:14' },
  { field: 'bank_account', sensitivity: 'HIGH', decision: 'BLOCK', destination: 'Assessment', reason: 'Not needed by assessment', timestamp: '14:02:14' },
  { field: 'bank_account', sensitivity: 'HIGH', decision: 'JUSTIFY', destination: 'Payout', reason: 'Core disbursement field', timestamp: '14:02:15' },
];

export const mockClaims: ClaimRecord[] = [
  { id: 'CLM-0041', claimant: 'Sarah M.', coverageType: 'Collision', amount: '$4,200', status: 'in-review', agentStage: 'Assessment', time: '2 min ago' },
  { id: 'CLM-0040', claimant: 'David K.', coverageType: 'Comprehensive', amount: '$890', status: 'approved', agentStage: 'Complete', time: '18 min ago' },
  { id: 'CLM-0039', claimant: 'Priya N.', coverageType: 'Liability', amount: '$14,500', status: 'escalated', agentStage: 'Human Review', time: '1 hr ago' },
  { id: 'CLM-0038', claimant: 'James R.', coverageType: 'Collision', amount: '$2,100', status: 'denied', agentStage: 'Complete', time: '3 hr ago' },
];

export const mockActivity: ActivityItem[] = [
  { agent: 'Intake', agentColor: '#3B82F6', message: 'New claim submitted — Sarah M.', time: '2m ago', icon: '📥' },
  { agent: 'Firewall', agentColor: '#8B5CF6', message: 'Blocked: SSN field — HIGH sensitivity', time: '2m ago', icon: '🛡' },
  { agent: 'Firewall', agentColor: '#8B5CF6', message: 'Transformed: medical_details → severity', time: '2m ago', icon: '🛡' },
  { agent: 'Assessment', agentColor: '#F59E0B', message: 'Running 4-point analysis — CLM-0041', time: '1m ago', icon: '🔍' },
  { agent: 'Payout', agentColor: '#10B981', message: 'Payment processed — CLM-0040 · $890', time: '18m ago', icon: '💳' },
  { agent: 'Assessment', agentColor: '#F59E0B', message: 'Escalated CLM-0039 — amount exceeds $10k', time: '1h ago', icon: '🔍' },
  { agent: 'Intake', agentColor: '#3B82F6', message: 'New claim submitted — James R.', time: '3h ago', icon: '📥' },
];
