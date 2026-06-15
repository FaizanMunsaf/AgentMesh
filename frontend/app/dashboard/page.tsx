import PageHeader from '@/components/layout/PageHeader';
import { mockClaims, mockActivity } from '@/lib/data';
import { ClaimStatus } from '@/lib/types';

const statusConfig: Record<ClaimStatus, { label: string; color: string; bg: string }> = {
  approved: { label: 'Approved', color: 'var(--green)', bg: 'var(--green-bg)' },
  'in-review': { label: 'In Review', color: 'var(--accent-blue)', bg: 'var(--accent-blue-glow)' },
  escalated: { label: 'Escalated', color: 'var(--orange)', bg: 'var(--orange-bg)' },
  denied: { label: 'Denied', color: 'var(--red)', bg: 'var(--red-bg)' },
};

function KpiCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px 22px',
      borderTop: `2px solid ${color}`,
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Dashboard" breadcrumb="NovaCover Internal System" />

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <KpiCard label="Active Claims" value="3" color="var(--accent-blue)" />
          <KpiCard label="Approved Today" value="7" color="var(--green)" />
          <KpiCard label="Escalated" value="1" color="var(--orange)" sub="> $10,000 — human review" />
          <KpiCard label="Firewall Blocks" value="12" color="var(--red)" sub="fields blocked today" />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1 }}>

          {/* Claims table */}
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
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontSize: '11px', color: 'var(--text-muted)',
                        fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockClaims.map((claim, i) => {
                    const s = statusConfig[claim.status];
                    return (
                      <tr key={claim.id} style={{
                        borderBottom: i < mockClaims.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        transition: 'background 0.1s',
                      }}>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-blue)' }}>{claim.id}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 500 }}>{claim.claimant}</td>
                        <td style={{ padding: '13px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{claim.coverageType}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{claim.amount}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                            color: s.color, background: s.bg,
                          }}>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                            {s.label}
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

          {/* Activity feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Agent Activity</div>
              </div>
              <div style={{ padding: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                {mockActivity.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '10px', padding: '10px',
                    borderRadius: '8px', alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                      background: `${item.agentColor}18`,
                      border: `1px solid ${item.agentColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px',
                    }}>{item.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'inline-block', fontSize: '10px', fontWeight: 600,
                        color: item.agentColor, marginBottom: '2px',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>{item.agent}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.message}</div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Authority limits */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Authority Limits</div>
              {[
                { range: '≤ $1,000', label: 'Auto-approved', color: 'var(--green)', bg: 'var(--green-bg)' },
                { range: '$1,001–$10,000', label: '4-point analysis', color: 'var(--yellow)', bg: 'var(--yellow-bg)' },
                { range: '> $10,000', label: 'Human escalation', color: 'var(--red)', bg: 'var(--red-bg)' },
              ].map(item => (
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
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
