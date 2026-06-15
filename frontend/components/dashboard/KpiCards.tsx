'use client';

const KpiCard = ({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 22px', borderTop: `2px solid ${color}` }}>
    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>{label}</div>
    <div style={{ fontSize: '28px', fontWeight: 700, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</div>}
  </div>
);

export default function KpiCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
      <KpiCard label="Active Claims" value="3" color="var(--accent-blue)" />
      <KpiCard label="Approved Today" value="7" color="var(--green)" />
      <KpiCard label="Escalated" value="1" color="var(--orange)" sub="> $10,000 — human review" />
      <KpiCard label="Firewall Blocks" value="12" color="var(--red)" sub="fields blocked today" />
    </div>
  );
}