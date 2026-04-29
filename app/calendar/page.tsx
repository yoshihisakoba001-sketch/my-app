import BottomNav from '../components/BottomNav';
import ProgressBar from '../components/ProgressBar';

const calendarData = [
  { date: 1,  plan: 'rest' },
  { date: 2,  plan: 'run',  km: 10, done: true },
  { date: 3,  plan: 'run',  km: 16, done: true },
  { date: 4,  plan: 'rest' },
  { date: 5,  plan: 'run',  km: 8,  done: true },
  { date: 6,  plan: 'run',  km: 12, done: false },
  { date: 7,  plan: 'run',  km: 20, done: false },
  { date: 8,  plan: 'rest' },
  { date: 9,  plan: 'run',  km: 10, done: false },
  { date: 10, plan: 'run',  km: 16, done: false },
  { date: 11, plan: 'rest' },
  { date: 12, plan: 'run',  km: 8,  done: false },
  { date: 13, plan: 'run',  km: 12, done: false },
  { date: 14, plan: 'run',  km: 22, done: false },
];

const weatherMap: Record<number, string> = {
  6: '🌧️', 7: '🌧️', 9: '⛅', 10: '☀️', 11: '☀️', 12: '☀️', 13: '🌤️', 14: '☀️',
};

const upcoming = [
  { date: '4/29（火）', type: 'ロング走', km: 20, weather: '🌧️', alt: '室内筋トレに変更推奨' },
  { date: '4/30（水）', type: 'レスト',   km: null, weather: '🌧️', alt: null },
  { date: '5/1（木）',  type: 'テンポ走', km: 10, weather: '☀️', alt: null },
];

export default function CalendarPage() {
  const plannedKm = 168;
  const doneKm = 28;
  const pct = Math.round((doneKm / plannedKm) * 100);

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">カレンダー</h1>
        <p className="text-xs text-[#7777A0] mt-1">2026年4月</p>
      </div>

      {/* Monthly stats */}
      <div className="px-5 pt-4 grid grid-cols-3 gap-3">
        {[
          { label: '月間目標', value: `${plannedKm}km` },
          { label: '達成済み', value: `${doneKm}km` },
          { label: '達成率',   value: `${pct}%` },
        ].map((stat, i) => (
          <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-[#7777A0] mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-[#C5FF47]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly progress bar */}
      <div className="px-5 pt-3">
        <ProgressBar
          value={doneKm}
          max={plannedKm}
          unit="km"
          label="月間達成率"
          showLv={true}
          streak={12}
          milestones={[
            { value: 42,  icon: '⭐' },
            { value: 84,  icon: '🏃' },
            { value: 126, icon: '🌟' },
            { value: 168, icon: '🏆' },
          ]}
        />
      </div>
      

      {/* Day headers */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-7 mb-2">
          {['月','火','水','木','金','土','日'].map(d => (
            <div key={d} className="text-center text-[10px] text-[#44445A] font-semibold">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {[...Array(2)].map((_, i) => <div key={`empty-${i}`} />)}
          {calendarData.map((day) => {
            const weather = weatherMap[day.date];
            const isToday = day.date === 28;
            return (
              <div key={day.date} className={`rounded-xl p-1 flex flex-col items-center gap-0.5 min-h-[52px] border ${
                isToday ? 'border-[#47B8FF] bg-[rgba(71,184,255,0.1)]' :
                day.done ? 'border-[rgba(197,255,71,0.2)] bg-[rgba(197,255,71,0.05)]' :
                day.plan === 'run' ? 'border-white/10 bg-[rgba(26,26,40,0.6)]' :
                'border-transparent bg-transparent'
              }`}>
                <span className={`text-[11px] font-semibold ${
                  isToday ? 'text-[#47B8FF]' :
                  day.done ? 'text-[#C5FF47]' : 'text-[#EEEEF8]'
                }`}>{day.date}</span>
                {day.plan === 'run' && (
                  <span className="text-[9px] text-[#7777A0]">{day.km}km</span>
                )}
                {weather && <span className="text-[10px]">{weather}</span>}
                {day.done && <span className="text-[#C5FF47] text-[10px]">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's training */}
      <div className="px-5 pt-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">今日のトレーニング</p>
        <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(197,255,71,0.1)] border border-[rgba(197,255,71,0.2)] flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[15px] mb-1">LSD — 18 km</p>
            <p className="text-xs text-[#7777A0]">ゆっくりペース 6:30/km · 約1時間57分</p>
            <div className="mt-2 bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#C5FF47] h-1.5 rounded-full" style={{ width: '0%' }}/>
            </div>
            <p className="text-[10px] text-[#44445A] mt-1">0 / 18 km 完了</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl">☁️</div>
            <div className="text-xs text-[#7777A0]">14°C</div>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="px-5 pt-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-3">今後の予定</p>
        <div className="flex flex-col gap-2">
          {upcoming.map((item, i) => (
            <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="text-2xl">{item.weather}</div>
              <div className="flex-1">
                <p className="text-xs text-[#7777A0]">{item.date}</p>
                <p className="text-sm font-semibold">{item.type}{item.km ? ` ${item.km}km` : ''}</p>
                {item.alt && (
                  <p className="text-xs text-[#FF8547] mt-0.5">⚠️ {item.alt}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4"/>
      <BottomNav />
    </div>
  );
}