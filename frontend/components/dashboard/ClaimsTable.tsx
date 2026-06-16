'use client';
import { mockClaims } from '@/lib/data';
import { ClaimStatus } from '@/lib/types';

const statusConfig: Record<ClaimStatus, { label: string; color: string; bg: string }> = {
  approved: { label: 'Approved', color: 'var(--green)', bg: 'var(--green-bg)' },
  'in-review': { label: 'In Review', color: 'var(--accent-blue)', bg: 'var(--accent-blue-glow)' },
  escalated: { label: 'Escalated', color: 'var(--orange)', bg: 'var(--orange-bg)' },
  denied: { label: 'Denied', color: 'var(--red)', bg: 'var(--red-bg)' },
};

export default function ClaimsTable() {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>Recent Claims</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last 24 hours</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Claim ID', 'Claimant', 'Coverage', 'Amount', 'Status', 'Stage', 'Time'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockClaims.map((claim, i) => {
              const s = statusConfig[claim.status];
              return (
                <tr key={claim.id} style={{ borderBottom: i < mockClaims.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '13px 16px' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-blue)' }}>{claim.id}</span></td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 500 }}>{claim.claimant}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{claim.coverageType}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{claim.amount}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: s.color, background: s.bg }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />{s.label}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{claim.agentStage}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>{claim.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}