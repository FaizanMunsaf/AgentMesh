'use client';

import { mockAgentSteps } from '@/lib/data';
import { AgentStep, AgentStatus } from '@/lib/types';

const agentStatusConfig: Record<AgentStatus, { color: string; bg: string; label: string }> = {
  pending: { color: 'var(--text-muted)', bg: 'var(--bg-elevated)', label: 'Pending' },
  active: { color: 'var(--accent-blue)', bg: 'var(--accent-blue-glow)', label: 'Active' },
  complete: { color: 'var(--green)', bg: 'var(--green-bg)', label: 'Complete' },
  blocked: { color: 'var(--red)', bg: 'var(--red-bg)', label: 'Blocked' },
  escalated: { color: 'var(--orange)', bg: 'var(--orange-bg)', label: 'Escalated' },
};

function AgentStepItem({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  const s = agentStatusConfig[step.status];
  return (
    <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
      {!isLast && (
        <div style={{
          position: 'absolute', left: '15px', top: '32px', bottom: '-8px', width: '1px',
          background: step.status === 'complete' ? 'var(--green)' : 'var(--border)',
          opacity: 0.4,
        }} />
      )}
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
        background: s.bg, border: `1px solid ${s.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', zIndex: 1,
        boxShadow: step.status === 'active' ? `0 0 10px ${s.color}40` : 'none',
      }}>
        {step.icon}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{step.name}</span>
          <span style={{
            fontSize: '10px', padding: '1px 6px', borderRadius: '10px',
            color: s.color, background: s.bg, fontWeight: 600,
          }}>{s.label}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step.message}</div>
        {step.timestamp && (
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>{step.timestamp}</div>
        )}
      </div>
    </div>
  );
}

export default function AgentPipeline() {
  return (
    <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 600, fontSize: '13px' }}>Agent Pipeline</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Real-time processing trace</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {mockAgentSteps.map((step, i) => (
          <AgentStepItem key={step.id} step={step} isLast={i === mockAgentSteps.length - 1} />
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Session</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>CLM-SESSION-4821</div>
      </div>
    </div>
  );
}