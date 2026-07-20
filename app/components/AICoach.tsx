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
  const [attachedImages, setAttachedImages] = useState<{ base64: string; mediaType: string; previewUrl: string }[]>([]);
  const [pendingRunData, setPendingRunData] = useState<{ date: string; distance: number; duration: string; pace: string; heart_rate: number | null; note: string } | null>(null);
  const [savingRun, setSavingRun] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAttachedImages(prev => [...prev, { base64, mediaType: file.type, previewUrl: URL.createObjectURL(file) }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const send = async () => {
    if (!input.trim() && attachedImages.length === 0 || loading) return;
    const displayContent = attachedImages.length > 0 && !input.trim()
      ? `📷 ${attachedImages.length}枚の画像を送信しました`
      : attachedImages.length > 0
      ? `📷 ${attachedImages.length}枚の画像\n${input}`
      : input;
    const userMsg: Message = { role: 'user', content: displayContent };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    resetTextarea();
    const imagesToSend = attachedImages;
    setAttachedImages([]);
    setLoading(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userId, accessToken, lastMessageImages: imagesToSend }),
      });
      const data = await res.json();

      // クライアント側でSupabaseに書き込む（ユーザーのセッションを使用）
      if (userId) {
        if (data.runData) {
          setPendingRunData(data.runData);
        }
        if (data.raceData) {
          await supabase.from('races').delete().eq('user_id', userId);
          await supabase.from('races').insert({ user_id: userId, ...data.raceData });
        }
        if (data.planData) {
          const plansWithUserId = data.planData.map((p: any) => ({ ...p, user_id: userId }));
          const weekStarts = plansWithUserId.map((p: any) => p.week_start);
          await supabase.from('plans').delete().eq('user_id', userId).in('week_start', weekStarts);
          await supabase.from('plans').insert(plansWithUserId);
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

  const confirmRunSave = async () => {
    if (!pendingRunData || !userId) return;
    setSavingRun(true);
    const { error } = await supabase.from('runs').insert({
      user_id: userId,
      date: pendingRunData.date,
      distance: pendingRunData.distance,
      duration: pendingRunData.duration,
      pace: pendingRunData.pace,
      heart_rate: pendingRunData.heart_rate,
      note: pendingRunData.note,
    });
    if (!error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `✅ ${pendingRunData.distance}km の記録を保存しました！` }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: '保存に失敗しました。もう一度試してください。' }]);
    }
    setPendingRunData(null);
    setSavingRun(false);
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
                {pendingRunData && (
                  <div className="rounded-2xl border p-4 flex flex-col gap-3"
                    style={{ background: assistantMsgBg, borderColor: isDark ? 'rgba(197,255,71,0.3)' : 'rgba(255,59,139,0.3)' }}>
                    <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>🏃 この内容で記録しますか？</p>
                    <div className="flex flex-col gap-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {[
                        ['📅', '日付', pendingRunData.date],
                        ['📏', '距離', `${pendingRunData.distance} km`],
                        ['⏱️', 'タイム', pendingRunData.duration],
                        ['💨', 'ペース', `${pendingRunData.pace} /km`],
                        pendingRunData.heart_rate ? ['❤️', '心拍数', `${pendingRunData.heart_rate} bpm`] : null,
                        pendingRunData.note ? ['📝', 'メモ', pendingRunData.note] : null,
                      ].filter((r): r is string[] => r !== null).map(([icon, label, value], i) => (
                        <div key={i} className="flex gap-2">
                          <span>{icon}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{label}:</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={confirmRunSave} disabled={savingRun}
                        className="flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                        style={{ background: isDark ? 'linear-gradient(135deg, #C5FF47, #A0E030)' : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)', color: isDark ? '#08080F' : '#FFFFFF' }}>
                        {savingRun ? '保存中...' : '記録する'}
                      </button>
                      <button onClick={() => setPendingRunData(null)}
                        className="px-4 py-2 rounded-xl text-sm border"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        キャンセル
                      </button>
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
            <div className="px-4 pb-6 pt-2 border-t flex-shrink-0 flex flex-col gap-2"
              style={{ borderColor: headerBorder }}>
              {attachedImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto hide-scroll">
                  {attachedImages.map((img, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <img src={img.previewUrl} className="w-12 h-12 rounded-xl object-cover border" style={{ borderColor: 'var(--border-accent)' }} alt="添付画像"/>
                      <button onClick={() => setAttachedImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: isDark ? '#C5FF47' : '#FF3B8B', color: isDark ? '#08080F' : '#FFFFFF' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 items-end">
                <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAttach} />
                <button onClick={() => imageInputRef.current?.click()}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border text-lg"
                  style={{ background: inputBg, borderColor: 'var(--border)' }}>
                  📷
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  placeholder="コーチに話しかける..."
                  rows={1}
                  className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none border"
                  style={{
                    background: inputBg,
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    resize: 'none',
                    overflow: 'hidden',
                    minHeight: '44px',
                    maxHeight: '120px',
                    lineHeight: '1.5',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
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
        </div>
      )}
    </>
  );
}