interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, breadcrumb, children }: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)', flexShrink: 0,
    }}>
      <div>
        {breadcrumb && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', letterSpacing: '0.03em' }}>
            {breadcrumb}
          </div>
        )}
        <h1 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', borderRadius: '20px',
          background: 'var(--green-bg)', border: '1px solid rgba(16,185,129,0.2)',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)' }} />
          <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 500 }}>System Online</span>
        </div>
        {children}
      </div>
    </div>
  );
}
