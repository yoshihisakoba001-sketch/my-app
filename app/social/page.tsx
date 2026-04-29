'use client';

import { useState } from 'react';
import BottomNav from '../components/BottomNav';

const members = [
  { name: '田中', km: 312, runs: 15, color: '#FFD700' },
  { name: '小林', km: 284, runs: 12, color: '#C5FF47' },
  { name: '鈴木', km: 198, runs: 9,  color: '#47B8FF' },
  { name: '山本', km: 156, runs: 7,  color: '#FF8547' },
  { name: '佐藤', km: 89,  runs: 4,  color: '#B847FF' },
];

const feed = [
  { user: '田中', color: '#FFD700', action: '18kmのLSDランを完走！', time: '2時間前', emoji: '🔥', comments: 1 },
  { user: '鈴木', color: '#47B8FF', action: 'マイタウンでスタジアムをアンロック！', time: '5時間前', emoji: '🏟️', comments: 3 },
  { user: '山本', color: '#FF8547', action: '朝ラン 5km テンポ走', time: '昨日', emoji: '⚡', comments: 0 },
  { user: '佐藤', color: '#B847FF', action: '初めての10km完走！', time: '2日前', emoji: '🎉', comments: 5 },
];

const medals = ['🥇', '🥈', '🥉'];

export default function SocialPage() {
  const [tab, setTab] = useState<'ranking' | 'feed'>('ranking');

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">ソーシャル</h1>
        <p className="text-xs text-[#7777A0] mt-1">グループ：東京マラソン仲間</p>
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
          {/* Podium */}
          <div className="flex items-end justify-center gap-4 mb-6 h-36">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                style={{ background: `${members[1].color}20`, borderColor: `${members[1].color}55`, color: members[1].color }}>
                {members[1].name[0]}
              </div>
              <div className="w-20 h-16 bg-[rgba(26,26,40,0.8)] border border-white/10 rounded-t-xl flex flex-col items-center justify-center gap-1">
                <span className="text-xl">🥈</span>
                <span className="text-xs text-[#7777A0]">{members[1].km}km</span>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">👑</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                style={{ background: `${members[0].color}20`, borderColor: `${members[0].color}55`, color: members[0].color }}>
                {members[0].name[0]}
              </div>
              <div className="w-20 h-24 bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.25)] rounded-t-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-yellow-500/10">
                <span className="text-xl">🥇</span>
                <span className="text-xs text-[#7777A0]">{members[0].km}km</span>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border-2"
                style={{ background: `${members[2].color}20`, borderColor: `${members[2].color}55`, color: members[2].color }}>
                {members[2].name[0]}
              </div>
              <div className="w-20 h-12 bg-[rgba(26,26,40,0.8)] border border-white/10 rounded-t-xl flex flex-col items-center justify-center gap-1">
                <span className="text-xl">🥉</span>
                <span className="text-xs text-[#7777A0]">{members[2].km}km</span>
              </div>
            </div>
          </div>

          {/* Full list */}
          <div className="flex flex-col gap-2">
            {members.map((m, i) => (
              <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-sm font-bold w-5 text-[#44445A]">
                  {i < 3 ? medals[i] : i + 1}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border"
                  style={{ background: `${m.color}20`, borderColor: `${m.color}55`, color: m.color }}>
                  {m.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: m.color }}>{m.name}</p>
                  <p className="text-xs text-[#7777A0]">{m.runs}回</p>
                </div>
                <span className="text-sm font-bold" style={{ color: m.color }}>{m.km}km</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed tab */}
      {tab === 'feed' && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {feed.map((item, i) => (
            <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold border"
                  style={{ background: `${item.color}20`, borderColor: `${item.color}55`, color: item.color }}>
                  {item.user[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: item.color }}>{item.user}</p>
                  <p className="text-xs text-[#7777A0]">{item.time}</p>
                </div>
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <p className="text-sm text-[#EEEEF8] mb-3">{item.action}</p>
              <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                <button className="text-xs text-[#7777A0] hover:text-[#C5FF47] transition-colors">
                  👏 応援する
                </button>
                <button className="text-xs text-[#7777A0] hover:text-[#C5FF47] transition-colors">
                  💬 コメント {item.comments > 0 && `(${item.comments})`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}