'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { mockMessages, mockAgentSteps } from '@/lib/data';
import { ChatMessage, AgentStep, AgentStatus, ClaimStatus } from '@/lib/types';

const agentStatusConfig: Record<AgentStatus, { color: string; bg: string; label: string }> = {
  pending: { color: 'var(--text-muted)', bg: 'var(--bg-elevated)', label: 'Pending' },
  active: { color: 'var(--accent-blue)', bg: 'var(--accent-blue-glow)', label: 'Active' },
  complete: { color: 'var(--green)', bg: 'var(--green-bg)', label: 'Complete' },
  blocked: { color: 'var(--red)', bg: 'var(--red-bg)', label: 'Blocked' },
  escalated: { color: 'var(--orange)', bg: 'var(--orange-bg)', label: 'Escalated' },
};

const claimStatusConfig: Record<ClaimStatus, { color: string; label: string }> = {
  approved: { color: 'var(--green)', label: 'Approved' },
  'in-review': { color: 'var(--accent-blue)', label: 'In Review' },
  escalated: { color: 'var(--orange)', label: 'Escalated' },
  denied: { color: 'var(--red)', label: 'Denied' },
};

function ClaimSummaryCard({ summary }: { summary: NonNullable<ChatMessage['claimSummary']> }) {
  const s = claimStatusConfig[summary.status];
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '14px', marginTop: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Claim Summary</span>
        <span style={{ fontSize: '11px', color: s.color, fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: `${s.color}18` }}>{s.label}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'Policy No.', value: summary.policyNumber },
          { label: 'Incident Date', value: summary.incidentDate },
          { label: 'Coverage', value: summary.coverageType },
          { label: 'Claim Amount', value: summary.claimAmount },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: item.label === 'Policy No.' || item.label === 'Claim Amount' ? 'var(--font-mono)' : 'inherit' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentStepItem({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  const s = agentStatusConfig[step.status];
  return (
    <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
      {!isLast && (
        <div style={{
          position: 'absolute', left: '15px', top: '32px', bottom: '-8px', width: '1px',
          background: step.status === 'complete' ? 'var(--green)' : 'var(--border)',
          opacity: 0.4,
        }} />
      )}
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
        background: s.bg, border: `1px solid ${s.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', zIndex: 1,
        boxShadow: step.status === 'active' ? `0 0 10px ${s.color}40` : 'none',
      }}>
        {step.icon}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{step.name}</span>
          <span style={{
            fontSize: '10px', padding: '1px 6px', borderRadius: '10px',
            color: s.color, background: s.bg, fontWeight: 600,
          }}>{s.label}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step.message}</div>
        {step.timestamp && (
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>{step.timestamp}</div>
        )}
      </div>
    </div>
  );
}

const starters = [
  'I was in a car accident',
  'Check my claim status',
  'What does my policy cover?',
];

export default function ClaimsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setStarted(true);

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: text,
      timestamp: new Date().toTimeString().slice(0, 8),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const mockReply = mockMessages.find(m => m.role === 'assistant');
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: mockReply?.content || "I've received your message and am processing your claim. The agent pipeline has been initiated.",
        timestamp: new Date().toTimeString().slice(0, 8),
        claimSummary: messages.length === 0 ? mockReply?.claimSummary : undefined,
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1800);
  }, [messages]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Claims Chat" breadcrumb="NovaCover Internal System › Claims" />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Chat panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Empty state */}
            {!started && messages.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px', marginBottom: '20px',
                  background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', boxShadow: '0 0 30px rgba(59,130,246,0.25)',
                }}>🛡</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>ClaimGuard AI</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>Secure. Compliant. Instant Claims.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {starters.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      style={{
                        padding: '8px 14px', borderRadius: '20px', fontSize: '12px',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        color: 'var(--text-secondary)', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <div
                key={msg.id}
                className="animate-fade-up"
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '10px', alignItems: 'flex-start',
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', marginTop: '2px',
                  }}>🛡</div>
                )}
                <div style={{ maxWidth: '75%' }}>
                  {msg.role === 'assistant' && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>ClaimGuard AI · {msg.timestamp}</div>
                  )}
                  <div style={{
                    padding: '11px 14px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : 'var(--bg-surface)',
                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                    fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text-primary)',
                  }}>
                    {msg.content}
                    {msg.claimSummary && <ClaimSummaryCard summary={msg.claimSummary} />}
                  </div>
                  {msg.role === 'user' && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>{msg.timestamp}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
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
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-end',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '10px 12px',
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Describe your incident or ask about your claim..."
                rows={1}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '13.5px', resize: 'none',
                  fontFamily: 'var(--font-sans)', lineHeight: 1.5,
                  maxHeight: '96px', overflowY: 'auto',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                style={{
                  width: '34px', height: '34px', borderRadius: '8px', border: 'none',
                  background: input.trim() ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                  color: input.trim() ? '#fff' : 'var(--text-muted)',
                  cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', flexShrink: 0, transition: 'all 0.15s ease',
                }}
              >→</button>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
              Enter to send · Shift+Enter for new line · All data encrypted end-to-end
            </div>
          </div>
        </div>

        {/* Agent pipeline panel */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>Agent Pipeline</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Real-time processing trace</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {mockAgentSteps.map((step, i) => (
              <AgentStepItem key={step.id} step={step} isLast={i === mockAgentSteps.length - 1} />
            ))}
          </div>
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Session</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>CLM-SESSION-4821</div>
          </div>
        </div>
      </div>
    </div>
  );
}
