import PageHeader from '@/components/layout/PageHeader';
import PolicyAccordion from '@/components/policy/PolicyAccordion';
import CoverageCard from '@/components/policy/CoverageCard';

const coverageTypes = [
  { icon: '🚗', title: 'Collision Coverage', desc: 'Covers physical damage to the insured vehicle from a collision with another vehicle or object, regardless of fault. Includes single-vehicle accidents.' },
  { icon: '⚖️', title: 'Liability Coverage', desc: 'Covers damage or injury the insured causes to other people or their property in an accident. Requires identification of the other party.' },
  { icon: '🌩️', title: 'Comprehensive Coverage', desc: 'Covers damage from non-collision events: theft, vandalism, fire, falling objects, and weather events such as hail or flooding.' },
];

const exclusions = [
  'Damage resulting from intentional acts by the insured.',
  'Claims reported more than 30 days after the incident without documented reasonable cause.',
  'Damage occurring while operated by an unlisted driver without express permission.',
  'Claims for incidents occurring while the policy was lapsed or not yet in effect.',
  'Pre-existing vehicle damage unrelated to the reported incident.',
];

const limits = [
  { range: '≤ $1,000', detail: 'Auto-approved (standard authority)', color: 'var(--green)', bg: 'var(--green-bg)', border: 'rgba(16,185,129,0.2)' },
  { range: '$1,001 – $10,000', detail: 'Four-Point Coverage Analysis required before any decision', color: 'var(--yellow)', bg: 'var(--yellow-bg)', border: 'rgba(245,158,11,0.2)' },
  { range: '> $10,000', detail: 'Must escalate to a human senior examiner — AI findings are advisory only', color: 'var(--red)', bg: 'var(--red-bg)', border: 'rgba(239,68,68,0.2)' },
];

export default function PolicyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Policy Reference" breadcrumb="NovaCover Internal System › Policy" />

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', maxWidth: '800px' }}>
        {/* Info Header Banner */}
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          📄 NovaCover Auto Insurance Policy — synthetic document for ClaimGuard demo. Read-only reference for Assessment Agent RAG.
        </div>

        {/* Section 1 — Coverage Types */}
        <PolicyAccordion title="Section 1 — Coverage Types" defaultOpen>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '14px' }}>
            {coverageTypes.map(ct => (
              <CoverageCard 
                key={ct.title}
                icon={ct.icon}
                title={ct.title}
                desc={ct.desc}
              />
            ))}
          </div>
        </PolicyAccordion>

        {/* Section 2 — Covered Events */}
        <PolicyAccordion title="Section 2 — Covered Events">
          <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Two-vehicle accident: covered under Collision Coverage provided policy was active on the incident date.',
              'Single-vehicle accident (e.g., striking a stationary object): covered under Collision at the same terms.',
              'Injuries to the insured driver from a covered collision are included, subject to the medical payments sub-limit.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </PolicyAccordion>

        {/* Section 3 — Exclusions */}
        <PolicyAccordion title="Section 3 — Exclusions">
          <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {exclusions.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: '1px' }}>✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </PolicyAccordion>

        {/* Section 4 — Claims Authority Limits */}
        <PolicyAccordion title="Section 4 — Claims Authority Limits">
          <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {limits.map(l => (
              <div key={l.range} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                borderRadius: '10px', background: l.bg, border: `1px solid ${l.border}`,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: l.color, whiteSpace: 'nowrap' }}>{l.range}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{l.detail}</span>
              </div>
            ))}
          </div>
        </PolicyAccordion>

        {/* Section 5 — Supporting Documentation */}
        <PolicyAccordion title="Section 5 — Supporting Documentation">
          <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'For multi-party accidents, liability determination requires the other party\'s information to be recorded.',
              'A police report number, where available, supports claim validity and corroborates the accident description.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                <span style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </PolicyAccordion>

      </div>
    </div>
  );
}