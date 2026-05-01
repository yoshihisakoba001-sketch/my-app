'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';

export default function SocialPage() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<'ranking' | 'feed'>('ranking');
  const [ranking, setRanking] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data: runs } = await supabase.from('runs').select('user_id, distance');
      const { data: profiles } = await supabase.from('profiles').select('id, name, icon');

      if (runs && profiles) {
        const kmMap: Record<string, number> = {};
        const countMap: Record<string, number> = {};
        runs.forEach(r => {
          kmMap[r.user_id] = (kmMap[r.user_id] || 0) + (r.distance || 0);
          countMap[r.user_id] = (countMap[r.user_id] || 0) + 1;
        });

        const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];
        const rankingData = profiles.map((p, i) => ({
          id: p.id,
          name: p.name || 'ランナー',
          icon: p.icon || '👟',
          km: Math.round((kmMap[p.id] || 0) * 10) / 10,
          runs: countMap[p.id] || 0,
          color: colors[i % colors.length],
        })).sort((a, b) => b.km - a.km);

        setRanking(rankingData);
      }

      const { data: recentRuns } = await supabase
        .from('runs').select('user_id, distance, date, note, created_at')
        .order('created_at', { ascending: false }).limit(20);
      const { data: profiles2 } = await supabase.from('profiles').select('id, name, icon');

      if (recentRuns && profiles2) {
        const profileMap: Record<string, string> = {};
        const iconMap: Record<string, string> = {};
        profiles2.forEach(p => {
          profileMap[p.id] = p.name || 'ランナー';
          iconMap[p.id] = p.icon || '👟';
        });
        const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];
        const feedData = recentRuns.map((r) => ({
          userId: r.user_id,
          name: profileMap[r.user_id] || 'ランナー',
          icon: iconMap[r.user_id] || '👟',
          distance: r.distance,
          date: r.date,
          note: r.note,
          createdAt: r.created_at,
          color: colors[Object.keys(profileMap).indexOf(r.user_id) % colors.length],
        }));
        setFeed(feedData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

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
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>ランナーズコミュニティ</p>
        </div>
        <a href="/profile" className="text-xs px-3 py-1.5 rounded-full font-semibold border"
          style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--border-accent)' }}>
          👤 マイページ
        </a>
      </div>

      {/* Tab switcher */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'ranking', label: '🏆 ランキング' },
          { id: 'feed',    label: '📣 みんなの活動' },
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

      {/* Ranking tab */}
      {tab === 'ranking' && (
        <div className="px-5 pt-4">
          {loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
          ) : ranking.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>まだランキングデータがありません</p>
          ) : (
            <>
              {/* Podium */}
              {ranking.length >= 3 && (
                <div className="flex items-end justify-center gap-4 mb-6 h-36">
                  {/* 2nd */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                      style={{ background: `${ranking[1].color}20`, borderColor: `${ranking[1].color}55`, color: ranking[1].color }}>
                      {ranking[1].icon || ranking[1].name[0]}
                    </div>
                    <div className="w-20 h-16 rounded-t-xl flex flex-col items-center justify-center gap-1 border"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      <span className="text-2xl">🥈</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ranking[1].km}km</span>
                    </div>
                  </div>
                  {/* 1st */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">👑</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                      style={{ background: `${ranking[0].color}20`, borderColor: `${ranking[0].color}55`, color: ranking[0].color }}>
                      {ranking[0].icon || ranking[0].name[0]}
                    </div>
                    <div className="w-20 h-24 rounded-t-xl flex flex-col items-center justify-center gap-1 border"
                      style={{ background: isDark ? 'rgba(255,215,0,0.08)' : 'rgba(255,215,0,0.15)', borderColor: 'rgba(255,215,0,0.3)' }}>
                      <span className="text-2xl">🥇</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ranking[0].km}km</span>
                    </div>
                  </div>
                  {/* 3rd */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                      style={{ background: `${ranking[2].color}20`, borderColor: `${ranking[2].color}55`, color: ranking[2].color }}>
                      {ranking[2].icon || ranking[2].name[0]}
                    </div>
                    <div className="w-20 h-12 rounded-t-xl flex flex-col items-center justify-center gap-1 border"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      <span className="text-2xl">🥉</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ranking[2].km}km</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full list */}
              <div className="flex flex-col gap-2">
                {ranking.map((m, i) => {
                  const isMe = m.id === currentUserId;
                  return (
                    <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3 border"
                      style={{
                        background: isMe ? 'rgba(255,59,139,0.08)' : 'rgba(255,255,255,0.8)',
                        borderColor: isMe ? 'rgba(255,59,139,0.3)' : 'var(--border)',
                      }}>
                      <span className="text-xl w-7 text-center">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>}
                      </span>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl border"
                        style={{
                          background: isMe ? 'rgba(247, 245, 246, 0.64)' : '#FFFFFF',
                          borderColor: isMe ? 'rgba(255,59,139,0.3)' : 'rgba(0,0,0,0.15)',
                        }}>
                        {m.icon || m.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: isMe ? '#FF3B8B' : 'var(--text-primary)' }}>
                          {m.name}{isMe ? '（あなた）' : ''}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.runs}回</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: isMe ? '#FF3B8B' : 'var(--text-primary)' }}>{m.km}km</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Feed tab */}
      {tab === 'feed' && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
          ) : feed.length === 0 ? (
            <div className="rounded-2xl p-6 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>まだ記録がありません</p>
            </div>
          ) : (
            feed.map((item, i) => {
              const isMe = item.userId === currentUserId;
              return (
                <div key={i} className="rounded-xl p-4 border"
                  style={{
                    background: isMe ? 'rgba(255,59,139,0.05)' : 'var(--bg-card)',
                    borderColor: isMe ? 'rgba(255,59,139,0.2)' : 'var(--border)',
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold border"
                      style={{
                        background: isMe ? 'rgba(255,59,139,0.15)' : `${item.color}20`,
                        borderColor: isMe ? 'rgba(255,59,139,0.4)' : `${item.color}55`,
                        color: isMe ? '#FF3B8B' : item.color,
                      }}>
                      {item.icon || item.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: isMe ? '#FF3B8B' : 'var(--text-primary)' }}>
                        {item.name}{isMe ? '（あなた）' : ''}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getTimeAgo(item.createdAt)}</p>
                    </div>
                    <span className="text-2xl">🏃</span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.distance}km を走りました！</p>
                  {item.note && <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{item.note}</p>}
                  <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="text-xs transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      👏 応援する
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}