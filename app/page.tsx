'use client';

import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ProgressBar from './components/ProgressBar';
import { supabase } from './lib/supabase';
import { getWeather, getUserLocation, WeatherData } from './lib/weather';
import { useTheme } from './components/ThemeContext';

const MiniTown = ({ isDark, km }: { isDark: boolean; km: number }) => {
  // viewBox width shrinks with fewer unlocks → uniform scale up → buildings fill card width
  const vw = km >= 500 ? 340 : km >= 400 ? 322 : km >= 350 ? 300 : km >= 300 ? 278 :
             km >= 250 ? 248 : km >= 200 ? 224 : km >= 150 ? 200 : km >= 100 ? 174 :
             km >= 50  ? 150 : 136;
  const svgH = Math.round(80 * 340 / vw); // proportional height → uniform scale = 340/vw
  const sx = vw - 20; // sun/moon center-x, always top-right

  return (
  <svg viewBox={`0 0 ${vw} 80`} shapeRendering="crispEdges" style={{ width: '100%', height: svgH, display: 'block', imageRendering: 'pixelated' } as React.CSSProperties}>
    <defs>
      <linearGradient id="minisky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#05050F' : '#5BB8F5'}/>
        <stop offset="100%" stopColor={isDark ? '#0D0D20' : '#C2E8FF'}/>
      </linearGradient>
    </defs>
    <rect width={vw} height="80" fill="url(#minisky)"/>

    {/* Moon / Sun — always top-right */}
    {isDark ? (
      <><circle cx={sx+3} cy="10" r="6" fill="#252540"/>
        <circle cx={sx}   cy="8"  r="6" fill="#05050E"/></>
    ) : (
      <><rect x={sx-7} y="4"  width="14" height="14" fill="#FFE040"/>
        <rect x={sx-3} y="2"  width="6"  height="2"  fill="#FFE040"/>
        <rect x={sx-3} y="18" width="6"  height="2"  fill="#FFE040"/>
        <rect x={sx-9} y="8"  width="2"  height="6"  fill="#FFE040"/>
        <rect x={sx+7} y="8"  width="2"  height="6"  fill="#FFE040"/></>
    )}
    {isDark && [[14,5],[42,11],[82,3],[132,7],[182,3],[222,7],[268,4]].map(([x,y],i) => (
      <rect key={i} x={x} y={y} width={1} height={1} fill="#EEEEF8" opacity="0.8"/>
    ))}
    {!isDark && (<>
      <rect x="32" y="10" width="26" height="4" fill="white" opacity="0.9"/>
      <rect x="36" y="7"  width="18" height="6" fill="white" opacity="0.9"/>
      <rect x="155" y="7" width="20" height="4" fill="white" opacity="0.8"/>
      <rect x="159" y="4" width="12" height="6" fill="white" opacity="0.8"/>
    </>)}

    {/* Ground */}
    <rect x="0" y="64" width={vw} height="16" fill={isDark ? '#0D1A0D' : '#4A9E2F'}/>
    <rect x="0" y="64" width={vw} height="3"  fill={isDark ? '#182818' : '#6BBF3E'}/>
    {!isDark && [0,40,80,120,160,200,240,280,320].map(x => (
      <rect key={x} x={x} y={70} width={18} height={1} fill="white" opacity="0.35"/>
    ))}
    {isDark && [0,35,70,105,140,175,210,245,280,315].map(x => (
      <rect key={x} x={x} y={67} width={22} height={2} fill="#2A2A48" opacity="0.6"/>
    ))}

    {/* ── PRE-EXISTING BUILDINGS ── */}
    {/* 1. House x=4 */}
    <rect x="4"  y="48" width="20" height="18" fill={isDark ? '#333366' : '#EDD9A3'}/>
    <rect x="4"  y="42" width="20" height="8"  fill={isDark ? '#222255' : '#CC4444'}/>
    <rect x="7"  y="51" width="5"  height="5"  fill={isDark ? '#FFD060' : '#90C8E8'} opacity="0.85"/>
    <rect x="15" y="51" width="5"  height="5"  fill={isDark ? '#FFB040' : '#90C8E8'} opacity="0.75"/>
    <rect x="10" y="58" width="6"  height="6"  fill={isDark ? '#0D0D20' : '#8B4513'}/>

    {/* 2. Apartment x=26 */}
    <rect x="26" y="30" width="16" height="36" fill={isDark ? '#003366' : '#B0C4DE'}/>
    <rect x="26" y="24" width="16" height="8"  fill={isDark ? '#002255' : '#8898AA'}/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`ma2-${col}-${row}`} x={28+col*7} y={32+row*9} width={4} height={6}
        fill={isDark ? '#FFD060' : '#C8E8FF'} opacity={isDark ? 0.8 : 0.85}/>
    )))}
    <rect x="29" y="58" width="6" height="6" fill={isDark ? '#0D0D22' : '#5D4037'}/>

    {/* 3. Shop x=44 */}
    <rect x="44" y="40" width="16" height="26" fill={isDark ? '#333366' : '#F5C870'}/>
    <rect x="44" y="33" width="16" height="9"  fill={isDark ? '#222255' : '#D4822A'}/>
    <rect x="42" y="46" width="20" height="3"  fill={isDark ? '#1A1A44' : '#DD3333'}/>
    <rect x="46" y="50" width="5"  height="6"  fill={isDark ? '#FFD060' : '#90C8E8'} opacity="0.85"/>
    <rect x="53" y="50" width="5"  height="6"  fill={isDark ? '#88BBFF' : '#90C8E8'} opacity="0.75"/>

    {/* 4. Office tower x=63 */}
    <rect x="63" y="12" width="14" height="54" fill={isDark ? '#003366' : '#7BA7CC'}/>
    <rect x="63" y="6"  width="14" height="8"  fill={isDark ? '#002255' : '#5A88AA'}/>
    <rect x="69" y="2"  width="2"  height="6"  fill={isDark ? '#003366' : '#4A7899'}/>
    {[0,1].map(col => [0,1,2,3,4].map(row => (
      <rect key={`ma4-${col}-${row}`} x={65+col*6} y={14+row*9} width={4} height={6}
        fill={isDark ? '#FFD060' : '#C8E8FF'} opacity={isDark ? 0.75 : 0.8}/>
    )))}

    {/* 5. Red building x=79 */}
    <rect x="79" y="20" width="14" height="46" fill={isDark ? '#333300' : '#C84040'}/>
    <rect x="79" y="14" width="14" height="8"  fill={isDark ? '#222200' : '#A03030'}/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`ma5-${col}-${row}`} x={81+col*6} y={22+row*10} width={4} height={7}
        fill={isDark ? '#FFB347' : '#FFD8B0'} opacity="0.8"/>
    )))}

    {/* 6. Narrow tower x=95 */}
    <rect x="95"  y="6"  width="10" height="60" fill={isDark ? '#003300' : '#9898C8'}/>
    <rect x="94"  y="2"  width="12" height="6"  fill={isDark ? '#002200' : '#7878A8'}/>
    {[0,1].map(col => [0,1,2,3,4,5].map(row => (
      <rect key={`ma6-${col}-${row}`} x={97+col*4} y={8+row*9} width={3} height={6}
        fill={isDark ? '#FFD060' : '#E0E8FF'} opacity={isDark ? 0.75 : 0.75}/>
    )))}

    {/* Pre-existing trees x=106 */}
    <rect x="109" y="56" width="3" height="10" fill={isDark ? '#1A1A0A' : '#7B4F2E'}/>
    <rect x="105" y="45" width="11" height="13" fill={isDark ? '#1A4020' : '#2E8B2E'}/>
    <rect x="107" y="38" width="7"  height="9"  fill={isDark ? '#1E4828' : '#38A038'}/>
    <rect x="118" y="57" width="3" height="9"  fill={isDark ? '#1A1A0A' : '#7B4F2E'}/>
    <rect x="115" y="48" width="9"  height="10" fill={isDark ? '#183818' : '#33691E'}/>

    {/* ── UNLOCKABLE BUILDINGS ── */}

    {/* 🌳 50km */}
    {km >= 50 && (<>
      <rect x="128" y="56" width="3" height="10" fill={isDark ? '#1A0A1A' : '#7B4F2E'}/>
      <rect x="124" y="45" width="11" height="13" fill={isDark ? '#663366' : '#2E8B2E'}/>
      <rect x="126" y="38" width="7"  height="10" fill={isDark ? '#553055' : '#38A038'}/>
      <rect x="128" y="31" width="5"  height="9"  fill={isDark ? '#442844' : '#4CC050'}/>
    </>)}

    {/* 🌳 100km — park */}
    {km >= 100 && (<>
      <rect x="141" y="56" width="3" height="10" fill={isDark ? '#0A1A0A' : '#7B4F2E'}/>
      <rect x="137" y="45" width="11" height="13" fill={isDark ? '#003399' : '#2E8B2E'}/>
      <rect x="139" y="38" width="7"  height="10" fill={isDark ? '#002888' : '#38A038'}/>
      <rect x="151" y="57" width="3" height="9"  fill={isDark ? '#1A0A0A' : '#7B4F2E'}/>
      <rect x="148" y="47" width="11" height="11" fill={isDark ? '#663300' : '#33691E'}/>
      <rect x="139" y="62" width="14" height="2"  fill={isDark ? '#2A2010' : '#9B7B30'}/>
    </>)}

    {/* 🌉 150km — bridge */}
    {km >= 150 && (<>
      <rect x="162" y="60" width="24" height="4"  fill={isDark ? '#333399' : '#999'}/>
      <rect x="162" y="60" width="24" height="1"  fill={isDark ? '#3D3DAA' : '#AAA'}/>
      <rect x="164" y="52" width="4"  height="10" fill={isDark ? '#242275' : '#777'}/>
      <rect x="180" y="52" width="4"  height="10" fill={isDark ? '#242275' : '#777'}/>
      <rect x="162" y="57" width="24" height="4"  fill={isDark ? '#2A2A88' : '#888'}/>
      {[0,1,2,3].map(i => <rect key={i} x={166+i*4} y={54} width={2} height={4} fill={isDark ? '#333399' : '#AAA'}/>)}
      {isDark && [0,2].map(i => <rect key={i} x={167+i*8} y={52} width={2} height={2} fill="#FFDD88" opacity="0.85"/>)}
    </>)}

    {/* ☕ 200km — cafe */}
    {km >= 200 && (<>
      <rect x="190" y="36" width="18" height="30" fill={isDark ? '#663300' : '#FFDDBB'}/>
      <rect x="190" y="28" width="18" height="10" fill={isDark ? '#442200' : '#CC5500'}/>
      <rect x="188" y="43" width="22" height="3"  fill={isDark ? '#331A00' : '#DD6600'}/>
      <rect x="193" y="48" width="5"  height="7"  fill={isDark ? '#FFD060' : '#90C8E8'} opacity="0.88"/>
      <rect x="200" y="48" width="5"  height="7"  fill={isDark ? '#FFB040' : '#90C8E8'} opacity="0.78"/>
      {isDark && <rect x="190" y="28" width="18" height="2" fill="#FF2288" opacity="0.7"/>}
    </>)}

    {/* 🌊 250km — forest */}
    {km >= 250 && (<>
      <rect x="215" y="57" width="3" height="9"  fill={isDark ? '#0A0A1A' : '#7B4F2E'}/>
      <rect x="211" y="46" width="11" height="13" fill={isDark ? '#333399' : '#2A7A2A'}/>
      <rect x="213" y="39" width="7"  height="10" fill={isDark ? '#282888' : '#38903A'}/>
      <rect x="226" y="58" width="3" height="8"  fill={isDark ? '#1A0A1A' : '#7B4F2E'}/>
      <rect x="222" y="48" width="11" height="11" fill={isDark ? '#663366' : '#2A7A2A'}/>
      <rect x="211" y="63" width="22" height="3"  fill={isDark ? '#071620' : '#4499DD'}/>
      <rect x="211" y="63" width="22" height="1"  fill={isDark ? '#0B1E2C' : '#66BBFF'}/>
    </>)}

    {/* 🏟️ 300km — stadium */}
    {km >= 300 && (<>
      <rect x="236" y="36" width="28" height="30" fill={isDark ? '#003399' : '#6A9A6A'}/>
      <rect x="234" y="30" width="32" height="8"  fill={isDark ? '#002266' : '#557755'}/>
      <rect x="234" y="38" width="4"  height="24" fill={isDark ? '#002266' : '#557755'}/>
      <rect x="260" y="38" width="4"  height="24" fill={isDark ? '#002266' : '#557755'}/>
      <rect x="240" y="40" width="20" height="14" fill={isDark ? '#001A4D' : '#5A9A5A'}/>
      {[0,1].map(i => <rect key={i} x={240+i*10} y={28} width={8} height={4} fill={isDark ? '#FF4444' : '#CC4444'} opacity="0.9"/>)}
      {[0,1].map(i => <rect key={i} x={240+i*10} y={62} width={8} height={3} fill={isDark ? '#4466FF' : '#4444CC'} opacity="0.85"/>)}
    </>)}

    {/* 📚 350km — library */}
    {km >= 350 && (<>
      <rect x="270" y="22" width="16" height="44" fill={isDark ? '#663366' : '#C8A8E8'}/>
      <rect x="270" y="16" width="16" height="8"  fill={isDark ? '#442244' : '#A878C8'}/>
      <rect x="270" y="22" width="3"  height="44" fill={isDark ? '#553355' : '#D8B8F8'}/>
      <rect x="283" y="22" width="3"  height="44" fill={isDark ? '#553355' : '#D8B8F8'}/>
      {[0,1].map(row => (
        <rect key={row} x={274} y={28+row*16} width={8} height={11}
          fill={isDark ? '#FFD060' : '#F0E8FF'} opacity={isDark ? 0.85 : 0.85}/>
      ))}
      <rect x="274" y="54" width="10" height="12" fill={isDark ? '#331A33' : '#7868A8'}/>
      {isDark && <rect x="270" y="16" width="16" height="2" fill="#88BBFF" opacity="0.7"/>}
    </>)}

    {/* ♨️ 400km — onsen */}
    {km >= 400 && (<>
      <rect x="290" y="34" width="16" height="32" fill={isDark ? '#663300' : '#FFBB99'}/>
      <rect x="290" y="27" width="16" height="9"  fill={isDark ? '#442200' : '#FF7744'}/>
      <rect x="288" y="41" width="20" height="3"  fill={isDark ? '#331A00' : '#EE6633'}/>
      <rect x="292" y="45" width="12" height="8"  fill={isDark ? '#1A3A66' : '#55BBEE'} opacity="0.8"/>
      {isDark && <rect x="290" y="27" width="16" height="2" fill="#FF4499" opacity="0.7"/>}
      <rect x="293" y="19" width="2" height="7"  fill="white" opacity={isDark ? 0.35 : 0.5}/>
      <rect x="298" y="17" width="2" height="9"  fill="white" opacity={isDark ? 0.28 : 0.45}/>
      <rect x="303" y="20" width="2" height="7"  fill="white" opacity={isDark ? 0.3 : 0.5}/>
    </>)}

    {/* 🏯 500km — castle */}
    {km >= 500 && (<>
      <rect x="310" y="18" width="20" height="48" fill={isDark ? '#333399' : '#D0D0E0'}/>
      <rect x="308" y="12" width="24" height="8"  fill={isDark ? '#222266' : '#B8B8C8'}/>
      {[0,1,2].map(i => <rect key={i} x={309+i*7} y={7} width={5} height={7} fill={isDark ? '#222266' : '#C0C0D0'}/>)}
      <rect x="313" y="2"  width="14" height="8"  fill={isDark ? '#333399' : '#C8C8D8'}/>
      {[0,1].map(i => <rect key={i} x={314+i*6} y={0} width={4} height={4} fill={isDark ? '#222266' : '#B8B8C8'}/>)}
      {[0,1].map(row => (
        <rect key={row} x={312} y={24+row*14} width={16} height={10}
          fill={isDark ? '#FFD060' : '#E8E8F0'} opacity={isDark ? 0.8 : 0.7}/>
      ))}
      <rect x="316" y="50" width="8"  height="16" fill={isDark ? '#1A1A44' : '#B8B8C8'}/>
      <rect x="308" y="28" width="4"  height="38" fill={isDark ? '#282866' : '#C8C8D8'}/>
      <rect x="328" y="28" width="4"  height="38" fill={isDark ? '#282866' : '#C8C8D8'}/>
      {km >= 750 && (<>
        <rect x="318" y="1" width="2" height="9" fill="#CC2222" opacity="0.9"/>
        <rect x="320" y="1" width="5" height="3" fill="#CC2222" opacity="0.9"/>
        <rect x="324" y="1" width="2" height="9" fill="#2222CC" opacity="0.9"/>
        <rect x="326" y="1" width="5" height="3" fill="#2222CC" opacity="0.9"/>
      </>)}
    </>)}

    {/* 🎆 600km — fireworks sparkles (night) */}
    {km >= 600 && isDark && (
      [[-4,-5],[0,-8],[4,-5],[5,0],[4,5],[0,8],[-4,5],[-5,0]].map(([dx,dy],i) => (
        <rect key={i} x={330+dx} y={10+dy} width={2} height={2}
          fill={['#FF4444','#FFD700','#44AAFF','#44FF88','#CC44FF'][i%5]} opacity="0.9"/>
      ))
    )}
  </svg>
  );
};

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