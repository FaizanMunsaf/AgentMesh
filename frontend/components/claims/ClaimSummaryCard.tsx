'use client';

import { ChatMessage, ClaimStatus } from '@/lib/types';

const claimStatusConfig: Record<ClaimStatus, { color: string; label: string }> = {
  approved: { color: 'var(--green)', label: 'Approved' },
  'in-review': { color: 'var(--accent-blue)', label: 'In Review' },
  escalated: { color: 'var(--orange)', label: 'Escalated' },
  denied: { color: 'var(--red)', label: 'Denied' },
};

export default function ClaimSummaryCard({ summary }: { summary: NonNullable<ChatMessage['claimSummary']> }) {
  const s = claimStatusConfig[summary.status];
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '14px', marginTop: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Claim Summary</span>
        <span style={{ fontSize: '11px', color: s.color, fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: `${s.color}18` }}>{s.label}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'Policy No.', value: summary.policyNumber },
          { label: 'Incident Date', value: summary.incidentDate },
          { label: 'Coverage', value: summary.coverageType },
          { label: 'Claim Amount', value: summary.claimAmount },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: item.label === 'Policy No.' || item.label === 'Claim Amount' ? 'var(--font-mono)' : 'inherit' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}