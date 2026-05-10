'use client';

import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ProgressBar from './components/ProgressBar';
import { supabase } from './lib/supabase';
import { getWeather, getUserLocation, WeatherData } from './lib/weather';
import { useTheme } from './components/ThemeContext';

const MiniTown = ({ isDark, km }: { isDark: boolean; km: number }) => (
  <svg viewBox="0 0 340 80" style={{ width: '100%', height: 80 }}>
    <defs>
      <linearGradient id="minisky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#05050F' : '#87CEEB'}/>
        <stop offset="100%" stopColor={isDark ? '#0D0D20' : '#C9E8F5'}/>
      </linearGradient>
    </defs>
    <rect width="340" height="80" fill="url(#minisky)"/>
    {isDark ? (
      <>
        <circle cx="310" cy="12" r="7" fill="#2A2A40"/>
        <circle cx="306" cy="10" r="7" fill="#05050A"/>
      </>
    ) : (
      <circle cx="310" cy="12" r="9" fill="#FFD700"/>
    )}
    {!isDark && (
      <>
        <ellipse cx="50" cy="14" rx="16" ry="8" fill="white" opacity="0.9"/>
        <ellipse cx="38" cy="17" rx="10" ry="6" fill="white" opacity="0.9"/>
        <ellipse cx="62" cy="17" rx="10" ry="6" fill="white" opacity="0.9"/>
        <ellipse cx="160" cy="10" rx="12" ry="6" fill="white" opacity="0.8"/>
        <ellipse cx="150" cy="13" rx="8" ry="5" fill="white" opacity="0.8"/>
        <ellipse cx="170" cy="13" rx="8" ry="5" fill="white" opacity="0.8"/>
      </>
    )}
    {isDark && [[15,8],[40,14],[80,5],[130,10],[180,4],[220,9],[270,6]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={0.8} fill="#EEEEF8" opacity="0.7"/>
    ))}
    <rect x="0" y="64" width="340" height="16" fill={isDark ? '#0D1A0D' : '#5D9E3F'}/>
    <rect x="0" y="64" width="340" height="4" fill={isDark ? '#181828' : '#7BC142'}/>
    {!isDark && (
      <>
        <rect x="0" y="68" width="340" height="5" fill="#8B8B8B" opacity="0.3"/>
        {[0,40,80,120,160,200,240,280,320].map(x => (
          <rect key={x} x={x} y={70} width={18} height={1} fill="white" opacity="0.4"/>
        ))}
      </>
    )}
    {isDark && [0,35,70,105,140,175,210,245,280,315].map(x => (
      <rect key={x} x={x} y={67} width={22} height={2} fill="#2A2A48" opacity="0.7"/>
    ))}
    <rect x="4" y="46" width="20" height="20" fill={isDark ? '#1E1E3A' : '#F0F0F0'} rx="1"/>
    <rect x="4" y="41" width="20" height="7" fill={isDark ? '#16162E' : '#E0E0E0'} rx="1"/>
    <rect x="7" y="49" width="5" height="5" fill={isDark ? '#FFB347' : '#87CEEB'} opacity="0.8"/>
    <rect x="15" y="49" width="5" height="5" fill={isDark ? '#C5FF47' : '#87CEEB'} opacity="0.8"/>
    <rect x="10" y="57" width="6" height="7" fill="#8D6E63" rx="1"/>
    <rect x="28" y="28" width="22" height="38" fill={isDark ? '#252542' : '#C0392B'} rx="1"/>
    <rect x="28" y="24" width="22" height="6" fill={isDark ? '#1E1E38' : '#A93226'} rx="1"/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`b2-${col}-${row}`} x={31+col*10} y={31+row*10} width={7} height={7}
        fill={isDark ? '#FFB347' : '#FFE0B2'} opacity={0.8}/>
    )))}
    <rect x="54" y="18" width="26" height="48" fill={isDark ? '#28284A' : '#9E9E9E'} rx="1"/>
    <rect x="54" y="13" width="26" height="7" fill={isDark ? '#222244' : '#757575'} rx="1"/>
    <rect x="65" y="8" width="2" height="7" fill={isDark ? '#3A3A58' : '#616161'}/>
    {[0,1].map(col => [0,1,2,3].map(row => (
      <rect key={`b3-${col}-${row}`} x={57+col*12} y={20+row*10} width={8} height={7}
        fill={isDark ? '#C5FF47' : '#B3E5FC'} opacity={isDark ? 0.7 : 0.8}/>
    )))}
    <rect x="84" y="10" width="30" height="56" fill={isDark ? '#1C1C38' : '#42A5F5'} rx="1"/>
    <rect x="84" y="5" width="30" height="7" fill={isDark ? '#18183A' : '#1E88E5'} rx="1"/>
    {[0,1].map(col => [0,1,2,3,4].map(row => (
      <rect key={`b4-${col}-${row}`} x={87+col*14} y={13+row*10} width={10} height={7}
        fill={isDark ? '#47B8FF' : 'white'} opacity={isDark ? 0.6 : 0.3}/>
    )))}
    <rect x="118" y="22" width="22" height="44" fill={isDark ? '#202040' : '#FF8F00'} rx="1"/>
    <rect x="118" y="17" width="22" height="7" fill={isDark ? '#1A1A38' : '#E65100'} rx="1"/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`b5-${col}-${row}`} x={121+col*11} y={25+row*10} width={7} height={7}
        fill={isDark ? '#FFB347' : '#FFF9C4'} opacity={0.8}/>
    )))}
    <rect x="144" y="14" width="24" height="52" fill={isDark ? '#222240' : '#26C6DA'} rx="1"/>
    <rect x="144" y="9" width="24" height="7" fill={isDark ? '#1C1C3A' : '#00ACC1'} rx="1"/>
    {[0,1].map(col => [0,1,2,3].map(row => (
      <rect key={`b6-${col}-${row}`} x={147+col*12} y={17+row*10} width={9} height={7}
        fill={isDark ? '#C5FF47' : 'white'} opacity={isDark ? 0.5 : 0.3}/>
    )))}
    <rect x="174" y="55" width="4" height="10" fill="#5D4037"/>
    <circle cx="176" cy="50" r="8" fill={isDark ? '#1A4020' : '#2E7D32'}/>
    <circle cx="176" cy="50" r="6" fill={isDark ? '#1E4828' : '#388E3C'}/>
    <rect x="188" y="56" width="4" height="8" fill="#5D4037"/>
    <circle cx="190" cy="52" r="7" fill={isDark ? '#183818' : '#33691E'}/>
    {km >= 50 && (<><rect x="205" y="55" width="4" height="10" fill="#5D4037"/><circle cx="207" cy="50" r="7" fill={isDark ? '#1A4020' : '#2E7D32'}/></>)}
    {km >= 100 && (<rect x="215" y="30" width="16" height="36" fill={isDark ? '#1A1A30' : '#EF9A9A'} rx="1"/>)}
    {km >= 150 && (<rect x="235" y="22" width="20" height="44" fill={isDark ? '#1E1E3A' : '#80CBC4'} rx="1"/>)}
    {km >= 200 && (<rect x="259" y="28" width="18" height="38" fill={isDark ? '#181830' : '#FFCC02'} rx="1"/>)}
    {km >= 250 && (<rect x="281" y="18" width="22" height="48" fill={isDark ? '#202040' : '#CE93D8'} rx="1"/>)}
    {km >= 300 && (<ellipse cx="320" cy="58" rx="18" ry="10" fill={isDark ? '#1A2A1A' : '#A5D6A7'} stroke={isDark ? '#C5FF47' : '#4CAF50'} strokeWidth="1"/>)}
  </svg>
);

