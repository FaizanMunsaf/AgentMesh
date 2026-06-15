'use client';

const limitsConfig = [
  { range: '≤ $1,000', label: 'Auto-approved', color: 'var(--green)', bg: 'var(--green-bg)' },
  { range: '$1,001–$10,000', label: '4-point analysis', color: 'var(--yellow)', bg: 'var(--yellow-bg)' },
  { range: '> $10,000', label: 'Human escalation', color: 'var(--red)', bg: 'var(--red-bg)' },
];

export default function AuthorityLimits() {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
      <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Authority Limits</div>
      {limitsConfig.map(item => (
        <div key={item.range} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 10px', borderRadius: '8px', marginBottom: '6px',
          background: item.bg, border: `1px solid ${item.color}25`,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.range}</span>
          <span style={{ fontSize: '11px', color: item.color, fontWeight: 600 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}