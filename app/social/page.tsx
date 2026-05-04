'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';

type FeedItem = {
  id: string;
  type: 'run' | 'race' | 'plan';
  userId: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  // run
  distance?: number;
  note?: string;
  // race
  raceName?: string;
  raceDate?: string;
  goalTime?: string;
  // plan
  weekStart?: string;
  targetKm?: number;
  phase?: string;
  // likes
  likeCount?: number;
  // comments
  comments?: { id: string; userName: string; userIcon: string; content: string; createdAt: string }[];
};

export default function SocialPage() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<'feed' | 'ranking'>('feed');
  const [ranking, setRanking] = useState<any[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [likedRunIds, setLikedRunIds] = useState<Set<string>>(new Set());
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState(false);
  const [myProfile, setMyProfile] = useState<{ name: string; icon: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // 自分のプロフィール取得
      const { data: myProf } = await supabase
        .from('profiles').select('name, icon').eq('id', user.id).maybeSingle();
      if (myProf) setMyProfile(myProf);

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

      const targetIds = [user.id, ...ids];

      // プロフィール取得
      const { data: profiles } = await supabase
        .from('profiles').select('id, name, icon').in('id', targetIds);
      const profileMap: Record<string, any> = {};
      profiles?.forEach(p => { profileMap[p.id] = p; });

      const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];

      // runs取得
      const { data: recentRuns } = await supabase
        .from('runs')
        .select('id, user_id, distance, date, note, created_at')
        .in('user_id', targetIds)
        .order('created_at', { ascending: false })
        .limit(30);

      // races取得
      const { data: recentRaces } = await supabase
        .from('races')
        .select('id, user_id, name, date, goal_time, created_at')
        .in('user_id', targetIds)
        .order('created_at', { ascending: false })
        .limit(10);

      

      // いいね済みrunを取得
      const { data: myLikes } = await supabase
        .from('likes').select('run_id').eq('user_id', user.id);
      const likedIds = new Set(myLikes?.map(l => l.run_id) || []);
      setLikedRunIds(likedIds);

      // いいね数取得
      const runIds = recentRuns?.map(r => r.id) || [];
      const { data: allLikes } = await supabase
        .from('likes').select('run_id').in('run_id', runIds);
      const likeCountMap: Record<string, number> = {};
      allLikes?.forEach(l => {
        likeCountMap[l.run_id] = (likeCountMap[l.run_id] || 0) + 1;
      });

      // コメント取得
      const { data: allComments } = await supabase
        .from('comments')
        .select('id, run_id, user_id, content, created_at')
        .in('run_id', runIds)
        .order('created_at', { ascending: true });

      const commentMap: Record<string, any[]> = {};
      allComments?.forEach(c => {
        if (!commentMap[c.run_id]) commentMap[c.run_id] = [];
        commentMap[c.run_id].push({
          id: c.id,
          userName: profileMap[c.user_id]?.name || 'ランナー',
          userIcon: profileMap[c.user_id]?.icon || '👟',
          content: c.content,
          createdAt: c.created_at,
        });
      });

      // フィードを統合してcreated_at順にソート
      const feedItems: FeedItem[] = [
        ...(recentRuns?.map(r => ({
          id: r.id,
          type: 'run' as const,
          userId: r.user_id,
          name: profileMap[r.user_id]?.name || 'ランナー',
          icon: profileMap[r.user_id]?.icon || '👟',
          color: colors[targetIds.indexOf(r.user_id) % colors.length],
          createdAt: r.created_at,
          distance: r.distance,
          note: r.note,
          likeCount: likeCountMap[r.id] || 0,
          comments: commentMap[r.id] || [],
        })) || []),
        ...(recentRaces?.map(r => ({
          id: r.id,
          type: 'race' as const,
          userId: r.user_id,
          name: profileMap[r.user_id]?.name || 'ランナー',
          icon: profileMap[r.user_id]?.icon || '👟',
          color: colors[targetIds.indexOf(r.user_id) % colors.length],
          createdAt: r.created_at,
          raceName: r.name,
          raceDate: r.date,
          goalTime: r.goal_time,
        })) || []),
        
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFeed(feedItems);

      // ランキング
      const { data: runs } = await supabase
        .from('runs').select('user_id, distance').in('user_id', targetIds);
      if (runs) {
        const kmMap: Record<string, number> = {};
        const countMap: Record<string, number> = {};
        runs.forEach(r => {
          kmMap[r.user_id] = (kmMap[r.user_id] || 0) + (r.distance || 0);
          countMap[r.user_id] = (countMap[r.user_id] || 0) + 1;
        });
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

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLike = async (runId: string) => {
    if (!currentUserId) return;
    if (likedRunIds.has(runId)) {
      await supabase.from('likes').delete().eq('user_id', currentUserId).eq('run_id', runId);
      setLikedRunIds(prev => { const s = new Set(prev); s.delete(runId); return s; });
      setFeed(prev => prev.map(f => f.id === runId ? { ...f, likeCount: (f.likeCount || 0) - 1 } : f));
    } else {
      await supabase.from('likes').insert({ user_id: currentUserId, run_id: runId });
      setLikedRunIds(prev => new Set(prev).add(runId));
      setFeed(prev => prev.map(f => f.id === runId ? { ...f, likeCount: (f.likeCount || 0) + 1 } : f));
    }
  };

  const handleComment = async (runId: string) => {
    if (!currentUserId || !commentInputs[runId]?.trim()) return;
    setSubmittingComment(true);
    const content = commentInputs[runId].trim();
    const { data } = await supabase.from('comments').insert({
      user_id: currentUserId,
      run_id: runId,
      content,
    }).select().single();

    if (data) {
      const newComment = {
        id: data.id,
        userName: myProfile?.name || 'ランナー',
        userIcon: myProfile?.icon || '👟',
        content,
        createdAt: data.created_at,
      };
      setFeed(prev => prev.map(f =>
        f.id === runId ? { ...f, comments: [...(f.comments || []), newComment] } : f
      ));
      setCommentInputs(prev => ({ ...prev, [runId]: '' }));
    }
    setSubmittingComment(false);
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

  const renderFeedItem = (item: FeedItem) => {
    const isMe = item.userId === currentUserId;
    const liked = likedRunIds.has(item.id);
    const isCommentOpen = openCommentId === item.id;

    return (
      <div key={item.id} className="rounded-xl p-4 border"
        style={{
          background: isMe ? 'var(--accent-bg)' : 'var(--bg-card)',
          borderColor: isMe ? 'var(--border-accent)' : 'var(--border)',
        }}>

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border"
            style={{ background: 'rgba(247,245,246,0.64)', borderColor: isMe ? 'var(--border-accent)' : 'var(--border)' }}>
            {item.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: isMe ? 'var(--accent)' : 'var(--text-primary)' }}>
              {item.name}{isMe ? '（あなた）' : ''}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getTimeAgo(item.createdAt)}</p>
          </div>
          <span className="text-xl">
            {item.type === 'run' ? '🏃' : item.type === 'race' ? '🏆' : '📋'}
          </span>
        </div>

        {/* コンテンツ */}
        {item.type === 'run' && (
          <>
            <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.distance}km を走りました！</p>
            {item.note && <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{item.note}</p>}
          </>
        )}
        {item.type === 'race' && (
          <>
            <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>🏆 {item.raceName} にエントリーしました！</p>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              {item.raceDate} · 目標 {item.goalTime}
            </p>
          </>
        )}
        {item.type === 'plan' && (
          <>
            <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>📋 週間計画を設定しました！</p>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              {item.weekStart}〜 · {item.phase} · 目標 {item.targetKm}km
            </p>
          </>
        )}

        {/* いいね・コメントボタン（runのみ、自分以外） */}
        {item.type === 'run' && (
          <>
            <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              {!isMe && (
                <button onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                  style={{ color: liked ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {liked ? '👏' : '👐'} 応援する {(item.likeCount || 0) > 0 && <span>{item.likeCount}</span>}
                </button>
              )}
              {isMe && (item.likeCount || 0) > 0 && (
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  👏 {item.likeCount}人が応援
                </span>
              )}
              <button
                onClick={() => setOpenCommentId(isCommentOpen ? null : item.id)}
                className="text-xs font-semibold"
                style={{ color: 'var(--text-secondary)' }}>
                💬 コメント {(item.comments?.length || 0) > 0 && `(${item.comments?.length})`}
              </button>
            </div>

            {/* コメント一覧 */}
            {isCommentOpen && (
              <div className="mt-3 flex flex-col gap-2">
                {item.comments?.map(c => (
                  <div key={c.id} className="flex gap-2 items-start">
                    <span className="text-base">{c.userIcon}</span>
                    <div className="flex-1 rounded-xl px-3 py-2 text-xs" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
                      <span className="font-semibold mr-1" style={{ color: 'var(--accent)' }}>{c.userName}</span>
                      {c.content}
                    </div>
                  </div>
                ))}
                {item.comments?.length === 0 && (
                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>まだコメントはありません</p>
                )}
                <div className="flex gap-2 mt-1">
                  <input
                    value={commentInputs[item.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleComment(item.id); }}
                    placeholder="コメントを入力..."
                    className="flex-1 rounded-full px-3 py-1.5 text-xs outline-none border"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={() => handleComment(item.id)}
                    disabled={submittingComment || !commentInputs[item.id]?.trim()}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-50"
                    style={{
                      background: isDark ? 'linear-gradient(90deg, #C5FF47, #A0E030)' : 'linear-gradient(90deg, #FF3B8B, #FF6B9D)',
                      color: isDark ? '#08080F' : '#FFFFFF',
                    }}>
                    送信
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
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

      {tab === 'feed' && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
          ) : feed.length === 0 ? (
            <div className="rounded-2xl p-6 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-2xl mb-2">👟</p>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>まだ記録がありません</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>友人を追加するとここにフィードが表示されます</p>
              <a href="/profile" className="inline-block mt-3 text-xs px-4 py-2 rounded-full font-semibold"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                友人を追加する →
              </a>
            </div>
          ) : (
            feed.map(item => renderFeedItem(item))
          )}
        </div>
      )}

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
                        style={{ background: 'rgba(247,245,246,0.64)', borderColor: isMe ? 'var(--border-accent)' : 'var(--border)' }}>
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