import BottomNav from '../components/BottomNav';

export default function TownPage() {
  const totalKm = 284;
  const nextUnlock = { name: 'スタジアム', km: 300, remaining: 16 };

  const buildings = [
    { name: '公園', unlockedAt: 100, icon: '🌳', unlocked: true },
    { name: '橋', unlockedAt: 150, icon: '🌉', unlocked: true },
    { name: 'カフェ', unlockedAt: 200, icon: '☕', unlocked: true },
    { name: '川・森', unlockedAt: 250, icon: '🌊', unlocked: true },
    { name: 'スタジアム', unlockedAt: 300, icon: '🏟️', unlocked: false },
    { name: '図書館', unlockedAt: 400, icon: '📚', unlocked: false },
    { name: '温泉', unlockedAt: 500, icon: '♨️', unlocked: false },
    { name: '城', unlockedAt: 750, icon: '🏯', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">マイタウン</h1>
        <p className="text-xs text-[#7777A0] mt-1">走るたびに街が育ちます</p>
      </div>

      {/* Town view */}
      <div className="mx-5 mt-4 rounded-2xl overflow-hidden border border-white/10 bg-[#0D0D20]">
        {/* Night sky */}
        <div className="relative h-48 bg-gradient-to-b from-[#05050F] to-[#0D0D20] flex items-end justify-center pb-2">
          {/* Stars */}
          {[[20,10],[60,20],[120,8],[180,15],[240,6],[300,12],[340,18]].map(([x,y], i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-white/60" style={{ left: x, top: y }}/>
          ))}
          {/* Buildings silhouette */}
          <div className="flex items-end gap-1 px-4 w-full">
            <div className="w-8 h-16 bg-[#1E1E3A] rounded-t-sm"/>
            <div className="w-12 h-24 bg-[#2A2A40] rounded-t-sm"/>
            <div className="w-6 h-12 bg-[#1A1A30] rounded-t-sm"/>
            <div className="w-10 h-28 bg-[#252540] rounded-t-sm"/>
            <div className="w-8 h-20 bg-[#1E1E38] rounded-t-sm"/>
            <div className="w-14 h-32 bg-[#2E2E4A] rounded-t-sm"/>
            <div className="w-6 h-10 bg-[#1A1A30] rounded-t-sm"/>
            <div className="w-10 h-18 bg-[#222238] rounded-t-sm"/>
            {/* Windows */}
          </div>
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#0D1A0D]"/>
        </div>

        {/* Stats bar */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-white/10">
          <div className="text-sm">
            累計 <span className="text-[#C5FF47] font-bold">{totalKm} km</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,133,71,0.15)] text-[#FF8547] font-semibold">
            🏟️ スタジアムまで {nextUnlock.remaining}km
          </span>
        </div>

        {/* Progress to next unlock */}
        <div className="px-4 pb-4">
          <div className="flex justify-between text-xs text-[#7777A0] mb-1">
            <span>次のアンロック：{nextUnlock.name}</span>
            <span>{totalKm} / {nextUnlock.km}km</span>
          </div>
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C5FF47] to-[#A0E030] h-2 rounded-full shadow-[0_0_8px_rgba(197,255,71,0.6)]"
              style={{ width: `${(totalKm / nextUnlock.km) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buildings list */}
      <div className="px-5 pt-6">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-3">施設一覧</p>
        <div className="grid grid-cols-2 gap-3">
          {buildings.map((b, i) => (
            <div key={i} className={`rounded-xl p-3 border flex items-center gap-3 ${
              b.unlocked
                ? 'bg-[rgba(197,255,71,0.05)] border-[rgba(197,255,71,0.2)]'
                : 'bg-[rgba(26,26,40,0.4)] border-white/5 opacity-50'
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

      <BottomNav />
    </div>
  );
}