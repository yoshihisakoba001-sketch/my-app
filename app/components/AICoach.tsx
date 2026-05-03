'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from './ThemeContext';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AICoach() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'こんにちは！AIコーチです 🏃\n今日のトレーニングや計画について何でも聞いてください！',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUserId(data.session.user.id);
        setAccessToken(data.session.access_token);
      }
    });
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userId, accessToken }),
      });
      const data = await res.json();

      // クライアント側でSupabaseに書き込む（ユーザーのセッションを使用）
      if (userId) {
        if (data.raceData) {
          await supabase.from('races').upsert({ user_id: userId, ...data.raceData });
        }
        if (data.planData) {
          const plansWithUserId = data.planData.map((p: any) => ({ ...p, user_id: userId }));
          await supabase.from('plans').upsert(plansWithUserId);
        }
        if (data.dailyPlanData) {
          const dailyPlansWithUserId = data.dailyPlanData.map((p: any) => ({ ...p, user_id: userId }));
          const dates = dailyPlansWithUserId.map((p: any) => p.date);
          await supabase.from('daily_plans').delete().eq('user_id', userId).in('date', dates);
          await supabase.from('daily_plans').insert(dailyPlansWithUserId);
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || '' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'エラーが発生しました。もう一度試してください。' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = ['今日のアドバイスを聞かせて', 'プランを作りたい', '雨の日の代替メニューは？'];

  const panelBg = isDark ? '#0C0C1A' : '#FFFFFF';
  const panelBorder = isDark ? 'rgba(197,255,71,0.15)' : 'rgba(255,59,139,0.15)';
  const headerBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const userMsgBg = isDark ? 'rgba(197,255,71,0.13)' : 'rgba(255,59,139,0.1)';
  const userMsgBorder = isDark ? 'rgba(197,255,71,0.25)' : 'rgba(255,59,139,0.25)';
  const assistantMsgBg = isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)';
  const assistantMsgBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)';
  const fabGradient = isDark
    ? 'linear-gradient(135deg, #C5FF47, #A0E030)'
    : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)';
  const fabShadow = isDark ? '0 4px 20px rgba(197,255,71,0.4)' : '0 4px 20px rgba(255,59,139,0.4)';
  const sendBtnGradient = isDark
    ? 'linear-gradient(135deg, #C5FF47, #A0E030)'
    : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)';

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center text-2xl z-50 animate-pulse"
          style={{ background: fabGradient, boxShadow: fabShadow }}
        >
          🏃
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="absolute bottom-0 left-0 right-0 h-[80%] rounded-t-3xl border border-b-0 flex flex-col"
            style={{ background: panelBg, borderColor: panelBorder }}>

            {/* Header */}
            <div className="px-5 py-4 border-b flex items-center gap-3 flex-shrink-0"
              style={{ borderColor: headerBorder }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: isDark ? 'linear-gradient(135deg, #C5FF47, #47B8FF)' : 'linear-gradient(135deg, #FF3B8B, #FF8547)' }}>
                🏃
              </div>
              <div className="flex-1">
                <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>AIコーチ</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>いつでも相談してください</p>
              </div>
              <button onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', color: 'var(--text-primary)' }}>
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 hide-scroll">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ background: isDark ? 'linear-gradient(135deg, #C5FF47, #47B8FF)' : 'linear-gradient(135deg, #FF3B8B, #FF8547)' }}>🏃</div>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>AIコーチ</span>
                      </div>
                    )}
                    <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: msg.role === 'user' ? userMsgBg : assistantMsgBg,
                        border: `1px solid ${msg.role === 'user' ? userMsgBorder : assistantMsgBorder}`,
                        borderRadius: msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                        color: 'var(--text-primary)',
                      }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: isDark ? 'linear-gradient(135deg, #C5FF47, #47B8FF)' : 'linear-gradient(135deg, #FF3B8B, #FF8547)' }}>🏃</div>
                    <div className="rounded-2xl px-4 py-3 flex gap-1 border"
                      style={{ background: assistantMsgBg, borderColor: assistantMsgBorder }}>
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: 'var(--accent)', animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scroll flex-shrink-0">
                {quickReplies.map(r => (
                  <button key={r} onClick={() => setInput(r)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs flex-shrink-0 border"
                    style={{ background: isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-6 pt-2 border-t flex gap-2 flex-shrink-0"
              style={{ borderColor: headerBorder }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) send();
                }}
                placeholder="コーチに話しかける..."
                className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none border"
                style={{ background: inputBg, borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button onClick={send} disabled={loading}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                style={{ background: sendBtnGradient }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#08080F' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}