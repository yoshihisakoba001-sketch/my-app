'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../lib/supabase';

const BUILDINGS = [
  { name: '公園',       unlockedAt: 100, icon: '🌳' },
  { name: '橋',         unlockedAt: 150, icon: '🌉' },
  { name: 'カフェ',     unlockedAt: 200, icon: '☕' },
  { name: '川・森',     unlockedAt: 250, icon: '🌊' },
  { name: 'スタジアム', unlockedAt: 300, icon: '🏟️' },
  { name: '図書館',     unlockedAt: 400, icon: '📚' },
  { name: '温泉',       unlockedAt: 500, icon: '♨️' },
  { name: '城',         unlockedAt: 750, icon: '🏯' },
];

const groupMembers = [
  { name: '田中', km: 312, color: '#FFD700' },
  { name: '鈴木', km: 198, color: '#47B8FF' },
  { name: '山本', km: 156, color: '#FF8547' },
  { name: '佐藤', km: 89,  color: '#B847FF' },
];

const NightTown = ({ km }: { km: number }) => (
  <svg viewBox="0 0 360 160" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="nightsky2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#05050A"/>
        <stop offset="100%" stopColor="#0D0D22"/>
      </linearGradient>
    </defs>
    <rect width="360" height="160" fill="url(#nightsky2)"/>
    {[[15,8],[40,14],[80,5],[130,10],[180,4],[220,9],[270,6],[310,13],[345,7]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={0.9} fill="#EEEEF8" opacity="0.7"/>
    ))}
    <rect x="0" y="130" width="360" height="30" fill="#0D1A0D"/>
    <rect x="0" y="130" width="360" height="8" fill="#181828"/>
    {[0,35,70,105,140,175,210,245,280,315].map(x => (
      <rect key={x} x={x} y={133} width={22} height={3} fill="#2A2A48" opacity="0.7"/>
    ))}
    <rect x="5" y="95" width="25" height="37" fill="#1E1E3A" rx="1"/>
    <rect x="9"  y="100" width="6" height="6" fill="#FFB347" opacity="0.8"/>
    <rect x="18" y="100" width="6" height="6" fill="#C5FF47" opacity="0.6"/>
    <rect x="9"  y="110" width="6" height="6" fill="#C5FF47" opacity="0.5"/>
    <rect x="18" y="110" width="6" height="6" fill="#FFB347" opacity="0.4"/>
    <rect x="9"  y="120" width="6" height="6" fill="#FFB347" opacity="0.7"/>
    <rect x="36" y="55" width="32" height="77" fill="#252542" rx="1"/>
    <rect x="51" y="48" width="2" height="8" fill="#3A3A58"/>
    <circle cx="52" cy="47" r="2" fill="#FF4D4D" opacity="0.8"/>
    {[0,1,2].map(col => [0,1,2,3,4].map(row => (
      <rect key={`b2-${col}-${row}`} x={40+col*10} y={60+row*13} width={7} height={8}
        fill={col===1&&row===2 ? '#FFB347' : col===0&&row===0 ? '#FFB347' : col===2&&row===3 ? '#FFB347' : col===0&&row===4 ? '#FFB347' : '#C5FF47'}
        opacity={col===1&&row===1 ? 0.3 : col===2&&row===2 ? 0.2 : 0.7}/>
    )))}
    {km >= 100 && (
      <>
        <rect x="74" y="118" width="42" height="14" fill="#0F2010"/>
        <circle cx="85"  cy="116" r="9"  fill="#1A4020"/>
        <circle cx="97"  cy="118" r="7"  fill="#183818"/>
        <circle cx="108" cy="116" r="8"  fill="#1E4828"/>
        <circle cx="82"  cy="120" r="5"  fill="#122A14"/>
      </>
    )}
    <rect x="122" y="78" width="28" height="54" fill="#1E1E3A" rx="1"/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`b3-${col}-${row}`} x={126+col*13} y={83+row*14} width={9} height={10}
        fill={col===0&&row===1 ? '#FFB347' : col===1&&row===0 ? '#FFB347' : '#C5FF47'}
        opacity={col===0&&row===2 ? 0.3 : 0.7}/>
    )))}
    <rect x="156" y="38" width="38" height="94" fill="#28284A" rx="1"/>
    <rect x="170" y="30" width="10" height="10" fill="#2E2E50"/>
    <rect x="173" y="27" width="4" height="5"  fill="#3A3A60"/>
    {[0,1].map(col => [0,1,2,3,4,5].map(row => (
      <rect key={`b4-${col}-${row}`} x={161+col*16} y={44+row*13} width={11} height={9}
        fill={col===0&&row===0 ? '#FFB347' : col===1&&row===2 ? '#FFB347' : col===0&&row===4 ? '#FFB347' : col===1&&row===5 ? '#FFB347' : '#C5FF47'}
        opacity={col===0&&row===3 ? 0.25 : col===1&&row===1 ? 0.3 : 0.8}/>
    )))}
    {km >= 150 && (
      <>
        <rect x="202" y="118" width="56" height="14" fill="#0A1828" rx="2"/>
        <path d="M202 121 Q218 114 230 121 Q242 128 258 121" stroke="#1A3A5A" strokeWidth="2" fill="none"/>
        <rect x="214" y="112" width="3" height="10" fill="#1E3850"/>
        <rect x="242" y="112" width="3" height="10" fill="#1E3850"/>
      </>
    )}
    <rect x="206" y="72" width="24" height="58" fill="#1C1C38" rx="1"/>
    {[0,1].map(col => [0,1,2,3].map(row => (
      <rect key={`b5-${col}-${row}`} x={210+col*11} y={77+row*13} width={8} height={9}
        fill={col===0&&row===1 ? '#FFB347' : col===1&&row===3 ? '#FFB347' : '#C5FF47'}
        opacity={col===1&&row===0 ? 0.3 : 0.7}/>
    )))}
    <rect x="236" y="50" width="30" height="82" fill="#202040" rx="1"/>
    <rect x="238" y="52" width="8" height="78" fill="#ffffff" opacity="0.04"/>
    {[0,1].map(col => [0,1,2,3,4,5].map(row => (
      <rect key={`b6-${col}-${row}`} x={240+col*13} y={56+row*12} width={9} height={8}
        fill={col===0&&row===2 ? '#FFB347' : col===1&&row===0 ? '#FFB347' : col===0&&row===5 ? '#FFB347' : '#47B8FF'}
        opacity={col===1&&row===3 ? 0.25 : col===0&&row===1 ? 0.3 : 0.7}/>
    )))}
    {km >= 300 ? (
      <>
        <ellipse cx="318" cy="112" rx="34" ry="20" fill="#1A2A1A" stroke="#C5FF47" strokeWidth="1.2"/>
        <ellipse cx="318" cy="112" rx="22" ry="13" fill="#0A1A0A"/>
        <text x="318" y="116" textAnchor="middle" fontSize="9" fill="#C5FF47" opacity="0.9" fontFamily="sans-serif">STADIUM</text>
      </>
    ) : (
      <>
        <ellipse cx="318" cy="112" rx="32" ry="18" fill="none" stroke="#C5FF47" strokeWidth="1" opacity="0.25" strokeDasharray="4 3"/>
        <text x="318" y="110" textAnchor="middle" fontSize="7" fill="#C5FF47" opacity="0.3" fontFamily="sans-serif">🔒</text>
        <text x="318" y="119" textAnchor="middle" fontSize="6" fill="#C5FF47" opacity="0.25" fontFamily="sans-serif">STADIUM</text>
      </>
    )}
    <circle cx="335" cy="22" r="10" fill="#2A2A40"/>
    <circle cx="330" cy="19" r="10" fill="#05050A"/>
    <circle cx="345" cy="18" r="4"  fill="#3A3A58" opacity="0.4"/>
  </svg>
);

