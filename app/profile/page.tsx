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

type Friend = {
  id: string;
  name: string;
  icon: string;
  km: number;
};

type FriendRequest = {
  id: string;
  requester_id: string;
  name: string;
  icon: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [tab, setTab] = useState<'profile' | 'friends'>('profile');
  const [name, setName] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('👟');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  // 友人管理
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);

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
      if (profile?.icon) setSelectedIcon(profile.icon);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (tab === 'friends' && userId) {
      fetchFriendsData();
    }
  }, [tab, userId]);

  const fetchFriendsData = async () => {
    if (!userId) return;
    setFriendsLoading(true);

    // 友人一覧取得
    const { data: friendships } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (friendships) {
      const friendIds = friendships.map(f =>
        f.requester_id === userId ? f.receiver_id : f.requester_id
      );
      if (friendIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, icon')
          .in('id', friendIds);

        const { data: runs } = await supabase
          .from('runs')
          .select('user_id, distance')
          .in('user_id', friendIds);

        const kmMap: Record<string, number> = {};
        runs?.forEach(r => {
          kmMap[r.user_id] = (kmMap[r.user_id] || 0) + (r.distance || 0);
        });

        const friendData = profiles?.map(p => ({
          id: p.id,
          name: p.name || 'ランナー',
          icon: p.icon || '👟',
          km: Math.round((kmMap[p.id] || 0) * 10) / 10,
        })) || [];

        setFriends(friendData);
      }
    }

    // 届いた申請を取得
    const { data: pendingRequests } = await supabase
      .from('friendships')
      .select('id, requester_id')
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (pendingRequests && pendingRequests.length > 0) {
      const requesterIds = pendingRequests.map(r => r.requester_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, icon')
        .in('id', requesterIds);

      const requestData = pendingRequests.map(r => {
        const profile = profiles?.find(p => p.id === r.requester_id);
        return {
          id: r.id,
          requester_id: r.requester_id,
          name: profile?.name || 'ランナー',
          icon: profile?.icon || '👟',
        };
      });
      setRequests(requestData);
    } else {
      setRequests([]);
    }

    setFriendsLoading(false);
  };

  const generateInviteUrl = async () => {
    if (!userId) return;
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await supabase.from('invite_tokens').insert({
      token,
      inviter_id: userId,
    });
    const url = `${window.location.origin}/lp?token=${token}`;
    setInviteUrl(url);
  };

  const copyInviteUrl = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !userId) return;
    setSearching(true);

    const { data } = await supabase
      .from('profiles')
      .select('id, name, icon, email')
      .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .neq('id', userId)
      .limit(5);

    // 既に友人・申請済みを除外
    const { data: existingFriendships } = await supabase
      .from('friendships')
      .select('requester_id, receiver_id')
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    const existingIds = new Set(
      existingFriendships?.flatMap(f => [f.requester_id, f.receiver_id]) || []
    );

    const filtered = data?.filter(p => !existingIds.has(p.id)) || [];
    setSearchResults(filtered);
    setSearching(false);
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!userId) return;
    await supabase.from('friendships').insert({
      requester_id: userId,
      receiver_id: receiverId,
      status: 'pending',
    });
    setSearchResults(prev => prev.filter(p => p.id !== receiverId));
  };

  const handleRequest = async (requestId: string, accept: boolean) => {
    await supabase.from('friendships')
      .update({ status: accept ? 'accepted' : 'rejected' })
      .eq('id', requestId);
    await fetchFriendsData();
  };

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
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>プロフィールと友人を管理</p>
      </div>

      {/* タブ切り替え */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'profile', label: '👤 プロフィール' },
          { id: 'friends', label: '👥 友人管理' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
            style={{
              background: tab === t.id ? 'var(--accent-bg)' : 'var(--bg-card)',
              color: tab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              borderColor: tab === t.id ? 'var(--border-accent)' : 'var(--border)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* プロフィールタブ */}
      {tab === 'profile' && (
        <div className="px-5 pt-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-2"
              style={{ background: 'rgba(247, 245, 246, 0.64)', borderColor: 'var(--border-accent)' }}>
              {selectedIcon}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>アイコンを選択してください</p>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
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

          <button onClick={handleSave} disabled={saving || !name.trim()}
            className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50"
            style={{
              background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
              color: isDark ? '#08080F' : '#FFFFFF',
            }}>
            {saving ? '保存中...' : '保存する'}
          </button>

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

          <button onClick={() => router.push('/social')}
            className="w-full py-3 rounded-2xl text-sm border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            戻る
          </button>
        </div>
      )}

      {/* 友人管理タブ */}
      {tab === 'friends' && (
        <div className="px-5 pt-4 flex flex-col gap-5">

          {/* 招待URL */}
          <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>🔗 招待リンクで友人を招く</p>
            {!inviteUrl ? (
              <button onClick={generateInviteUrl}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
                  color: isDark ? '#08080F' : '#FFFFFF',
                }}>
                招待リンクを生成する
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs px-3 py-2 rounded-lg break-all" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>
                  {inviteUrl}
                </p>
                <button onClick={copyInviteUrl}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: copied ? 'var(--accent-bg)' : (isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)'),
                    color: copied ? 'var(--accent)' : (isDark ? '#08080F' : '#FFFFFF'),
                  }}>
                  {copied ? '✅ コピーしました！' : '📋 リンクをコピー'}
                </button>
              </div>
            )}
          </div>

          {/* ユーザー検索 */}
          <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>🔍 ユーザーを検索して追加</p>
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="ニックネームまたはメアド"
                className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none border"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button onClick={handleSearch} disabled={searching}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0"
                style={{
                  background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
                  color: isDark ? '#08080F' : '#FFFFFF',
                }}>
                {searching ? '...' : '検索'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {searchResults.map(p => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <span className="text-2xl">{p.icon || '👟'}</span>
                    <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                    <button onClick={() => sendFriendRequest(p.id)}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                      申請する
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !searching && (
              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>見つかりませんでした</p>
            )}
          </div>

          {/* 届いた申請 */}
          {requests.length > 0 && (
            <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>📩 友人申請 ({requests.length})</p>
              <div className="flex flex-col gap-2">
                {requests.map(r => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <span className="text-2xl">{r.icon}</span>
                    <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                    <button onClick={() => handleRequest(r.id, true)}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold mr-1"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                      承認
                    </button>
                    <button onClick={() => handleRequest(r.id, false)}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      拒否
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 友人一覧 */}
          <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              👟 友人一覧 ({friends.length}人)
            </p>
            {friendsLoading ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
            ) : friends.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>まだ友人がいません</p>
            ) : (
              <div className="flex flex-col gap-2">
                {friends.map(f => (
                  <div key={f.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <span className="text-2xl">{f.icon}</span>
                    <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{f.km}km</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}