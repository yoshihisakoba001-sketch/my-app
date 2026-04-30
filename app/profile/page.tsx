'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.name) {
        setCurrentName(profile.name);
        setName(profile.name);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!userId || !name.trim()) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, name: name.trim() });

    if (!error) {
      setSaved(true);
      setTimeout(() => router.push('/social'), 1500);
    }
    setSaving(false);
  };

  if (saved) return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-[rgba(197,255,71,0.15)] border-2 border-[#C5FF47] flex items-center justify-center text-4xl">✓</div>
      <p className="text-xl font-bold">保存しました！</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">プロフィール</h1>
        <p className="text-xs text-[#7777A0] mt-1">ニックネームを設定してください</p>
      </div>

      <div className="px-5 pt-8 flex flex-col gap-6">
        <div className="w-20 h-20 rounded-full bg-[rgba(197,255,71,0.1)] border-2 border-[rgba(197,255,71,0.3)] flex items-center justify-center text-4xl font-bold text-[#C5FF47] mx-auto">
          {name ? name[0].toUpperCase() : '?'}
        </div>

        <div>
          <p className="text-[10px] text-[#44445A] font-semibold uppercase tracking-wider mb-2">ニックネーム</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="例：田中ランナー"
            maxLength={20}
            className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-4 py-3 text-base outline-none text-[#EEEEF8] placeholder-[#44445A] focus:border-[rgba(197,255,71,0.3)]"
          />
          <p className="text-xs text-[#44445A] mt-1 text-right">{name.length}/20</p>
        </div>

        {currentName && (
          <p className="text-xs text-[#7777A0] text-center">現在のニックネーム: <span className="text-[#C5FF47]">{currentName}</span></p>
        )}

        <button onClick={handleSave} disabled={saving || !name.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5FF47] to-[#A0E030] text-[#08080F] font-bold text-base disabled:opacity-50">
          {saving ? '保存中...' : '保存する'}
        </button>

        <button onClick={() => router.back()}
          className="w-full py-3 rounded-2xl border border-white/10 text-[#7777A0] text-sm">
          キャンセル
        </button>
      </div>
    </div>
  );
}