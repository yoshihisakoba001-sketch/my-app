'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';

export default function SocialPage() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<'feed' | 'ranking'>('feed');
  const [ranking, setRanking] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [likedRunIds, setLikedRunIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // 友人IDを取得
      const { data: friendships } = await supabase
        .from('friendships')
        .select('requester_id, receiver_id')
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const ids = friendships?.map(f =>
        f.requester_id === user.id ? f.receiver_id : f.requester_id
      ) || [];
      setFriendIds(ids);

      // 自分を含めた対象IDリスト
      const targetIds = [user.id, ...ids];

      // プロフィール取得
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, icon')
        .in('id', targetIds);

      const profileMap: Record<string, any> = {};
      profiles?.forEach(p => { profileMap[p.id] = p; });

      // ランキング
      const { data: runs } = await supabase
        .from('runs')
        .select('user_id, distance')
        .in('user_id', targetIds);

      if (runs) {
        const kmMap: Record<string, number> = {};
        const countMap: Record<string, number> = {};
        runs.forEach(r => {
          kmMap[r.user_id] = (kmMap[r.user_id] || 0) + (r.distance || 0);
          countMap[r.user_id] = (countMap[r.user_id] || 0) + 1;
        });

        const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];
        const rankingData = targetIds.map((id, i) => ({
          id,
          name: profileMap[id]?.name || 'ランナー',
          icon: profileMap[id]?.icon || '👟',
          km: Math.round((kmMap[id] || 0) * 10) / 10,
          runs: countMap[id] || 0,
          color: colors[i % colors.length],
        })).sort((a, b) => b.km - a.km);

        setRanking(rankingData);
      }

      // フィード
      const { data: recentRuns } = await supabase
        .from('runs')
        .select('id, user_id, distance, date, note, created_at')
        .in('user_id', targetIds)
        .order('created_at', { ascending: false })
        .limit(30);

      // 自分のいいね済みrunを取得
      const { data: myLikes } = await supabase
        .from('likes')
        .select('run_id')
        .eq('user_id', user.id);

      const likedIds = new Set(myLikes?.map(l => l.run_id) || []);
      setLikedRunIds(likedIds);

      // いいね数を取得
      const runIds = recentRuns?.map(r => r.id) || [];
      const { data: allLikes } = await supabase
        .from('likes')
        .select('run_id')
        .in('run_id', runIds);

      const likeCountMap: Record<string, number> = {};
      allLikes?.forEach(l => {
        likeCountMap[l.run_id] = (likeCountMap[l.run_id] || 0) + 1;
      });

      const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];
      const feedData = recentRuns?.map((r, i) => ({
        id: r.id,
        userId: r.user_id,
        name: profileMap[r.user_id]?.name || 'ランナー',
        icon: profileMap[r.user_id]?.icon || '👟',
        distance: r.distance,
        date: r.date,
        note: r.note,
        createdAt: r.created_at,
        color: colors[targetIds.indexOf(r.user_id) % colors.length],
        likeCount: likeCountMap[r.id] || 0,
      })) || [];

      setFeed(feedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLike = async (runId: string) => {
    if (!currentUserId) return;

    if (likedRunIds.has(runId)) {
      // いいね取り消し
      await supabase.from('likes').delete()
        .eq('user_id', currentUserId)
        .eq('run_id', runId);
      setLikedRunIds(prev => { const s = new Set(prev); s.delete(runId); return s; });
      setFeed(prev => prev.map(f => f.id === runId ? { ...f, likeCount: f.likeCount - 1 } : f));
    } else {
      // いいね
      await supabase.from('likes').insert({ user_id: currentUserId, run_id: runId });
      setLikedRunIds(prev => new Set(prev).add(runId));
      setFeed(prev => prev.map(f => f.id === runId ? { ...f, likeCount: f.likeCount + 1 } : f));
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (hours < 1) return 'たった今';
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return new Date(dateStr).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ソーシャル</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {friendIds.length > 0 ? `友人${friendIds.length}人と一緒に走っています` : '友人を追加してみましょう'}
          </p>
        </div>
        <a href="/profile" className="text-xs px-3 py-1.5 rounded-full font-semibold border"
          style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--border-accent)' }}>
          👤 マイページ
        </a>
      </div>

      {/* Tab switcher */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'feed',    label: '📣 フィード' },
          { id: 'ranking', label: '🏆 ランキング' },
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

      {/* Feed tab */}
      {tab === 'feed' && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
          ) : feed.length === 0 ? (
            <div className="rounded-2xl p-6 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-2xl mb-2">👟</p>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>まだ記録がありません</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                友人を追加するとここにフィードが表示されます
              </p>
              <a href="/profile" className="inline-block mt-3 text-xs px-4 py-2 rounded-full font-semibold"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                友人を追加する →
              </a>
            </div>
          ) : (
            feed.map((item) => {
              const isMe = item.userId === currentUserId;
              const liked = likedRunIds.has(item.id);
              return (
                <div key={item.id} className="rounded-xl p-4 border"
                  style={{
                    background: isMe ? 'var(--accent-bg)' : 'var(--bg-card)',
                    borderColor: isMe ? 'var(--border-accent)' : 'var(--border)',
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border"
                      style={{
                        background: 'rgba(247, 245, 246, 0.64)',
                        borderColor: isMe ? 'var(--border-accent)' : 'var(--border)',
                      }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: isMe ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {item.name}{isMe ? '（あなた）' : ''}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getTimeAgo(item.createdAt)}</p>
                    </div>
                    <span className="text-2xl">🏃</span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {item.distance}km を走りました！
                  </p>
                  {item.note && (
                    <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{item.note}</p>
                  )}
                  <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                      style={{ color: liked ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {liked ? '👏' : '👐'} 応援する {item.likeCount > 0 && <span>{item.likeCount}</span>}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Ranking tab */}
      {tab === 'ranking' && (
        <div className="px-5 pt-4">
          {loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
          ) : ranking.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>まだランキングデータがありません</p>
          ) : (
            <>
              {ranking.length >= 3 && (
                <div className="flex items-end justify-center gap-4 mb-6 h-36">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      {ranking[1].icon}
                    </div>
                    <div className="w-20 h-16 rounded-t-xl flex flex-col items-center justify-center gap-1 border"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      <span className="text-2xl">🥈</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ranking[1].km}km</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">👑</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      {ranking[0].icon}
                    </div>
                    <div className="w-20 h-24 rounded-t-xl flex flex-col items-center justify-center gap-1 border"
                      style={{ background: isDark ? 'rgba(255,215,0,0.08)' : 'rgba(255,215,0,0.15)', borderColor: 'rgba(255,215,0,0.3)' }}>
                      <span className="text-2xl">🥇</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ranking[0].km}km</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      {ranking[2].icon}
                    </div>
                    <div className="w-20 h-12 rounded-t-xl flex flex-col items-center justify-center gap-1 border"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      <span className="text-2xl">🥉</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ranking[2].km}km</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {ranking.map((m, i) => {
                  const isMe = m.id === currentUserId;
                  return (
                    <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3 border"
                      style={{
                        background: isMe ? 'var(--accent-bg)' : 'var(--bg-card)',
                        borderColor: isMe ? 'var(--border-accent)' : 'var(--border)',
                      }}>
                      <span className="text-xl w-7 text-center">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>}
                      </span>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl border"
                        style={{ background: 'rgba(247, 245, 246, 0.64)', borderColor: isMe ? 'var(--border-accent)' : 'var(--border)' }}>
                        {m.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: isMe ? 'var(--accent)' : 'var(--text-primary)' }}>
                          {m.name}{isMe ? '（あなた）' : ''}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.runs}回</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: isMe ? 'var(--accent)' : 'var(--text-primary)' }}>{m.km}km</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}