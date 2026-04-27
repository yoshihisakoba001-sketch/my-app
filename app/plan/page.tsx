'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function PlanPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'こんにちは！ランニングプランを一緒に作りましょう。\n\nまず、目標の大会を教えてください。\n・大会名\n・開催日\n・距離（フルマラソン・ハーフなど）',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'エラーが発生しました。もう一度試してください。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>AIプラン作成</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>AIと会話しながらトレーニング計画を作ります</p>

      {/* チャット表示エリア */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#1a1a2e' : '#f0f0f0',
            color: msg.role === 'user' ? '#fff' : '#1a1a1a',
            borderRadius: 16,
            padding: '12px 16px',
            maxWidth: '80%',
            fontSize: 14,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: '#f0f0f0', borderRadius: 16, padding: '12px 16px', fontSize: 14, color: '#888' }}>
            考え中...
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="メッセージを入力..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 99, border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 99, padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}
        >
          送信
        </button>
      </div>
    </main>
  );
}