export default function TownPage() {
  const [viewTab, setViewTab] = useState<'my' | 'group'>('my');
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: runs } = await supabase
        .from('runs')
        .select('distance')
        .eq('user_id', user.id);

      if (runs) {
        const total = runs.reduce((sum, r) => sum + (r.distance || 0), 0);
        setTotalKm(Math.round(total * 10) / 10);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const nextUnlock = BUILDINGS.find(b => b.unlockedAt > totalKm);
  const buildings = BUILDINGS.map(b => ({ ...b, unlocked: totalKm >= b.unlockedAt }));

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">マイタウン</h1>
        <p className="text-xs text-[#7777A0] mt-1">走るたびに街が育ちます</p>
      </div>

      {/* Tab switcher */}
      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'my',    label: '🏙️ 自分の街' },
          { id: 'group', label: '👥 グループの街' },
        ].map(t => (
          <button key={t.id} onClick={() => setViewTab(t.id as any)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              viewTab === t.id
                ? 'bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border-[rgba(197,255,71,0.3)]'
                : 'bg-[rgba(26,26,40,0.6)] text-[#7777A0] border-white/10'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* My Town */}
      {viewTab === 'my' && (
        <>
          <div className="mx-5 mt-4 rounded-2xl overflow-hidden border border-white/10 bg-[#0D0D20]">
            <div style={{ height: 200 }}>
              <NightTown km={totalKm}/>
            </div>
            <div className="px-4 py-3 flex items-center justify-between border-t border-white/10">
              <div className="text-sm">
                累計 <span className="text-[#C5FF47] font-bold">{loading ? '...' : totalKm} km</span>
              </div>
              {nextUnlock && (
                <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,133,71,0.15)] text-[#FF8547] font-semibold">
                  {nextUnlock.icon} {nextUnlock.name}まで {Math.max(0, nextUnlock.unlockedAt - totalKm)}km
                </span>
              )}
            </div>
            <div className="px-4 pb-4">
              <ProgressBar
                value={totalKm}
                max={nextUnlock ? nextUnlock.unlockedAt : BUILDINGS[BUILDINGS.length - 1].unlockedAt}
                unit="km"
                label="次のアンロック"
                showLv={true}
                milestones={[
                  { value: 100, icon: '🌳' },
                  { value: 150, icon: '🌉' },
                  { value: 200, icon: '☕' },
                  { value: 250, icon: '🌊' },
                  { value: 300, icon: '🏟️' },
                ]}
              />
            </div>
          </div>

          {/* Buildings list */}
          <div className="px-5 pt-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-3">施設一覧</p>
            <div className="grid grid-cols-2 gap-3">
              {buildings.map((b, i) => (
                <div key={i} className={`rounded-xl p-3 border flex items-center gap-3 ${
                  b.unlocked
                    ? 'bg-[rgba(197,255,71,0.05)] border-[rgba(197,255,71,0.2)]'
                    : 'bg-[rgba(26,26,40,0.4)] border-white/5 opacity-40'
                }`}>
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${b.unlocked ? 'text-[#EEEEF8]' : 'text-[#44445A]'}`}>
                      {b.name}
                    </p>
                    <p className="text-[10px] text-[#7777A0]">
                      {b.unlocked ? '✅ 解放済み' : `🔒 ${b.unlockedAt}kmで解放`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Group Towns */}
      {viewTab === 'group' && (
        <div className="px-5 pt-4 flex flex-col gap-4">
          {groupMembers.map((member, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-[#0D0D20]">
              <div style={{ height: 160 }}>
                <NightTown km={member.km}/>
              </div>
              <div className="px-4 py-3 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border"
                    style={{ background: `${member.color}20`, borderColor: `${member.color}55`, color: member.color }}>
                    {member.name[0]}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: member.color }}>{member.name}</span>
                </div>
                <span className="text-sm font-bold text-[#C5FF47]">{member.km} km</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}