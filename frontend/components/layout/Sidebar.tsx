'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { href: '/claims', label: 'Claims Chat', icon: '◎' },
  { href: '/firewall', label: 'Firewall Logs', icon: '⬢' },
  { href: '/policy', label: 'Policy Reference', icon: '◈' },
];

function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return <span className="font-mono text-xs" style={{ color: 'var(--text-accent)' }}>{m}:{s}</span>;
}

export default function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: mobile ? '100%' : '220px',
        minHeight: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
            boxShadow: '0 0 12px rgba(59,130,246,0.3)',
          }}>🛡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>ClaimGuard</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>NovaCover</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px 8px' }}>Navigation</div>
        {navItems.map(item => {
          const active = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
                textDecoration: 'none', fontSize: '13.5px', fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-blue-glow)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '14px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {active && (
                <div style={{
                  marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%',
                  background: 'var(--accent-blue)',
                  boxShadow: '0 0 6px var(--accent-blue)',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Session card */}
      <div style={{ padding: '12px 10px 20px' }}>
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div className="pulse-dot" style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 6px var(--green)',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>Session Active</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>SES-4821</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Duration</span>
            <SessionTimer />
          </div>
        </div>
      </div>
    </aside>
  );
}
