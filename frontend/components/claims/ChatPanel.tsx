'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { mockMessages } from '@/lib/data';
import { ChatMessage } from '@/lib/types';
import ClaimSummaryCard from './ClaimSummaryCard';
import TypingIndicator from './TypingIndicator';

const starters = [
  'I was in a car accident',
  'Check my claim status',
  'What does my policy cover?',
];

export default function ChatPanel() {
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
      timestamp: new Date().toTimeString().slice(0, 8) 
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
      
      {/* Messages viewport */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Empty placeholder state */}
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

        {/* Dynamic message logs */}
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

        {/* Typing indicator instance */}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input panel block */}
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
  );
}