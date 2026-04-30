'use client';

import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ProgressBar from './components/ProgressBar';
import { supabase } from './lib/supabase';
import { getWeather, getUserLocation, WeatherData } from './lib/weather';

const MiniTown = () => (
  <svg viewBox="0 0 340 80" style={{ width: '100%', height: 80 }}>
    <defs>
      <linearGradient id="minisky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#05050F"/>
        <stop offset="100%" stopColor="#0D0D20"/>
      </linearGradient>
    </defs>
    <rect width="340" height="80" fill="url(#minisky)"/>
    <rect x="0" y="66" width="340" height="14" fill="#0D1A0D"/>
    <rect x="0" y="66" width="340" height="4" fill="#181828"/>
    <rect x="8" y="48" width="18" height="20" fill="#1E1E3A" rx="1"/>
    <rect x="12" y="52" width="4" height="4" fill="#C5FF47" opacity="0.6"/>
    <rect x="18" y="52" width="4" height="4" fill="#47B8FF" opacity="0.4"/>
    <rect x="32" y="36" width="24" height="32" fill="#252540" rx="1"/>
    <rect x="36" y="41" width="5" height="5" fill="#C5FF47" opacity="0.8"/>
    <rect x="44" y="41" width="5" height="5" fill="#47B8FF" opacity="0.5"/>
    <circle cx="75" cy="60" r="6" fill="#1A4020"/>
    <circle cx="86" cy="61" r="5" fill="#183818"/>
    <rect x="98" y="44" width="20" height="24" fill="#1E1E38" rx="1"/>
    <rect x="102" y="49" width="4" height="4" fill="#C5FF47" opacity="0.9"/>
    <rect x="124" y="28" width="28" height="40" fill="#282845" rx="1"/>
    <rect x="128" y="33" width="5" height="5" fill="#C5FF47" opacity="0.9"/>
    <rect x="137" y="33" width="5" height="5" fill="#47B8FF" opacity="0.7"/>
    <rect x="188" y="36" width="22" height="32" fill="#222240" rx="1"/>
    <rect x="192" y="41" width="5" height="5" fill="#C5FF47" opacity="0.8"/>
    <rect x="220" y="56" width="50" height="10" fill="#0A1A2A" rx="2"/>
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

      // 今週の開始日（月曜日）
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth()+1).padStart(2,'0')}-${String(monday.getDate()).padStart(2,'0')}`;

      // 今週の記録
      const { data: weekRuns } = await supabase
        .from('runs')
        .select('distance')
        .eq('user_id', user.id)
        .gte('date', mondayStr);

      if (weekRuns) {
        const total = weekRuns.reduce((sum, r) => sum + (r.distance || 0), 0);
        setWeeklyKm(Math.round(total * 10) / 10);
      }

      // 累計記録
      const { data: allRuns } = await supabase
        .from('runs')
        .select('distance, date, note')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (allRuns) {
        const total = allRuns.reduce((sum, r) => sum + (r.distance || 0), 0);
        setTotalKm(Math.round(total * 10) / 10);
        setRecentRuns(allRuns.slice(0, 3));
      }

      // 大会データ取得
      const { data: raceData } = await supabase
        .from('races')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (raceData) setRace(raceData);

      // 今日の日次計画を取得
      const { data: todayPlanData } = await supabase
        .from('daily_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayStr)
        .maybeSingle();

      if (todayPlanData) setTodayPlan(todayPlanData);

      // 天気取得
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
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">
      <div className="px-5 pt-12 pb-5 border-b border-white/10 bg-gradient-to-b from-[rgba(197,255,71,0.055)] to-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[rgba(197,255,71,0.12)] text-[#C5FF47]">
            🏆 {race ? race.name : '大会を設定してください'}
          </span>
          <span className="text-xs text-[#44445A]">{race ? race.distance : ''}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-7xl font-bold text-[#C5FF47] leading-none tracking-tight">
            {daysLeft !== null ? daysLeft : '--'}
          </span>
          <span className="text-xl text-[#7777A0] font-medium">日</span>
        </div>
        <p className="text-sm text-[#7777A0]">
          {race
            ? `${new Date(race.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })} · 目標 ${race.goal_time}`
            : 'AIコーチに話しかけて大会を設定しましょう'}
        </p>
      </div>

      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">今日のトレーニング</p>
        {todayPlan ? (
          <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(197,255,71,0.1)] border border-[rgba(197,255,71,0.2)] flex items-center justify-center text-2xl flex-shrink-0">
              {getTrainingIcon(todayPlan.type)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[15px] mb-1">
                {todayPlan.type}{todayPlan.km ? ` — ${todayPlan.km} km` : ''}
              </p>
              <p className="text-xs text-[#7777A0]">{todayPlan.note || ''}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl">{weather ? weather.emoji : '🌡️'}</div>
              <div className="text-xs text-[#7777A0]">{weather ? `${weather.temp}°C` : '--°C'}</div>
            </div>
          </div>
        ) : (
          <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(197,255,71,0.1)] border border-[rgba(197,255,71,0.2)] flex items-center justify-center text-2xl flex-shrink-0">⚡</div>
            <div className="flex-1">
              <p className="font-semibold text-[15px] mb-1 text-[#7777A0]">今日の計画はありません</p>
              <p className="text-xs text-[#44445A]">AIコーチで日次計画を作りましょう</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl">{weather ? weather.emoji : '🌡️'}</div>
              <div className="text-xs text-[#7777A0]">{weather ? `${weather.temp}°C` : '--°C'}</div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">今週の進捗</p>
        <ProgressBar
          value={weeklyKm}
          max={WEEKLY_GOAL}
          unit="km"
          label="達成率"
          showLv={true}
          milestones={[{ value: 10, icon: '⭐' }, { value: 25, icon: '🏃' }, { value: 42, icon: '🏆' }]}
        />
        {loading && <p className="text-xs text-[#44445A] text-center mt-2">読み込み中...</p>}
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A]">マイタウン</p>
          <a href="/town" className="text-xs text-[#C5FF47] font-semibold">全景を見る →</a>
        </div>
        <div className="bg-[rgba(13,13,32,0.9)] border border-white/10 rounded-2xl overflow-hidden">
          <MiniTown />
          <div className="px-4 py-2.5 flex items-center justify-between border-t border-white/10">
            <span className="text-xs text-[#7777A0]">累計 <span className="text-[#C5FF47] font-bold">{totalKm} km</span></span>
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,133,71,0.15)] text-[#FF8547] font-semibold">🏟️ スタジアムまで {Math.max(0, 300 - totalKm)}km</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">最近の記録</p>
        {loading ? (
          <p className="text-xs text-[#44445A] text-center py-4">読み込み中...</p>
        ) : recentRuns.length === 0 ? (
          <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-sm text-[#7777A0]">まだ記録がありません</p>
            <a href="/record" className="text-xs text-[#C5FF47] font-semibold mt-2 inline-block">最初の記録を追加 →</a>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentRuns.map((run, i) => (
              <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(197,255,71,0.1)] border border-[rgba(197,255,71,0.2)] flex items-center justify-center text-lg flex-shrink-0">
                  🏃
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#C5FF47]">{run.distance} km</p>
                  <p className="text-xs text-[#7777A0]">{run.note || 'メモなし'}</p>
                </div>
                <div className="text-[10px] text-[#44445A] flex-shrink-0">{run.date}</div>
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