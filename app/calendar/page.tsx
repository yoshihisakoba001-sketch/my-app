'use client';

import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../lib/supabase';
import { getWeatherForecast, getUserLocation, DailyWeather } from '../lib/weather';
import { useTheme } from '../components/ThemeContext';

export default function CalendarPage() {
  const { isDark } = useTheme();
  const [runs, setRuns] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [dailyPlans, setDailyPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<DailyWeather[]>([]);
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const today = new Date();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const monthStartStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const monthEndStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const { data: runsData } = await supabase.from('runs').select('*').eq('user_id', user.id).gte('date', monthStartStr).lte('date', monthEndStr);
      if (runsData) setRuns(runsData);

      const { data: planData } = await supabase.from('plans').select('*').eq('user_id', user.id).gte('week_start', monthStartStr).lte('week_start', monthEndStr).order('week_start', { ascending: true });
      if (planData) setPlans(planData); else setPlans([]);

      const { data: dailyData } = await supabase.from('daily_plans').select('*').eq('user_id', user.id).gte('date', monthStartStr).lte('date', monthEndStr).order('date', { ascending: true });
      if (dailyData) setDailyPlans(dailyData); else setDailyPlans([]);

      if (isCurrentMonth) {
        const location = await getUserLocation();
        if (location) {
          const forecastData = await getWeatherForecast(location.lat, location.lon);
          setForecast(forecastData);
        }
      }

      setLoading(false);
    };
    fetchData();
  }, [viewDate]);

  const doneKm = runs.reduce((sum, r) => sum + (r.distance || 0), 0);
  const monthlyTargetKm = plans.reduce((sum, p) => sum + (p.target_km || 0), 0) || 42;
  const pct = monthlyTargetKm > 0 ? Math.round((doneKm / monthlyTargetKm) * 100) : 0;

  const runMap: Record<number, any> = {};
  runs.forEach(r => { const day = new Date(r.date).getDate(); runMap[day] = r; });

  const planMap: Record<number, any> = {};
  plans.forEach(p => { const day = new Date(p.week_start).getDate(); planMap[day] = p; });

  const dailyPlanMap: Record<number, any> = {};
  dailyPlans.forEach(p => { const day = new Date(p.date).getDate(); dailyPlanMap[day] = p; });

  const forecastMap: Record<string, DailyWeather> = {};
  forecast.forEach(f => { forecastMap[f.date] = f; });

  const firstDayOffset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = monthEnd.getDate();
  const monthName = viewDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  const hasDailyPlans = dailyPlans.length > 0;

  const calDayBg = (isToday: boolean, run: any, dailyPlan: any, plan: any) => {
    if (isToday) return isDark ? 'rgba(71,184,255,0.1)' : 'rgba(59,130,246,0.1)';
    if (run) return isDark ? 'rgba(197,255,71,0.05)' : 'rgba(255,59,139,0.05)';
    if (dailyPlan && dailyPlan.type !== 'レスト') return isDark ? 'rgba(197,255,71,0.03)' : 'rgba(255,59,139,0.03)';
    if (plan) return isDark ? 'rgba(255,133,71,0.03)' : 'rgba(249,115,22,0.03)';
    return 'transparent';
  };

  const calDayBorder = (isToday: boolean, run: any, dailyPlan: any, plan: any) => {
    if (isToday) return isDark ? '#47B8FF' : '#3B82F6';
    if (run) return isDark ? 'rgba(197,255,71,0.2)' : 'rgba(255,59,139,0.2)';
    if (dailyPlan && dailyPlan.type !== 'レスト') return isDark ? 'rgba(197,255,71,0.15)' : 'rgba(255,59,139,0.15)';
    if (plan) return isDark ? 'rgba(255,133,71,0.2)' : 'rgba(249,115,22,0.2)';
    return 'transparent';
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      <div className="px-5 pt-12 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold tracking-tight">カレンダー</h1>
        <div className="flex items-center justify-between mt-2">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>←</button>
          <p className="text-sm font-semibold">{monthName}</p>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>→</button>
        </div>
      </div>

      <div className="px-5 pt-4 grid grid-cols-3 gap-3">
        {[
          { label: '月間目標', value: `${monthlyTargetKm}km` },
          { label: '達成済み', value: `${Math.round(doneKm * 10) / 10}km` },
          { label: '達成率',   value: `${pct}%` },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-3 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-[10px] mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="px-5 pt-3">
        <ProgressBar
          value={Math.round(doneKm * 10) / 10}
          max={monthlyTargetKm}
          unit="km"
          label="月間達成率"
          showLv={true}
          milestones={[
            { value: Math.round(monthlyTargetKm * 0.25), icon: '⭐' },
            { value: Math.round(monthlyTargetKm * 0.5),  icon: '🏃' },
            { value: Math.round(monthlyTargetKm * 0.75), icon: '🌟' },
            { value: monthlyTargetKm, icon: '🏆' },
          ]}
        />
      </div>

      <div className="px-5 pt-4">
        <div className="grid grid-cols-7 mb-2">
          {['月','火','水','木','金','土','日'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(firstDayOffset)].map((_, i) => <div key={`empty-${i}`} />)}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const run = runMap[day];
            const plan = planMap[day];
            const dailyPlan = dailyPlanMap[day];
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const weatherDay = forecastMap[dateStr];
            const isToday = isCurrentMonth && day === today.getDate();
            const isFuture = day > today.getDate() || !isCurrentMonth;

            return (
              <div key={day} className="rounded-xl p-1 flex flex-col items-center gap-0.5 min-h-[56px]"
                style={{ background: calDayBg(isToday, run, dailyPlan, plan), border: `1px solid ${calDayBorder(isToday, run, dailyPlan, plan)}` }}>
                <span className="text-[11px] font-semibold" style={{ color: isToday ? (isDark ? '#47B8FF' : '#3B82F6') : run ? 'var(--accent)' : 'var(--text-primary)' }}>{day}</span>
                {run && <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{run.distance}km</span>}
                {run && <span className="text-[10px]" style={{ color: 'var(--accent)' }}>✓</span>}
                {!run && dailyPlan && dailyPlan.type !== 'レスト' && (
                  <span className="text-[8px] text-center leading-tight" style={{ color: 'var(--accent)' }}>{dailyPlan.km}km</span>
                )}
                {!run && dailyPlan && dailyPlan.type === 'レスト' && (
                  <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>rest</span>
                )}
                {!run && !dailyPlan && plan && (
                  <span className="text-[8px]" style={{ color: 'var(--accent-3)' }}>週始</span>
                )}
                {weatherDay && isFuture && (
                  <span className="text-[10px] leading-none">{weatherDay.emoji}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            {hasDailyPlans ? '日次計画' : '週別計画'}
          </p>
          {!hasDailyPlans && (
            <span className="text-[10px]" style={{ color: 'var(--accent-3)' }}>AIコーチで日次計画を作れます</span>
          )}
        </div>

        {loading ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
        ) : hasDailyPlans ? (
          <div className="flex flex-col gap-2">
            {dailyPlans.map((plan, i) => {
              const weatherDay = forecastMap[plan.date];
              return (
                <div key={i} className="rounded-xl p-3 flex items-center gap-3 border"
                  style={{ background: plan.done ? 'var(--accent-bg)' : 'var(--bg-card)', borderColor: plan.done ? 'var(--border-accent)' : 'var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: plan.type === 'レスト' ? 'var(--border)' : 'var(--accent-bg)' }}>
                    {plan.type === 'レスト' ? '😴' : plan.type === 'ロング走' ? '🏃' : plan.type === 'テンポ走' ? '⚡' : '🏃'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{plan.type}{plan.km ? ` ${plan.km}km` : ''}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{plan.date} {plan.note && `· ${plan.note}`}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    {weatherDay && <span className="text-base">{weatherDay.emoji}</span>}
                    {weatherDay && <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{weatherDay.maxTemp}°C</span>}
                    {plan.done && <span className="text-lg" style={{ color: 'var(--accent)' }}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl p-4 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>この月の計画はありません</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>AIコーチに話しかけて計画を作りましょう</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {plans.map((plan, i) => (
              <div key={i} className="rounded-xl p-3 flex items-center gap-3 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--accent-3-bg)', border: '1px solid var(--accent-3)', color: 'var(--accent-3)' }}>
                  W{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent-3)' }}>{plan.phase}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{plan.week_start}〜 · ロング走 {plan.long_run_km}km</p>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{plan.target_km}km</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pt-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>今月の記録</p>
        {loading ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
        ) : runs.length === 0 ? (
          <div className="rounded-2xl p-4 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>この月の記録はまだありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {runs.map((run, i) => (
              <div key={i} className="rounded-xl p-3 flex items-center gap-3 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--accent-bg)' }}>🏃</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{run.distance}km</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{run.note || 'メモなし'}</p>
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{run.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-4"/>
      <BottomNav />
    </div>
  );
}