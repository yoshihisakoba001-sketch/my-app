'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';

export default function RecordPage() {
  const router = useRouter();
  const [tab, setTab] = useState('manual');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    distance: '', time: '', pace: '', hr: '', note: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
      else router.push('/login');
    });
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setErrorMsg('');
    const { error } = await supabase.from('runs').insert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
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
      <div className="w-20 h-20 rounded-full bg-[rgba(197,255,71,0.15)] border-2 border-[#C5FF47] flex items-center justify-center text-4xl">checkmark</div>
      <p className="text-xl font-bold">記録しました！</p>
      <p className="text-sm text-[#7777A0]">マイタウンが少し成長しました</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">記録する</h1>
      </div>
      <div className="px-5 pt-4 flex gap-2">
        {[['suunto','Suunto画像'],['manual','手動入力'],['gym','筋トレ']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${tab === id ? 'bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border-[rgba(197,255,71,0.3)]' : 'bg-[rgba(26,26,40,0.6)] text-[#7777A0] border-white/10'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="px-5 pt-4">
        {tab === 'manual' && (
          <div className="flex flex-wrap gap-3">
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
        {errorMsg && <p className="text-xs text-[#FF4D6A] text-center mt-3">{errorMsg}</p>}
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
