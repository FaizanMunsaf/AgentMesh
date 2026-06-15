'use client';

export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
        background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
      }}>🛡</div>
      <div style={{
        padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        display: 'flex', gap: '4px', alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="typing-dot" style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--text-muted)', animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}