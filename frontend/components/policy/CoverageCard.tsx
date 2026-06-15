'use client';

interface CoverageCardProps {
  icon: string;
  title: string;
  desc: string;
}

export default function CoverageCard({ icon, title, desc }: CoverageCardProps) {
  return (
    <div style={{
      display: 'flex', gap: '12px', padding: '14px',
      background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: '22px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  );
}