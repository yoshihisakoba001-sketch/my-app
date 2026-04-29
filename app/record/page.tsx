'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

export default function RecordPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'suunto' | 'manual' | 'gym'>('suunto');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    distance: '',
    time: '',
    pace: '',
    hr: '',
    note: '',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => router.push('/'), 1800);
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[rgba(197,255,71,0.15)] border-2 border-[#C5FF47] flex items-center justify-center text-4xl">
          ✓
        </div>
        <p className="text-xl font-bold">記録しました！</p>
        <p className="text-sm text-[#7777A0]">マイタウンが少し成長しました 🏙️</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">記録する</h1>
        <p className="text-xs text-[#7777A0] mt-1">4月28日（月）</p>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'suunto', label: 'Suunto画像' },
          { id: 'manual', label: '手動入力' },
          { id: 'gym',    label: '筋トレ' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
              tab === t.id
                ? 'bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border-[rgba(197,255,71,0.3)]'
                : 'bg-[rgba(26,26,40,0.6)] text-[#7777A0] border-white/10'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">

        {/* Suunto upload */}
        {tab === 'suunto' && (
          <label className="block border-2 border-dashed border-[rgba(197,255,71,0.3)] rounded-2xl p-10 text-center cursor-pointer bg-[rgba(197,255,71,0.03)] hover:bg-[rgba(197,255,71,0.06)] transition-all">
            <input type="file" accept="image/*" className="hidden" onChange={() => setTab('manual')} />
            <div className="w-14 h-14 rounded-full bg-[rgba(197,255,71,0.1)] flex items-center justify-center text-3xl mx-auto mb-3">
              📤
            </div>
            <p className="text-base font-semibold mb-2">Suuntoスクリーンショットを追加</p>
            <p className="text-xs text-[#7777A0] leading-relaxed">タップしてギャラリーから選択</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[rgba(197,255,71,0.12)] text-[#C5FF47] text-xs font-semibold">
              AIが自動読み取り
            </span>
          </label>
        )}

        {/* Manual input */}
        {(tab === 'manual' || tab === 'suunto') && tab !== 'suunto' && (
          <div className="flex flex-wrap gap-3">
            {[
              { label: '距離', key: 'distance', unit: 'km', color: 'text-[#C5FF47]' },
              { label: 'タイム', key: 'time', unit: '', color: 'text-[#47B8FF]' },
              { label: 'ペース', key: 'pace', unit: '/km', color: 'text-[#FF8547]' },
              { label: '心拍数', key: 'hr', unit: 'bpm', color: 'text-[#FF4D6A]' },
            ].map(field => (
              <div key={field.key} className="w-[calc(50%-6px)]">
                <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">{field.label}</p>
                <div className="bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-3 py-2.5 flex items-baseline gap-1">
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder="0"
                    className={`flex-1 bg-transparent outline-none text-xl font-bold ${field.color} w-full`}
                  />
                  {field.unit && <span className="text-xs text-[#44445A]">{field.unit}</span>}
                </div>
              </div>
            ))}
            <div className="w-full">
              <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">メモ</p>
              <textarea
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="感想・コメントを追加..."
                rows={3}
                className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none text-[#EEEEF8] placeholder-[#44445A]"
              />
            </div>
          </div>
        )}

        {/* Manual tab */}
        {tab === 'manual' && (
          <div className="flex flex-wrap gap-3">
            {[
              { label: '距離', key: 'distance', unit: 'km', color: 'text-[#C5FF47]' },
              { label: 'タイム', key: 'time', unit: '', color: 'text-[#47B8FF]' },
              { label: 'ペース', key: 'pace', unit: '/km', color: 'text-[#FF8547]' },
              { label: '心拍数', key: 'hr', unit: 'bpm', color: 'text-[#FF4D6A]' },
            ].map(field => (
              <div key={field.key} className="w-[calc(50%-6px)]">
                <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">{field.label}</p>
                <div className="bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-3 py-2.5 flex items-baseline gap-1">
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder="0"
                    className={`flex-1 bg-transparent outline-none text-xl font-bold ${field.color} w-full`}
                  />
                  {field.unit && <span className="text-xs text-[#44445A]">{field.unit}</span>}
                </div>
              </div>
            ))}
            <div className="w-full">
              <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">メモ</p>
              <textarea
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="感想・コメントを追加..."
                rows={3}
                className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none text-[#EEEEF8] placeholder-[#44445A]"
              />
            </div>
          </div>
        )}

        {/* Gym tab */}
        {tab === 'gym' && (
          <div className="flex flex-col gap-3">
            {[
              { label: '種目', placeholder: '例：プッシュアップ' },
              { label: 'セット数', placeholder: '例：3' },
              { label: '回数', placeholder: '例：20' },
            ].map(field => (
              <div key={field.label}>
                <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-1">{field.label}</p>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-4 py-3 text-base outline-none text-[#EEEEF8] placeholder-[#44445A]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Save button */}
        {tab !== 'suunto' && (
          <button onClick={handleSave}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#C5FF47] to-[#A0E030] text-[#08080F] font-bold text-base shadow-lg shadow-[#C5FF47]/30">
            記録を保存する
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}