const BUILDINGS = [
  { name: '木',         unlockedAt: 50,  icon: '🌳' },
  { name: '公園',       unlockedAt: 100, icon: '🌳' },
  { name: '橋',         unlockedAt: 150, icon: '🌉' },
  { name: 'カフェ',     unlockedAt: 200, icon: '☕' },
  { name: '川・森',     unlockedAt: 250, icon: '🌊' },
  { name: 'スタジアム', unlockedAt: 300, icon: '🏟️' },
  { name: '図書館',     unlockedAt: 350, icon: '📚' },
  { name: '温泉',       unlockedAt: 400, icon: '♨️' },
  { name: '城',         unlockedAt: 500, icon: '🏯' },
  { name: '花火',       unlockedAt: 600, icon: '🎆' },
  { name: '城アップグレード', unlockedAt: 750, icon: '🚩' },
];

const getTrainingIcon = (type: string) => {
  if (type === 'ロング走') return '🏃';
  if (type === 'テンポ走') return '⚡';
  if (type === '筋トレ') return '💪';
  if (type === 'レスト') return '😴';
  return '🏃';
};

export default function Home() {
  const { isDark } = useTheme();
  const [weeklyKm, setWeeklyKm] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState<number | null>(null);
  const [totalKm, setTotalKm] = useState(0);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [race, setRace] = useState<any>(null);
  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [friendActivity, setFriendActivity] = useState<any[]>([]);

  const daysLeft = race
    ? Math.ceil((new Date(race.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (hours < 1) return 'たった今';
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return new Date(dateStr).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth()+1).padStart(2,'0')}-${String(monday.getDate()).padStart(2,'0')}`;

      const { data: weekRuns } = await supabase
        .from('runs').select('distance').eq('user_id', user.id).gte('date', mondayStr);
      if (weekRuns) {
        const total = weekRuns.reduce((sum, r) => sum + (r.distance || 0), 0);
        setWeeklyKm(Math.round(total * 10) / 10);
      }

      const { data: weekPlan } = await supabase
        .from('plans').select('target_km').eq('user_id', user.id)
        .lte('week_start', mondayStr).order('week_start', { ascending: false }).limit(1).maybeSingle();
      if (weekPlan) setWeeklyGoal(weekPlan.target_km);

      const { data: allRuns } = await supabase
        .from('runs').select('distance, date, note').eq('user_id', user.id).order('date', { ascending: false });
      if (allRuns) {
        const total = allRuns.reduce((sum, r) => sum + (r.distance || 0), 0);
        setTotalKm(Math.round(total * 10) / 10);
        setRecentRuns(allRuns.slice(0, 3));
      }

      const { data: raceData } = await supabase
        .from('races').select('*').eq('user_id', user.id).order('date', { ascending: true }).limit(1).maybeSingle();
      if (raceData) setRace(raceData);

      const { data: todayPlanData } = await supabase
        .from('daily_plans').select('*').eq('user_id', user.id).eq('date', todayStr).maybeSingle();
      if (todayPlanData) setTodayPlan(todayPlanData);

      // 友人のアクティビティ取得
      const { data: friendships } = await supabase
        .from('friendships')
        .select('requester_id, receiver_id')
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const friendIds = friendships?.map(f =>
        f.requester_id === user.id ? f.receiver_id : f.requester_id
      ) || [];

      if (friendIds.length > 0) {
        const { data: friendRuns } = await supabase
          .from('runs')
          .select('id, user_id, distance, date, note, created_at')
          .in('user_id', friendIds)
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, icon')
          .in('id', friendIds);

        const profileMap: Record<string, any> = {};
        profiles?.forEach(p => { profileMap[p.id] = p; });

        const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];
        const activityData = friendRuns?.map((r, i) => ({
          id: r.id,
          userId: r.user_id,
          name: profileMap[r.user_id]?.name || 'ランナー',
          icon: profileMap[r.user_id]?.icon || '👟',
          distance: r.distance,
          date: r.date,
          note: r.note,
          createdAt: r.created_at,
          color: colors[friendIds.indexOf(r.user_id) % colors.length],
        })) || [];

        setFriendActivity(activityData);
      }

      const location = await getUserLocation();
      if (location) {
        const weatherData = await getWeather(location.lat, location.lon);
        if (weatherData) setWeather(weatherData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="px-5 pt-12 pb-5 border-b" style={{ borderColor: 'var(--border)', background: isDark ? 'linear-gradient(to bottom, rgba(197,255,71,0.055), transparent)' : 'linear-gradient(to bottom, rgba(255,59,139,0.05), transparent)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            🏆 {race ? race.name : '大会を設定してください'}
          </span>
              <a href="/profile" className="text-xs px-3 py-1.5 rounded-full font-semibold border"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--border-accent)' }}>
              👤 マイページ
              </a>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-7xl font-bold leading-none tracking-tight" style={{ color: 'var(--accent)' }}>
            {daysLeft !== null ? daysLeft : '--'}
          </span>
          <span className="text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>日</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {race
            ? `${new Date(race.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })} · 目標 ${race.goal_time}`
            : 'AIコーチに話しかけて大会を設定しましょう'}
        </p>
      </div>

      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>今日のトレーニング</p>
        <div className="rounded-2xl p-4 flex items-center gap-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-accent)' }}>
            {todayPlan ? getTrainingIcon(todayPlan.type) : '⚡'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[15px] mb-1" style={{ color: todayPlan ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {todayPlan ? `${todayPlan.type}${todayPlan.km ? ` — ${todayPlan.km} km` : ''}` : '今日の計画はありません'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {todayPlan ? (todayPlan.note || '') : 'AIコーチで日次計画を作りましょう'}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl">{weather ? weather.emoji : '🌡️'}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{weather ? `${weather.temp}°C` : '--°C'}</div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>今週の進捗</p>
        {loading ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
        ) : weeklyGoal === null ? (
          <div className="rounded-2xl p-4 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>今週の計画がありません</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>AIコーチに話しかけて計画を作りましょう</p>
          </div>
        ) : (
          <ProgressBar
            value={weeklyKm}
            max={weeklyGoal}
            unit="km"
            label="達成率"
            showLv={true}
            milestones={[
              { value: Math.round(weeklyGoal * 0.25), icon: '⭐' },
              { value: Math.round(weeklyGoal * 0.6), icon: '🏃' },
              { value: weeklyGoal, icon: '🏆' },
            ]}
          />
        )}
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>マイタウン</p>
          <a href="/town" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>全景を見る →</a>
        </div>
        <div className="rounded-2xl overflow-hidden border" style={{ background: isDark ? 'rgba(13,13,32,0.9)' : 'rgba(240,239,248,0.9)', borderColor: 'var(--border)' }}>
          <MiniTown isDark={isDark} km={totalKm} />
          <div className="px-4 py-2.5 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>累計 <span className="font-bold" style={{ color: 'var(--accent)' }}>{totalKm} km</span></span>
            {(() => {
              const next = BUILDINGS.find(b => b.unlockedAt > totalKm);
              return next ? (
                <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--accent-3-bg)', color: 'var(--accent-3)' }}>
                  {next.icon} {next.name}まで {Math.max(0, next.unlockedAt - totalKm)}km
                </span>
              ) : null;
            })()}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>最近の記録</p>
        {loading ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
        ) : recentRuns.length === 0 ? (
          <div className="rounded-2xl p-6 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>まだ記録がありません</p>
            <a href="/record" className="text-xs font-semibold mt-2 inline-block" style={{ color: 'var(--accent)' }}>最初の記録を追加 →</a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentRuns.map((run, i) => (
              <div key={i} className="rounded-2xl p-3 flex items-center gap-3 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-accent)' }}>
                  🏃
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{run.distance} km</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{run.note || 'メモなし'}</p>
                </div>
                <div className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{run.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 友人のアクティビティ */}
      {friendActivity.length > 0 && (
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>グループの活動</p>
            <a href="/social" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>もっと見る →</a>
          </div>
          <div className="flex flex-col gap-2">
            {friendActivity.map((item) => (
              <div key={item.id} className="rounded-xl px-4 py-3 flex items-center gap-3 border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg border flex-shrink-0"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}40` }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: item.color }}>{item.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {item.distance}km を走りました！{item.note ? ` · ${item.note}` : ''}
                  </p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {getTimeAgo(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />
      <BottomNav />
    </div>
  );
}