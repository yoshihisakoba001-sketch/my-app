'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AICoach() {
  const [open, setOpen] = useState(false);
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
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'エラーが発生しました。もう一度試してください。' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = ['今日のアドバイスを聞かせて', 'プランを作りたい', '雨の日の代替メニューは？'];

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-[#C5FF47] to-[#A0E030] flex items-center justify-center text-2xl shadow-lg shadow-[#C5FF47]/40 z-50 animate-pulse"
        >
          🏃
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Chat panel */}
          <div className="absolute bottom-0 left-0 right-0 h-[80%] bg-[#0C0C1A] rounded-t-3xl border border-[rgba(197,255,71,0.15)] border-b-0 flex flex-col">

            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5FF47] to-[#47B8FF] flex items-center justify-center text-xl">
                🏃
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">AIコーチ</p>
                <p className="text-xs text-[#7777A0]">いつでも相談してください</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
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
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C5FF47] to-[#47B8FF] flex items-center justify-center text-xs">🏃</div>
                        <span className="text-xs text-[#7777A0] font-semibold">AIコーチ</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[rgba(197,255,71,0.13)] border border-[rgba(197,255,71,0.25)] rounded-tr-sm'
                        : 'bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C5FF47] to-[#47B8FF] flex items-center justify-center text-xs">🏃</div>
                    <div className="bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C5FF47] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
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
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[rgba(26,26,40,0.9)] border border-white/10 text-xs text-[#7777A0] flex-shrink-0">
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-6 pt-2 border-t border-white/10 flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="コーチに話しかける..."
                className="flex-1 bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-full px-4 py-2.5 text-sm outline-none text-[#EEEEF8] placeholder-[#44445A]"
              />
              <button onClick={send} disabled={loading}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5FF47] to-[#A0E030] flex items-center justify-center flex-shrink-0 disabled:opacity-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#08080F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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