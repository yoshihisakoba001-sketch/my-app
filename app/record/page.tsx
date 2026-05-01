'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';

export default function RecordPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [tab, setTab] = useState('suunto');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    distance: '', time: '', pace: '', hr: '', note: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
      else router.push('/login');
    });
  }, []);

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
        const mediaType = file.type;
        const res = await fetch('/api/analyze-run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mediaType }),
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
          setTab('manual');
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

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setErrorMsg('');
    const { error } = await supabase.from('runs').insert({
      user_id: userId,
      date: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })(),
      distance: parseFloat(form.distance) || 0,
      duration: form.time,
      pace: form.pace,
      heart_rate: parseInt(form.hr) || null,
      note: form.note,
    });
    if (error) {
      setErrorMsg('保存に失敗しました: ' + error.message);
      setSaving(false);
    } else {
      setSaved(true);
      setTimeout(() => router.push('/'), 1800);
    }
  };

  const fieldColors = isDark
    ? ['text-[#C5FF47]', 'text-[#47B8FF]', 'text-[#FF8547]', 'text-[#FF4D6A]']
    : ['text-[#FF3B8B]', 'text-[#3B82F6]', 'text-[#F97316]', 'text-[#EF4444]'];

  if (saved) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2" style={{ background: 'var(--accent-bg)', borderColor: 'var(--accent)' }}>✓</div>
      <p className="text-xl font-bold">記録しました！</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>マイタウンが少し成長しました 🏙️</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="px-5 pt-12 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold tracking-tight">記録する</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
      </div>

      <div className="px-5 pt-4 flex gap-2">
        {[['suunto','📸 画像読み取り'],['manual','✏️ 手動入力'],['gym','💪 筋トレ']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              background: tab === id ? 'var(--accent-bg)' : 'var(--bg-card)',
              color: tab === id ? 'var(--accent)' : 'var(--text-secondary)',
              borderColor: tab === id ? 'var(--border-accent)' : 'var(--border)',
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        {tab === 'suunto' && (
          <div className="flex flex-col gap-4">
            <label className="block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
              style={{
                borderColor: analyzing ? 'var(--accent)' : 'var(--border-accent)',
                background: analyzing ? 'var(--accent-bg)' : 'var(--bg-card)',
              }}>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={analyzing} />
              {analyzing ? (
                <>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--accent-bg)' }}>
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}/>
                  </div>
                  <p className="text-base font-semibold" style={{ color: 'var(--accent)' }}>AIが読み取り中...</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>少々お待ちください</p>
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

            {errorMsg && (
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)' }}>
                <p className="text-xs text-[#FF4D6A]">{errorMsg}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>手動入力タブから入力してください</p>
              </div>
            )}
          </div>
        )}

        {tab === 'manual' && (
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
              {label:'距離', key:'distance', unit:'km', colorIdx: 0},
              {label:'タイム', key:'time', unit:'', colorIdx: 1},
              {label:'ペース', key:'pace', unit:'/km', colorIdx: 2},
              {label:'心拍数', key:'hr', unit:'bpm', colorIdx: 3},
            ].map(field => (
              <div key={field.key} className="w-[calc(50%-6px)]">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{field.label}</p>
                <div className="rounded-xl px-3 py-2.5 flex items-baseline gap-1 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <input type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                    placeholder="0"
                    className={`flex-1 bg-transparent outline-none text-xl font-bold w-full ${fieldColors[field.colorIdx]}`} />
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
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        )}

        {tab === 'gym' && (
          <div className="flex flex-col gap-3">
            {[['種目','例：プッシュアップ'],['セット数','例：3'],['回数','例：20']].map(([label, ph]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <input type="text" placeholder={ph}
                  className="w-full rounded-xl px-4 py-3 text-base outline-none border"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
          </div>
        )}

        {errorMsg && tab !== 'suunto' && <p className="text-xs text-[#FF4D6A] text-center mt-3">{errorMsg}</p>}

        {tab !== 'suunto' && (
          <button onClick={handleSave} disabled={saving}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-base disabled:opacity-50"
            style={{
              background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
              color: isDark ? '#08080F' : '#FFFFFF',
            }}>
            {saving ? '保存中...' : '記録を保存する'}
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}