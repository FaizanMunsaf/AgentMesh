'use client';

import { mockFirewallLogs } from '@/lib/data';

export default function FirewallStats() {
  const counts = {
    total: mockFirewallLogs.length,
    pass: mockFirewallLogs.filter(l => l.decision === 'PASS').length,
    block: mockFirewallLogs.filter(l => l.decision === 'BLOCK').length,
    transform: mockFirewallLogs.filter(l => l.decision === 'TRANSFORM').length,
    justify: mockFirewallLogs.filter(l => l.decision === 'JUSTIFY').length,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
      {[
        { label: 'Total Scanned', value: counts.total, color: 'var(--text-secondary)' },
        { label: 'Passed', value: counts.pass, color: 'var(--green)' },
        { label: 'Blocked', value: counts.block, color: 'var(--red)' },
        { label: 'Transformed', value: counts.transform, color: 'var(--yellow)' },
        { label: 'Justified', value: counts.justify, color: 'var(--accent-blue)' },
      ].map(item => (
        <div key={item.label} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '14px 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: item.color, letterSpacing: '-0.03em' }}>{item.value}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}