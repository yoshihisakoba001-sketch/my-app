import BottomNav from './components/BottomNav';

export default function Home() {
  const daysLeft = 329;

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">
      
      {/* Hero */}
      <div className="px-5 pt-12 pb-5 border-b border-white/10 bg-gradient-to-b from-[rgba(197,255,71,0.055)] to-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[rgba(197,255,71,0.12)] text-[#C5FF47]">
            🏆 東京マラソン 2027
          </span>
          <span className="text-xs text-[#44445A]">フルマラソン</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-7xl font-bold text-[#C5FF47] leading-none tracking-tight">{daysLeft}</span>
          <span className="text-xl text-[#7777A0] font-medium">日</span>
        </div>
        <p className="text-sm text-[#7777A0]">2027年3月1日（日）· 東京都庁前スタート</p>
      </div>

      {/* 今日のトレーニング */}
      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">今日のトレーニング</p>
        <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(197,255,71,0.1)] border border-[rgba(197,255,71,0.2)] flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[15px] mb-1">LSD — 18 km</p>
            <p className="text-xs text-[#7777A0]">ゆっくりペース 6:30/km · 約1時間57分</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl">☁️</div>
            <div className="text-xs text-[#7777A0]">14°C</div>
          </div>
        </div>
      </div>

      {/* 今週の進捗 */}
      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">今週の進捗</p>
        <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between mb-3">
            <div>
              <span className="text-3xl font-bold tracking-tight">28</span>
              <span className="text-sm text-[#7777A0] ml-1">/ 42 km</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#C5FF47]">67%</span>
              <p className="text-xs text-[#7777A0]">達成率</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-[#C5FF47] h-2 rounded-full shadow-[0_0_8px_rgba(197,255,71,0.6)]" style={{ width: '67%' }} />
          </div>
          <div className="flex justify-between mt-3">
            {['月','火','水','木','金','土','日'].map((d, i) => {
              const states = ['done','done','done','today','plan','rest','plan'];
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    states[i] === 'done' ? 'bg-[#C5FF47]' :
                    states[i] === 'today' ? 'bg-[#47B8FF]' :
                    states[i] === 'plan' ? 'bg-white/15' : 'bg-white/5'
                  }`}>
                    {states[i] === 'done' && '✓'}
                    {states[i] === 'today' && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                  </div>
                  <span className={`text-[10px] ${i === 3 ? 'text-[#47B8FF]' : 'text-[#44445A]'}`}>{d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* グループの活動 */}
      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">グループの活動</p>
        <div className="flex flex-col gap-3">
          {[
            { user: '田中', action: '18kmのLSDランを完走！', time: '2時間前', emoji: '🔥' },
            { user: '鈴木', action: 'マイタウンでスタジアムをアンロック！', time: '5時間前', emoji: '🏟️' },
            { user: '山本', action: '朝ラン 5km テンポ走', time: '昨日', emoji: '⚡' },
          ].map((item, i) => (
            <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[rgba(197,255,71,0.12)] border border-[rgba(197,255,71,0.3)] flex items-center justify-center font-bold text-[#C5FF47] flex-shrink-0">
                {item.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm"><span className="text-[#C5FF47] font-semibold">{item.user}</span> さん</p>
                <p className="text-xs text-[#7777A0]">{item.action}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl">{item.emoji}</div>
                <div className="text-[10px] text-[#44445A]">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}