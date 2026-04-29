import BottomNav from './components/BottomNav';
import ProgressBar from './components/ProgressBar';

const MiniTown = () => (
  <svg viewBox="0 0 340 80" style={{ width: '100%', height: 80 }}>
    <defs>
      <linearGradient id="minisky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#05050F"/>
        <stop offset="100%" stopColor="#0D0D20"/>
      </linearGradient>
    </defs>
    <rect width="340" height="80" fill="url(#minisky)"/>
    {[[20,6],[55,12],[110,4],[175,9],[230,3],[295,8]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={0.7} fill="#EEEEF8" opacity="0.5"/>
    ))}
    <rect x="0" y="66" width="340" height="14" fill="#0D1A0D"/>
    <rect x="0" y="66" width="340" height="4" fill="#181828"/>
    <rect x="8" y="48" width="18" height="20" fill="#1E1E3A" rx="1"/>
    <rect x="12" y="52" width="4" height="4" fill="#C5FF47" opacity="0.6"/>
    <rect x="18" y="52" width="4" height="4" fill="#47B8FF" opacity="0.4"/>
    <rect x="32" y="36" width="24" height="32" fill="#252540" rx="1"/>
    <rect x="36" y="41" width="5" height="5" fill="#C5FF47" opacity="0.8"/>
    <rect x="44" y="41" width="5" height="5" fill="#47B8FF" opacity="0.5"/>
    <rect x="36" y="50" width="5" height="5" fill="#C5FF47" opacity="0.6"/>
    <rect x="44" y="50" width="5" height="5" fill="#C5FF47" opacity="0.4"/>
    <circle cx="75" cy="60" r="6" fill="#1A4020"/>
    <circle cx="86" cy="61" r="5" fill="#183818"/>
    <rect x="98" y="44" width="20" height="24" fill="#1E1E38" rx="1"/>
    <rect x="102" y="49" width="4" height="4" fill="#C5FF47" opacity="0.9"/>
    <rect x="109" y="49" width="4" height="4" fill="#C5FF47" opacity="0.5"/>
    <rect x="102" y="57" width="4" height="4" fill="#47B8FF" opacity="0.4"/>
    <rect x="124" y="28" width="28" height="40" fill="#282845" rx="1"/>
    <rect x="128" y="33" width="5" height="5" fill="#C5FF47" opacity="0.9"/>
    <rect x="137" y="33" width="5" height="5" fill="#47B8FF" opacity="0.7"/>
    <rect x="128" y="42" width="5" height="5" fill="#C5FF47" opacity="0.6"/>
    <rect x="137" y="42" width="5" height="5" fill="#C5FF47" opacity="0.8"/>
    <rect x="128" y="51" width="5" height="5" fill="#47B8FF" opacity="0.4"/>
    <rect x="137" y="51" width="5" height="5" fill="#C5FF47" opacity="0.5"/>
    <rect x="162" y="42" width="18" height="26" fill="#1C1C35" rx="1"/>
    <rect x="166" y="47" width="4" height="4" fill="#C5FF47" opacity="0.7"/>
    <rect x="173" y="47" width="4" height="4" fill="#47B8FF" opacity="0.5"/>
    <rect x="188" y="36" width="22" height="32" fill="#222240" rx="1"/>
    <rect x="192" y="41" width="5" height="5" fill="#C5FF47" opacity="0.8"/>
    <rect x="200" y="41" width="5" height="5" fill="#C5FF47" opacity="0.5"/>
    <rect x="192" y="50" width="5" height="5" fill="#47B8FF" opacity="0.6"/>
    <rect x="200" y="50" width="5" height="5" fill="#C5FF47" opacity="0.4"/>
    <rect x="220" y="56" width="50" height="10" fill="#0A1A2A" rx="2"/>
    <path d="M220 59 Q235 54 250 59 Q265 64 270 59" stroke="#1A3A5A" strokeWidth="1" fill="none"/>
    <ellipse cx="305" cy="56" rx="24" ry="12" fill="none" stroke="#C5FF47" strokeWidth="0.8" opacity="0.2" strokeDasharray="3 2"/>
    <text x="305" y="59" textAnchor="middle" fontSize="6" fill="#C5FF47" opacity="0.25" fontFamily="sans-serif">🔒 STADIUM</text>
  </svg>
);

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
        <ProgressBar
          value={28}
          max={42}
          unit="km"
          label="達成率"
          showLv={true}
          streak={12}
          milestones={[
            { value: 10, icon: '⭐' },
            { value: 25, icon: '🏃' },
            { value: 42, icon: '🏆' },
          ]}
        />
        <div className="flex justify-between mt-3 px-1">
          {['月','火','水','木','金','土','日'].map((d, i) => {
            const states = ['done','done','done','today','plan','rest','plan'];
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                  states[i] === 'done' ? 'bg-[#C5FF47] text-[#08080F]' :
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
      

      {/* マイタウン */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A]">マイタウン</p>
          <a href="/town" className="text-xs text-[#C5FF47] font-semibold flex items-center gap-1">
            全景を見る →
          </a>
        </div>
        <div className="bg-[rgba(13,13,32,0.9)] border border-white/10 rounded-2xl overflow-hidden">
          <MiniTown />
          <div className="px-4 py-2.5 flex items-center justify-between border-t border-white/10">
            <span className="text-xs text-[#7777A0]">累計 <span className="text-[#C5FF47] font-bold">284 km</span></span>
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,133,71,0.15)] text-[#FF8547] font-semibold">🏟️ スタジアムまで 16km</span>
          </div>
        </div>
      </div>

      {/* グループの活動 */}
      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-2">グループの活動</p>
        <div className="flex flex-col gap-3">
          {[
            { user: '田中', color: '#FFD700', action: '18kmのLSDランを完走！', time: '2時間前', emoji: '🔥' },
            { user: '鈴木', color: '#47B8FF', action: 'マイタウンでスタジアムをアンロック！', time: '5時間前', emoji: '🏟️' },
            { user: '山本', color: '#FF8547', action: '朝ラン 5km テンポ走', time: '昨日', emoji: '⚡' },
          ].map((item, i) => (
            <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold border flex-shrink-0"
                style={{ background: `${item.color}20`, borderColor: `${item.color}55`, color: item.color }}>
                {item.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold" style={{ color: item.color }}>{item.user}</span> さん</p>
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

      <div className="h-4" />
      <BottomNav />
    </div>
  );
}