'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { mockFirewallLogs } from '@/lib/data';
import { FirewallDecision, Sensitivity } from '@/lib/types';

const decisionConfig: Record<FirewallDecision, { color: string; bg: string; label: string; border: string }> = {
  PASS: { color: 'var(--green)', bg: 'var(--green-bg)', label: 'Pass', border: 'rgba(16,185,129,0.2)' },
  BLOCK: { color: 'var(--red)', bg: 'var(--red-bg)', label: 'Block', border: 'rgba(239,68,68,0.2)' },
  TRANSFORM: { color: 'var(--yellow)', bg: 'var(--yellow-bg)', label: 'Transform', border: 'rgba(245,158,11,0.2)' },
  JUSTIFY: { color: 'var(--accent-blue)', bg: 'var(--accent-blue-glow)', label: 'Justify', border: 'rgba(59,130,246,0.2)' },
};

const sensitivityConfig: Record<Sensitivity, { color: string }> = {
  LOW: { color: 'var(--green)' },
  MEDIUM: { color: 'var(--yellow)' },
  HIGH: { color: 'var(--red)' },
};

const filters = ['All', 'PASS', 'BLOCK', 'TRANSFORM', 'JUSTIFY'] as const;
type Filter = typeof filters[number];

export default function FirewallPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = mockFirewallLogs.filter(log => {
    const matchSearch = log.field.toLowerCase().includes(search.toLowerCase()) ||
      log.reason.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || log.decision === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    total: mockFirewallLogs.length,
    pass: mockFirewallLogs.filter(l => l.decision === 'PASS').length,
    block: mockFirewallLogs.filter(l => l.decision === 'BLOCK').length,
    transform: mockFirewallLogs.filter(l => l.decision === 'TRANSFORM').length,
    justify: mockFirewallLogs.filter(l => l.decision === 'JUSTIFY').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Firewall Logs" breadcrumb="NovaCover Internal System › Firewall" />

      <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { label: 'Total Scanned', value: counts.total, color: 'var(--text-secondary)' },
            { label: 'Passed', value: counts.pass, color: 'var(--green)' },
            { label: 'Blocked', value: counts.block, color: 'var(--red)' },
            { label: 'Transformed', value: counts.transform, color: 'var(--yellow)' },
            { label: 'Justified', value: counts.justify, color: 'var(--accent-blue)' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: item.color, letterSpacing: '-0.03em' }}>{item.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
          {/* Controls */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search field or reason..."
              style={{
                flex: 1, minWidth: '180px', padding: '7px 12px', borderRadius: '8px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                    border: '1px solid',
                    borderColor: filter === f ? 'var(--accent-blue)' : 'var(--border)',
                    background: filter === f ? 'var(--accent-blue-glow)' : 'var(--bg-elevated)',
                    color: filter === f ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Field', 'Sensitivity', 'Decision', 'Destination', 'Reason', 'Time'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontSize: '11px',
                      color: 'var(--text-muted)', fontWeight: 500,
                      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const d = decisionConfig[log.decision];
                  const sens = sensitivityConfig[log.sensitivity];
                  return (
                    <tr key={i} style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      background: `${d.bg.replace('var(--green-bg)', 'rgba(16,185,129,0.03)').replace('var(--red-bg)', 'rgba(239,68,68,0.03)').replace('var(--yellow-bg)', 'rgba(245,158,11,0.03)').replace('var(--accent-blue-glow)', 'rgba(59,130,246,0.03)')}`,
                    }}>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{log.field}</span>
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: sens.color }}>{log.sensitivity}</span>
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                          color: d.color, background: d.bg, border: `1px solid ${d.border}`,
                          letterSpacing: '0.03em',
                        }}>{d.label}</span>
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>{log.destination}</td>
                      <td style={{ padding: '11px 16px', fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>{log.reason}</td>
                      <td style={{ padding: '11px 16px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No results match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
