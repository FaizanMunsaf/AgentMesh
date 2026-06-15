'use client';

import { useState } from 'react';

interface PolicyAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function PolicyAccordion({ title, children, defaultOpen }: PolicyAccordionProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{title}</span>
        <span style={{ 
          color: 'var(--text-muted)', 
          fontSize: '16px', 
          transition: 'transform 0.2s', 
          transform: open ? 'rotate(180deg)' : 'none',
          lineHeight: 1
        }}>⌄</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border-subtle)' }}>
          {children}
        </div>
      )}
    </div>
  );
}