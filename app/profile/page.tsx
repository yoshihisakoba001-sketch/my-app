'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';

const ICON_CATEGORIES = [
  {
    label: 'ランニングギア',
    icons: ['👟', '🧢', '🎒', '🕶️', '🧤', '🧦', '⌚', '🩱', '🩳', '👕', '🧭'],
  },
  {
    label: '干支・動物',
    icons: ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐒', '🐓', '🐶', '🐷'],
  },
  {
    label: '自然・環境',
    icons: ['🌿', '🏔️', '🌊', '☀️', '🌙', '⛅', '🌈', '🍃'],
  },
  {
    label: 'スポーツ',
    icons: ['🧗', '🚴', '🤸', '🧘', '🤾', '🏊', '🚵', '🤺', '🏋️', '🤼'],
  },
  {
    label: '趣味',
    icons: ['🎸', '🎹', '🎨', '📸', '🍳', '📚', '🎮', '🎭', '🌍', '🎤'],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('👟');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, icon')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.name) {
        setCurrentName(profile.name);
        setName(profile.name);
      }
      if (profile?.icon) {
        setSelectedIcon(profile.icon);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!userId || !name.trim()) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, name: name.trim(), icon: selectedIcon });

    if (!error) {
      setSaved(true);
      setTimeout(() => router.push('/social'), 1500);
    }
    setSaving(false);
  };

  if (saved) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2" style={{ background: 'var(--accent-bg)', borderColor: 'var(--accent)' }}>✓</div>
      <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>保存しました！</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="px-5 pt-12 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold tracking-tight">マイページ</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>プロフィールとテーマを設定してください</p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-6">

        {/* アイコン表示 */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-2"
            style={{ background: 'rgba(247, 245, 246, 0.64)', borderColor: 'var(--border-accent)' }}>
            {selectedIcon}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>アイコンを選択してください</p>
        </div>

        {/* アイコン選択 */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          {/* カテゴリタブ */}
          <div className="flex border-b overflow-x-auto hide-scroll" style={{ borderColor: 'var(--border)' }}>
            {ICON_CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className="px-3 py-2 text-[10px] font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={{
                  color: activeCategory === i ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: activeCategory === i ? '2px solid var(--accent)' : '2px solid transparent',
                  background: 'transparent',
                }}>
                {cat.label}
              </button>
            ))}
          </div>
          {/* アイコングリッド */}
          <div className="p-3 grid grid-cols-6 gap-2">
            {ICON_CATEGORIES[activeCategory].icons.map(icon => (
              <button key={icon} onClick={() => setSelectedIcon(icon)}
                className="w-full aspect-square rounded-xl flex items-center justify-center text-2xl transition-all"
                style={{
                  background: selectedIcon === icon ? 'var(--accent-bg)' : 'transparent',
                  border: selectedIcon === icon ? '2px solid var(--accent)' : '2px solid transparent',
                  transform: selectedIcon === icon ? 'scale(1.1)' : 'scale(1)',
                }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ニックネーム */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>ニックネーム</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="例：田中ランナー"
            maxLength={20}
            className="w-full rounded-xl px-4 py-3 text-base outline-none border"
            style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{name.length}/20</p>
        </div>

        {currentName && (
          <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            現在のニックネーム: <span style={{ color: 'var(--accent)' }}>{currentName}</span>
          </p>
        )}

        {/* 保存ボタン */}
        <button onClick={handleSave} disabled={saving || !name.trim()}
          className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50"
          style={{
            background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
            color: isDark ? '#08080F' : '#FFFFFF',
          }}>
          {saving ? '保存中...' : '保存する'}
        </button>

        {/* テーマ切り替え */}
        <div className="flex items-center justify-between rounded-xl px-4 py-3 border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>テーマ</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{isDark ? '🌙 ダークモード' : '☀️ ライトモード'}</p>
          </div>
          <button onClick={toggleTheme}
            className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
            style={{ background: isDark ? '#C5FF47' : '#FF3B8B' }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
              style={{ left: isDark ? '2px' : '26px' }}/>
          </button>
        </div>

        {/* キャンセル */}
        <button onClick={() => router.push('/social')}
          className="w-full py-3 rounded-2xl text-sm border"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          戻る
        </button>

      </div>
    </div>
  );
}