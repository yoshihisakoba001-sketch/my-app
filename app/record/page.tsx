'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';

export default function RecordPage() {
  const router = useRouter();
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

  if (saved) return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-[rgba(197,255,71,0.15)] border-2 border-[#C5FF47] flex items-center justify-center text-4xl">✓</div>
      <p className="text-xl font-bold">記録しました！</p>
      <p className="text-sm text-[#7777A0]">マイタウンが少し成長しました 🏙️</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">記録する</h1>
        <p className="text-xs text-[#7777A0] mt-1">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
      </div>

      <div className="px-5 pt-4 flex gap-2">
        {[['suunto','📸 画像読み取り'],['manual','✏️ 手動入力'],['gym','💪 筋トレ']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${tab === id ? 'bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border-[rgba(197,255,71,0.3)]' : 'bg-[rgba(26,26,40,0.6)] text-[#7777A0] border-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        {tab === 'suunto' && (
          <div className="flex flex-col gap-4">
            <label className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${analyzing ? 'border-[rgba(197,255,71,0.5)] bg-[rgba(197,255,71,0.05)]' : 'border-[rgba(197,255,71,0.3)] bg-[rgba(197,255,71,0.03)] hover:bg-[rgba(197,255,71,0.06)]'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={analyzing} />
              {analyzing ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-[rgba(197,255,71,0.1)] flex items-center justify-center mx-auto mb-3">
                    <div className="w-6 h-6 border-2 border-[#C5FF47] border-t-transparent rounded-full animate-spin"/>
                  </div>
                  <p className="text-base font-semibold text-[#C5FF47]">AIが読み取り中...</p>
                  <p className="text-xs text-[#7777A0] mt-1">少々お待ちください</p>
                </>
              ) : previewUrl ? (
                <>
                  <img src={previewUrl} alt="preview" className="w-32 h-32 object-cover rounded-xl mx-auto mb-3"/>
                  <p className="text-sm text-[#7777A0]">別の画像を選択する場合はタップ</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-[rgba(197,255,71,0.1)] flex items-center justify-center text-3xl mx-auto mb-3">📸</div>
                  <p className="text-base font-semibold mb-2">ランニングアプリの画像を追加</p>
                  <p className="text-xs text-[#7777A0] leading-relaxed mb-3">タップしてギャラリーから選択</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Suunto', 'Garmin', 'Nike Run', 'Strava'].map(app => (
                      <span key={app} className="px-2 py-1 rounded-full bg-[rgba(197,255,71,0.12)] text-[#C5FF47] text-xs font-semibold">{app}</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#7777A0] mt-3">AIが自動で数値を読み取ります</p>
                </>
              )}
            </label>

            {errorMsg && (
              <div className="bg-[rgba(255,77,106,0.1)] border border-[rgba(255,77,106,0.3)] rounded-xl p-3 text-center">
                <p className="text-xs text-[#FF4D6A]">{errorMsg}</p>
                <p className="text-xs text-[#7777A0] mt-1">手動入力タブから入力してください</p>
              </div>
            )}
          </div>
        )}

        {tab === 'manual' && (
          <div className="flex flex-wrap gap-3">
            {previewUrl && (
              <div className="w-full flex items-center gap-3 bg-[rgba(197,255,71,0.05)] border border-[rgba(197,255,71,0.2)] rounded-xl p-3">
                <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded-lg"/>
                <div>
                  <p className="text-xs font-semibold text-[#C5FF47]">AIが読み取りました</p>
                  <p className="text-xs text-[#7777A0]">内容を確認・修正してください</p>
                </div>
              </div>
            )}
            {[
              {label:'距離', key:'distance', unit:'km', color:'text-[#C5FF47]'},
              {label:'タイム', key:'time', unit:'', color:'text-[#47B8FF]'},
              {label:'ペース', key:'pace', unit:'/km', color:'text-[#FF8547]'},
              {label:'心拍数', key:'hr', unit:'bpm', color:'text-[#FF4D6A]'},
            ].map(field => (
              <div key={field.key} className="w-[calc(50%-6px)]">
                <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">{field.label}</p>
                <div className="bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-3 py-2.5 flex items-baseline gap-1">
                  <input type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                    placeholder="0"
                    className={`flex-1 bg-transparent outline-none text-xl font-bold ${field.color} w-full`} />
                  {field.unit && <span className="text-xs text-[#44445A]">{field.unit}</span>}
                </div>
              </div>
            ))}
            <div className="w-full">
              <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">メモ</p>
              <textarea value={form.note}
                onChange={e => setForm(f => ({...f, note: e.target.value}))}
                placeholder="感想・コメントを追加..." rows={3}
                className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none text-[#EEEEF8] placeholder-[#44445A]" />
            </div>
          </div>
        )}

        {tab === 'gym' && (
          <div className="flex flex-col gap-3">
            {[['種目','例：プッシュアップ'],['セット数','例：3'],['回数','例：20']].map(([label, ph]) => (
              <div key={label}>
                <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">{label}</p>
                <input type="text" placeholder={ph}
                  className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-4 py-3 text-base outline-none text-[#EEEEF8] placeholder-[#44445A]" />
              </div>
            ))}
          </div>
        )}

        {errorMsg && tab !== 'suunto' && <p className="text-xs text-[#FF4D6A] text-center mt-3">{errorMsg}</p>}

        {tab !== 'suunto' && (
          <button onClick={handleSave} disabled={saving}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#C5FF47] to-[#A0E030] text-[#08080F] font-bold text-base disabled:opacity-50">
            {saving ? '保存中...' : '記録を保存する'}
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}