'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';
import BottomNav from '../components/BottomNav';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function CoachPage() {
  const { isDark } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 記録インプット用
  const [showRecord, setShowRecord] = useState(false);
  const [recordTab, setRecordTab] = useState('suunto');
  const [analyzing, setAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ distance: '', time: '', pace: '', hr: '', note: '' });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
    const { data } = await supabase
      .from('chat_histories')
      .select('role, content')
      .eq('user_id', uid)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data && data.length > 0) {
      setMessages(data as Message[]);
    } else {
      setMessages([{
        role: 'assistant',
        content: 'こんにちは！AIコーチです 🏃\n今日のトレーニングや計画について何でも聞いてください！',
      }]);
    }
  };

  const saveMessage = async (role: string, content: string) => {
    if (!userId) return;
    await supabase.from('chat_histories').insert({ user_id: userId, role, content });
  };

  const send = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    await saveMessage('user', text);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userId, accessToken }),
      });
      const data = await res.json();

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
          setForm({
            distance: data.distance?.toString() || '',
            time: data.duration || '',
            pace: data.pace || '',
            hr: data.heart_rate?.toString() || '',
            note: data.note || '',
          });
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
      user_id: userId,
      date: dateStr,
      distance: parseFloat(form.distance) || 0,
      duration: form.time,
      pace: form.pace,
      heart_rate: parseInt(form.hr) || null,
      note: form.note,
    });
    if (!error) {
      setShowRecord(false);
      setPreviewUrl(null);
      setForm({ distance: '', time: '', pace: '', hr: '', note: '' });
      // AIに報告して褒めてもらう
      const msg = `${form.distance}km走りました！${form.time ? `タイム: ${form.time}` : ''}${form.note ? ` ${form.note}` : ''}`;
      await send(msg);
    } else {
      setErrorMsg('保存に失敗しました');
    }
    setSaving(false);
  };

  const quickReplies = ['今日のアドバイスを聞かせて', 'プランを作りたい', '雨の日の代替メニューは？'];

  return (
    <div className="min-h-screen pb-20 flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ヘッダー */}
      <div className="px-5 pt-12 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold tracking-tight">AIコーチ</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>いつでも相談してください</p>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto px-4 py-4 hide-scroll">
        {historyLoading ? (
          <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>履歴を読み込み中...</p>
        ) : (
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
                    background: msg.role === 'user'
                      ? isDark ? 'rgba(197,255,71,0.13)' : 'rgba(255,59,139,0.1)'
                      : isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)',
                    border: `1px solid ${msg.role === 'user'
                      ? isDark ? 'rgba(197,255,71,0.25)' : 'rgba(255,59,139,0.25)'
                      : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
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

      {/* クイックリプライ */}
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

      {/* 入力エリア */}
      <div className="px-4 pb-4 pt-2 border-t flex gap-2 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        {/* 記録ボタン */}
        <button onClick={() => setShowRecord(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border"
          style={{ background: 'var(--accent-bg)', borderColor: 'var(--border-accent)' }}>
          📷
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(); }}
          placeholder="コーチに話しかける..."
          className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none border"
          style={{ background: isDark ? 'rgba(26,26,40,0.9)' : 'rgba(240,239,248,0.9)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        <button onClick={() => send()} disabled={loading}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
          style={{ background: isDark ? 'linear-gradient(135deg, #C5FF47, #A0E030)' : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#08080F' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* 記録インプットポップアップ */}
      {showRecord && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRecord(false)}/>
          <div className="relative rounded-t-3xl border border-b-0 flex flex-col"
           style={{ height: '85vh', background: isDark ? '#0C0C1A' : '#FFFFFF', borderColor: isDark ? 'rgba(197,255,71,0.15)' : 'rgba(255,59,139,0.15)' }}>
           
            {/* ポップアップヘッダー */}
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

            {/* タブ */}
            <div className="px-4 pt-3 flex gap-2 flex-shrink-0">
              {[['suunto','📸 画像読み取り'],['manual','✏️ 手動入力'],['gym','💪 筋トレ']].map(([id, label]) => (
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

            {/* コンテンツ */}
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
                      <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>AIが自動で数値を読み取ります</p>
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

              {recordTab === 'gym' && (
                <div className="flex flex-col gap-3">
                  {[['種目','例：プッシュアップ'],['セット数','例：3'],['回数','例：20']].map(([label, ph]) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      <input type="text" placeholder={ph}
                        className="w-full rounded-xl px-4 py-3 text-base outline-none border"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}/>
                    </div>
                  ))}
                </div>
              )}

              {errorMsg && <p className="text-xs text-[#FF4D6A] text-center mt-3">{errorMsg}</p>}

              {recordTab !== 'suunto' && (
                <button onClick={handleSaveRecord} disabled={saving}
                  className="w-full mt-6 py-4 rounded-2xl font-bold text-base disabled:opacity-50"
                  style={{
                    background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
                    color: isDark ? '#08080F' : '#FFFFFF',
                  }}>
                  {saving ? '保存中...' : '記録を保存してAIに報告'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}