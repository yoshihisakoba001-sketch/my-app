'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';
import BottomNav from '../components/BottomNav';

type Message = { role: 'user' | 'assistant'; content: string; };

const SUGGESTIONS = [
  { icon: '🎯', label: 'ランニングの目標設定', prompt: 'ユーザーがランニングの目標設定をしたいと話しかけてきました。コーチとして、現在の走力（週間走行距離や最近のレース記録など）を確認する質問を短く1つだけしてください。', action: '', enableImage: false },
  { icon: '📋', label: 'トレーニング設計・改善', prompt: 'ユーザーがトレーニングの設計・改善を相談したいと言っています。コーチとして、現在の練習内容や改善したい課題を確認する質問を短く1つだけしてください。', action: '', enableImage: false },
  { icon: '📝', label: 'トレーニング結果の登録', prompt: '', action: 'record', enableImage: false },
  { icon: '📊', label: 'トレーニング内容の分析', prompt: 'ユーザーがトレーニング内容を分析してほしいと言っています。コーチとして、テキストで内容を教えてもらうかランニングアプリのスクリーンショットを送ってもらうよう促す短いメッセージを返してください。', action: '', enableImage: true },
];

export default function CoachPage() {
  const { isDark } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showRecord, setShowRecord] = useState(false);
  const [recordTab, setRecordTab] = useState('suunto');
  const [analyzing, setAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ distance: '', time: '', pace: '', hr: '', note: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [imageMode, setImageMode] = useState(false);
  const [attachedImages, setAttachedImages] = useState<{ base64: string; mediaType: string; previewUrl: string }[]>([]);
  const [textareaOverflow, setTextareaOverflow] = useState<'hidden' | 'auto'>('hidden');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    setTextareaOverflow(el.scrollHeight > 120 ? 'auto' : 'hidden');
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
        setAccessToken(data.session.access_token);
        await loadHistory(data.session.user.id);
      }
      setHistoryLoading(false);
    };
    init();
  }, []);

  const loadHistory = async (uid: string) => {
    const { data, error } = await supabase
      .from('chat_histories')
      .select('role, content')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) console.error('[loadHistory] error:', error);
    if (data && data.length > 0) {
      setMessages([...data].reverse() as Message[]);
      setSuggestionsOpen(false);
    } else {
      setMessages([{ role: 'assistant', content: 'こんにちは！AIコーチです 🏃\n何について話しましょうか？' }]);
    }
  };

  const saveMessage = async (role: string, content: string) => {
    if (!userId) return;
    const { error } = await supabase.from('chat_histories').insert({ user_id: userId, role, content });
    if (error) console.error('[saveMessage] error:', error);
  };

  const send = async (customInput?: string) => {
    const text = customInput ?? input;
    if (!text.trim() && attachedImages.length === 0 || loading) return;

    const displayContent = attachedImages.length > 0 && !text.trim()
      ? `📷 ${attachedImages.length}枚の画像を送信しました`
      : attachedImages.length > 0
      ? `📷 ${attachedImages.length}枚の画像\n${text}`
      : text;

    const userMsg: Message = { role: 'user', content: displayContent };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setTextareaOverflow('hidden');
    const imagesToSend = attachedImages;
    setAttachedImages([]);
    setLoading(true);

    try {
      await saveMessage('user', displayContent);
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userId, accessToken, lastMessageImages: imagesToSend }),
      });
      const data = await res.json();

      if (userId) {
        if (data.raceData) {
          await supabase.from('races').upsert({ user_id: userId, ...data.raceData }, { onConflict: 'user_id,name' });
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

      const reply = data.reply || '';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      await saveMessage('assistant', reply);
    } catch {
      const errMsg = 'エラーが発生しました。もう一度試してください。';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const triggerCoach = async (triggerPrompt: string) => {
    setLoading(true);
    const triggerMessages = [...messages, { role: 'user' as const, content: triggerPrompt }];
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: triggerMessages, userId, accessToken }),
      });
      const data = await res.json();
      const reply = data.reply || '';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      await saveMessage('assistant', reply);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'エラーが発生しました。もう一度試してください。' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = async (s: typeof SUGGESTIONS[number]) => {
    setSuggestionsOpen(false);
    if (s.action === 'record') { setShowRecord(true); return; }
    if (s.enableImage) setImageMode(true);
    await triggerCoach(s.prompt);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setErrorMsg('');
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/analyze-run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mediaType: file.type }),
        });
        const { success, data, error } = await res.json();
        if (success && data) {
          setForm({ distance: data.distance?.toString() || '', time: data.duration || '', pace: data.pace || '', hr: data.heart_rate?.toString() || '', note: data.note || '' });
          setRecordTab('manual');
        } else {
          setErrorMsg(error || '画像の読み取りに失敗しました');
        }
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('画像の読み取りに失敗しました');
      setAnalyzing(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!userId) return;
    setSaving(true);
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const { error } = await supabase.from('runs').insert({
      user_id: userId, date: dateStr,
      distance: parseFloat(form.distance) || 0,
      duration: form.time, pace: form.pace,
      heart_rate: parseInt(form.hr) || null, note: form.note,
    });
    if (!error) {
      setShowRecord(false);
      setPreviewUrl(null);
      setForm({ distance: '', time: '', pace: '', hr: '', note: '' });
      const msg = `${form.distance}km走りました！${form.time ? `タイム: ${form.time}` : ''}${form.note ? ` ${form.note}` : ''}`;
      await send(msg);
    } else {
      setErrorMsg('保存に失敗しました');
    }
    setSaving(false);
  };

  const accentGrad = isDark ? 'linear-gradient(135deg, #C5FF47, #47B8FF)' : 'linear-gradient(135deg, #FF3B8B, #FF8547)';
  const sendBtnGrad = isDark ? 'linear-gradient(135deg, #C5FF47, #A0E030)' : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)';

  return (
    <div className="min-h-screen pb-20 flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      <div className="px-5 pt-12 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold tracking-tight">AIコーチ</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>いつでも相談してください</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 hide-scroll">
        {historyLoading ? (
          <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>履歴を読み込み中...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: accentGrad }}>🏃</div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>AIコーチ</span>
                  </div>
                )}
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: msg.role === 'user' ? (isDark ? 'rgba(197,255,71,0.13)' : 'rgba(255,59,139,0.1)') : (isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)'),
                    border: `1px solid ${msg.role === 'user' ? (isDark ? 'rgba(197,255,71,0.25)' : 'rgba(255,59,139,0.25)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                    borderRadius: msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                    color: 'var(--text-primary)',
                  }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: accentGrad }}>🏃</div>
                <div className="rounded-2xl px-4 py-3 flex gap-1 border"
                  style={{ background: isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: 'var(--accent)', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 提案ボタン */}
      {suggestionsOpen ? (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => handleSuggestion(s)}
                className="rounded-2xl p-3 text-left border flex items-start gap-2 active:opacity-70"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <span className="text-lg leading-none">{s.icon}</span>
                <span className="text-xs font-semibold leading-snug" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <button onClick={() => setSuggestionsOpen(false)}
              className="text-xs px-4 py-1 rounded-full border"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              ▼ 折りたたむ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center pb-2 flex-shrink-0">
          <button onClick={() => setSuggestionsOpen(true)}
            className="text-xs px-4 py-1 rounded-full border"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            ▲
          </button>
        </div>
      )}

      {/* 入力エリア */}
      <div className="px-4 pb-4 pt-2 border-t flex-shrink-0 flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
        {/* 画像添付プレビュー */}
        {attachedImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto hide-scroll">
            {attachedImages.map((img, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img src={img.previewUrl} className="w-14 h-14 rounded-xl object-cover border" style={{ borderColor: 'var(--border-accent)' }} alt="添付画像"/>
                <button onClick={() => setAttachedImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'var(--accent)', color: isDark ? '#08080F' : '#FFFFFF' }}>×</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          {imageMode && (
            <>
              <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageAttach} />
              <button onClick={() => imageInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border text-lg"
                style={{ background: 'var(--accent-bg)', borderColor: 'var(--border-accent)' }}>
                📷
              </button>
            </>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="コーチに話しかける..."
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm outline-none border"
            style={{
              background: isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              resize: 'none',
              overflowY: textareaOverflow,
              minHeight: '40px',
              maxHeight: '120px',
              lineHeight: '1.5',
              borderRadius: '20px',
              boxSizing: 'border-box',
            }}
          />
          <button onClick={() => send()} disabled={loading}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            style={{ background: sendBtnGrad }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#08080F' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 記録ポップアップ */}
      {showRecord && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRecord(false)}/>
          <div className="relative rounded-t-3xl border border-b-0 flex flex-col"
            style={{ height: '85vh', background: isDark ? '#0C0C1A' : '#FFFFFF', borderColor: isDark ? 'rgba(197,255,71,0.15)' : 'rgba(255,59,139,0.15)' }}>

            <div className="px-5 py-4 border-b flex items-center justify-between flex-shrink-0"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>トレーニング記録</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}</p>
              </div>
              <button onClick={() => setShowRecord(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', color: 'var(--text-primary)' }}>
                ×
              </button>
            </div>

            <div className="px-4 pt-3 flex gap-2 flex-shrink-0">
              {[['suunto','📸 画像読み取り'],['manual','✏️ 手動入力']].map(([id, label]) => (
                <button key={id} onClick={() => setRecordTab(id)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    background: recordTab === id ? 'var(--accent-bg)' : 'var(--bg-card)',
                    color: recordTab === id ? 'var(--accent)' : 'var(--text-secondary)',
                    borderColor: recordTab === id ? 'var(--border-accent)' : 'var(--border)',
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* スクロール可能コンテンツ */}
            <div className="overflow-y-auto px-4 py-4 flex-1">
              {recordTab === 'suunto' && (
                <label className="block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer"
                  style={{ borderColor: analyzing ? 'var(--accent)' : 'var(--border-accent)', background: analyzing ? 'var(--accent-bg)' : 'var(--bg-card)' }}>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={analyzing}/>
                  {analyzing ? (
                    <>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--accent-bg)' }}>
                        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}/>
                      </div>
                      <p className="text-base font-semibold" style={{ color: 'var(--accent)' }}>AIが読み取り中...</p>
                    </>
                  ) : previewUrl ? (
                    <>
                      <img src={previewUrl} alt="preview" className="w-32 h-32 object-cover rounded-xl mx-auto mb-3"/>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>別の画像を選択する場合はタップ</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mx-auto mb-3" style={{ background: 'var(--accent-bg)' }}>📸</div>
                      <p className="text-base font-semibold mb-2">ランニングアプリの画像を追加</p>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>タップしてギャラリーから選択</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['Suunto', 'Garmin', 'Nike Run', 'Strava'].map(app => (
                          <span key={app} className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{app}</span>
                        ))}
                      </div>
                    </>
                  )}
                </label>
              )}

              {recordTab === 'manual' && (
                <div className="flex flex-wrap gap-3">
                  {previewUrl && (
                    <div className="w-full flex items-center gap-3 rounded-xl p-3 border" style={{ background: 'var(--accent-bg)', borderColor: 'var(--border-accent)' }}>
                      <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded-lg"/>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>AIが読み取りました</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>内容を確認・修正してください</p>
                      </div>
                    </div>
                  )}
                  {[
                    { label:'距離', key:'distance', unit:'km' },
                    { label:'タイム', key:'time', unit:'' },
                    { label:'ペース', key:'pace', unit:'/km' },
                    { label:'心拍数', key:'hr', unit:'bpm' },
                  ].map(field => (
                    <div key={field.key} className="w-[calc(50%-6px)]">
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{field.label}</p>
                      <div className="rounded-xl px-3 py-2.5 flex items-baseline gap-1 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                        <input type="text"
                          value={form[field.key as keyof typeof form]}
                          onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                          placeholder="0"
                          className="flex-1 bg-transparent outline-none text-xl font-bold w-full"
                          style={{ color: 'var(--accent)' }}/>
                        {field.unit && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{field.unit}</span>}
                      </div>
                    </div>
                  ))}
                  <div className="w-full">
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>メモ</p>
                    <textarea value={form.note}
                      onChange={e => setForm(f => ({...f, note: e.target.value}))}
                      placeholder="感想・コメントを追加..." rows={3}
                      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none border"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}/>
                  </div>
                </div>
              )}

{errorMsg && <p className="text-xs text-[#FF4D6A] text-center mt-3">{errorMsg}</p>}
            </div>

            {/* Submitボタン — スクロール外に固定 */}
            {recordTab !== 'suunto' && (
              <div className="px-4 pb-6 pt-3 border-t flex-shrink-0"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                <button onClick={handleSaveRecord} disabled={saving}
                  className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50"
                  style={{
                    background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
                    color: isDark ? '#08080F' : '#FFFFFF',
                  }}>
                  {saving ? '保存中...' : '記録を保存してAIに報告'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
