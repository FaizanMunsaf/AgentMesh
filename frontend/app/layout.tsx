'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>ClaimGuard — NovaCover</title>
        <meta name="description" content="Insurance Claims AI Platform" />
      </head>
      <body>
        {/* Mobile header */}
        <div style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
          padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
        }} className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛡</span>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>ClaimGuard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '6px 10px', color: 'var(--text-primary)',
              cursor: 'pointer', fontSize: '13px',
            }}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 40, display: 'none',
            }}
            className="mobile-overlay"
          />
        )}

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px',
            zIndex: 50, display: 'none',
          }} className="mobile-drawer">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        <div style={{ display: 'flex', minHeight: '100vh' }} className="app-layout">
          {/* Desktop sidebar */}
          <div className="desktop-sidebar">
            <Sidebar />
          </div>

          {/* Main content */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {children}
          </main>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .mobile-header { display: flex !important; }
            .desktop-sidebar { display: none !important; }
            .app-layout { padding-top: 56px; }
            .mobile-overlay { display: block !important; }
            .mobile-drawer { display: block !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
