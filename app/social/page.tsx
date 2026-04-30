'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';

const medals = ['🥇', '🥈', '🥉'];

export default function SocialPage() {
  const [tab, setTab] = useState<'ranking' | 'feed'>('ranking');
  const [ranking, setRanking] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // 全ユーザーの累計距離を取得
      const { data: runs } = await supabase
        .from('runs')
        .select('user_id, distance');

      // プロフィール取得
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name');

      if (runs && profiles) {
        // user_idごとに距離を集計
        const kmMap: Record<string, number> = {};
        const countMap: Record<string, number> = {};
        runs.forEach(r => {
          kmMap[r.user_id] = (kmMap[r.user_id] || 0) + (r.distance || 0);
          countMap[r.user_id] = (countMap[r.user_id] || 0) + 1;
        });

        const colors = ['#FFD700', '#C5FF47', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A'];
        const rankingData = profiles.map((p, i) => ({
          id: p.id,
          name: p.name || 'ランナー',
          km: Math.round((kmMap[p.id] || 0) * 10) / 10,
          runs: countMap[p.id] || 0,
          color: colors[i % colors.length],
        })).sort((a, b) => b.km - a.km);

        setRanking(rankingData);
      }

      // フィード：最近の記録を全ユーザー分取得
      const { data: recentRuns } = await supabase
        .from('runs')
        .select('user_id, distance, date, note, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: profiles2 } = await supabase
        .from('profiles')
        .select('id, name');

      if (recentRuns && profiles2) {
        const profileMap: Record<string, string> = {};
        profiles2.forEach(p => { profileMap[p.id] = p.name || 'ランナー'; });

        const colors = ['#FFD700', '#C5FF47', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A'];
        const feedData = recentRuns.map((r, i) => ({
          userId: r.user_id,
          name: profileMap[r.user_id] || 'ランナー',
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
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">ソーシャル</h1>
          <p className="text-xs text-[#7777A0] mt-1">ランナーズコミュニティ</p>
        </div>
        <a href="/profile" className="text-xs px-3 py-1.5 rounded-full bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border border-[rgba(197,255,71,0.3)] font-semibold">
          ✏️ ニックネーム
        </a>
      </div>

      {/* Tab switcher */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'ranking', label: '🏆 ランキング' },
          { id: 'feed',    label: '📣 みんなの活動' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              tab === t.id
                ? 'bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border-[rgba(197,255,71,0.3)]'
                : 'bg-[rgba(26,26,40,0.6)] text-[#7777A0] border-white/10'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Ranking tab */}
      {tab === 'ranking' && (
        <div className="px-5 pt-4">
          {loading ? (
            <p className="text-xs text-[#44445A] text-center py-8">読み込み中...</p>
          ) : ranking.length === 0 ? (
            <p className="text-xs text-[#44445A] text-center py-8">まだランキングデータがありません</p>
          ) : (
            <>
              {/* Podium */}
              {ranking.length >= 3 && (
                <div className="flex items-end justify-center gap-4 mb-6 h-36">
                  {/* 2nd */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                      style={{ background: `${ranking[1].color}20`, borderColor: `${ranking[1].color}55`, color: ranking[1].color }}>
                      {ranking[1].name[0]}
                    </div>
                    <div className="w-20 h-16 bg-[rgba(26,26,40,0.8)] border border-white/10 rounded-t-xl flex flex-col items-center justify-center gap-1">
                      <span className="text-xl">🥈</span>
                      <span className="text-xs text-[#7777A0]">{ranking[1].km}km</span>
                    </div>
                  </div>
                  {/* 1st */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">👑</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                      style={{ background: `${ranking[0].color}20`, borderColor: `${ranking[0].color}55`, color: ranking[0].color }}>
                      {ranking[0].name[0]}
                    </div>
                    <div className="w-20 h-24 bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.25)] rounded-t-xl flex flex-col items-center justify-center gap-1">
                      <span className="text-xl">🥇</span>
                      <span className="text-xs text-[#7777A0]">{ranking[0].km}km</span>
                    </div>
                  </div>
                  {/* 3rd */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                      style={{ background: `${ranking[2].color}20`, borderColor: `${ranking[2].color}55`, color: ranking[2].color }}>
                      {ranking[2].name[0]}
                    </div>
                    <div className="w-20 h-12 bg-[rgba(26,26,40,0.8)] border border-white/10 rounded-t-xl flex flex-col items-center justify-center gap-1">
                      <span className="text-xl">🥉</span>
                      <span className="text-xs text-[#7777A0]">{ranking[2].km}km</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full list */}
              <div className="flex flex-col gap-2">
                {ranking.map((m, i) => (
                  <div key={i} className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${
                    m.id === currentUserId
                      ? 'bg-[rgba(197,255,71,0.05)] border-[rgba(197,255,71,0.2)]'
                      : 'bg-[rgba(26,26,40,0.85)] border-white/10'
                  }`}>
                    <span className="text-sm font-bold w-5 text-[#44445A]">
                      {i < 3 ? medals[i] : i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border"
                      style={{ background: `${m.color}20`, borderColor: `${m.color}55`, color: m.color }}>
                      {m.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: m.color }}>
                        {m.name}{m.id === currentUserId ? ' (あなた)' : ''}
                      </p>
                      <p className="text-xs text-[#7777A0]">{m.runs}回</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: m.color }}>{m.km}km</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Feed tab */}
      {tab === 'feed' && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {loading ? (
            <p className="text-xs text-[#44445A] text-center py-8">読み込み中...</p>
          ) : feed.length === 0 ? (
            <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-sm text-[#7777A0]">まだ記録がありません</p>
            </div>
          ) : (
            feed.map((item, i) => (
              <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold border"
                    style={{ background: `${item.color}20`, borderColor: `${item.color}55`, color: item.color }}>
                    {item.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: item.color }}>
                      {item.name}{item.userId === currentUserId ? ' (あなた)' : ''}
                    </p>
                    <p className="text-xs text-[#7777A0]">{getTimeAgo(item.createdAt)}</p>
                  </div>
                  <span className="text-2xl">🏃</span>
                </div>
                <p className="text-sm text-[#EEEEF8] mb-1">{item.distance}km を走りました！</p>
                {item.note && <p className="text-xs text-[#7777A0] mb-3">{item.note}</p>}
                <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                  <button className="text-xs text-[#7777A0] hover:text-[#C5FF47] transition-colors">
                    👏 応援する
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}