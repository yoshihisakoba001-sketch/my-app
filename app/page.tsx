'use client';

import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ProgressBar from './components/ProgressBar';
import { supabase } from './lib/supabase';
import { getWeather, getUserLocation, WeatherData } from './lib/weather';
import { useTheme } from './components/ThemeContext';

const MiniTown = ({ isDark }: { isDark: boolean }) => (
  <svg viewBox="0 0 340 80" style={{ width: '100%', height: 80 }}>
    <defs>
      <linearGradient id="minisky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#05050F' : '#87CEEB'}/>
        <stop offset="100%" stopColor={isDark ? '#0D0D20' : '#B8E4F9'}/>
      </linearGradient>
    </defs>
    <rect width="340" height="80" fill="url(#minisky)"/>
    <rect x="0" y="66" width="340" height="14" fill={isDark ? '#0D1A0D' : '#4CAF50'}/>
    <rect x="0" y="66" width="340" height="4" fill={isDark ? '#181828' : '#81C784'}/>
    <rect x="8" y="48" width="18" height="20" fill={isDark ? '#1E1E3A' : '#ECEFF1'} rx="1"/>
    <rect x="12" y="52" width="4" height="4" fill={isDark ? '#C5FF47' : '#FFF9C4'} opacity="0.8"/>
    <rect x="18" y="52" width="4" height="4" fill={isDark ? '#47B8FF' : '#B3E5FC'} opacity="0.8"/>
    <rect x="32" y="36" width="24" height="32" fill={isDark ? '#252540' : '#F5F5F5'} rx="1"/>
    <rect x="36" y="41" width="5" height="5" fill={isDark ? '#C5FF47' : '#FFF176'} opacity="0.8"/>
    <rect x="44" y="41" width="5" height="5" fill={isDark ? '#47B8FF' : '#81D4FA'} opacity="0.8"/>
    <circle cx="75" cy="60" r="6" fill={isDark ? '#1A4020' : '#66BB6A'}/>
    <circle cx="86" cy="61" r="5" fill={isDark ? '#183818' : '#4CAF50'}/>
    <rect x="98" y="44" width="20" height="24" fill={isDark ? '#1E1E38' : '#E8EAF6'} rx="1"/>
    <rect x="102" y="49" width="4" height="4" fill={isDark ? '#C5FF47' : '#FFF59D'} opacity="0.9"/>
    <rect x="124" y="28" width="28" height="40" fill={isDark ? '#282845' : '#E3F2FD'} rx="1"/>
    <rect x="128" y="33" width="5" height="5" fill={isDark ? '#C5FF47' : '#FFF176'} opacity="0.9"/>
    <rect x="137" y="33" width="5" height="5" fill={isDark ? '#47B8FF' : '#81D4FA'} opacity="0.7"/>
    <rect x="188" y="36" width="22" height="32" fill={isDark ? '#222240' : '#EDE7F6'} rx="1"/>
    <rect x="192" y="41" width="5" height="5" fill={isDark ? '#C5FF47' : '#FFF59D'} opacity="0.8"/>
    <rect x="220" y="56" width="50" height="10" fill={isDark ? '#0A1A2A' : '#B3E5FC'} rx="2"/>
    {!isDark && <circle cx="300" cy="15" r="10" fill="#FFD54F" opacity="0.9"/>}
  </svg>
);

const WEEKLY_GOAL = 42;

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
  const [totalKm, setTotalKm] = useState(0);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [race, setRace] = useState<any>(null);
  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const daysLeft = race
    ? Math.ceil((new Date(race.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();

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
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{race ? race.distance : ''}</span>
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--accent-bg)', border: `1px solid var(--border-accent)` }}>
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
        <ProgressBar
          value={weeklyKm}
          max={WEEKLY_GOAL}
          unit="km"
          label="達成率"
          showLv={true}
          milestones={[{ value: 10, icon: '⭐' }, { value: 25, icon: '🏃' }, { value: 42, icon: '🏆' }]}
        />
        {loading && <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>}
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>マイタウン</p>
          <a href="/town" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>全景を見る →</a>
        </div>
        <div className="rounded-2xl overflow-hidden border" style={{ background: isDark ? 'rgba(13,13,32,0.9)' : 'rgba(240,239,248,0.9)', borderColor: 'var(--border)' }}>
          <MiniTown isDark={isDark} />
          <div className="px-4 py-2.5 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>累計 <span className="font-bold" style={{ color: 'var(--accent)' }}>{totalKm} km</span></span>
            <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--accent-3-bg)', color: 'var(--accent-3)' }}>🏟️ スタジアムまで {Math.max(0, 300 - totalKm)}km</span>
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

      <div className="h-4" />
      <BottomNav />
    </div>
  );
}