'use client';

import { mockActivity } from '@/lib/data';

export default function ActivityFeed() {
  return (
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
  );
}