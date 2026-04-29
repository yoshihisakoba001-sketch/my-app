import BottomNav from '../components/BottomNav';

const members = [
  { name: '小林', km: 284, runs: 12, rank: 1, color: '#C5FF47' },
  { name: '田中', km: 312, runs: 15, rank: 1, color: '#FFD700' },
  { name: '鈴木', km: 198, runs: 9,  rank: 3, color: '#47B8FF' },
  { name: '山本', km: 156, runs: 7,  rank: 4, color: '#FF8547' },
  { name: '佐藤', km: 89,  runs: 4,  rank: 5, color: '#B847FF' },
];

const feed = [
  { user: '田中', action: '18kmのLSDランを完走！', time: '2時間前', emoji: '🔥', comment: 1 },
  { user: '鈴木', action: 'マイタウンでスタジアムをアンロック！', time: '5時間前', emoji: '🏟️', comment: 3 },
  { user: '山本', action: '朝ラン 5km テンポ走', time: '昨日', emoji: '⚡', comment: 0 },
  { user: '佐藤', action: '初めての10km完走！', time: '2日前', emoji: '🎉', comment: 5 },
];

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] pb-24">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">ソーシャル</h1>
        <p className="text-xs text-[#7777A0] mt-1">グループ：東京マラソン仲間</p>
      </div>

      {/* Ranking */}
      <div className="px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-3">今月のランキング</p>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-3 mb-4 h-32">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2"
              style={{ background: `${members[0].color}20`, borderColor: `${members[0].color}55`, color: members[0].color }}>
              {members[0].name[0]}
            </div>
            <div className="w-20 h-16 bg-[rgba(197,255,71,0.1)] border border-[rgba(197,255,71,0.2)] rounded-t-xl flex flex-col items-center justify-center">
              <span className="text-lg">🥈</span>
              <span className="text-xs text-[#7777A0]">{members[0].km}km</span>
            </div>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">👑</span>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2"
              style={{ background: `${members[1].color}20`, borderColor: `${members[1].color}55`, color: members[1].color }}>
              {members[1].name[0]}
            </div>
            <div className="w-20 h-24 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.3)] rounded-t-xl flex flex-col items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-lg">🥇</span>
              <span className="text-xs text-[#7777A0]">{members[1].km}km</span>
            </div>
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2"
              style={{ background: `${members[2].color}20`, borderColor: `${members[2].color}55`, color: members[2].color }}>
              {members[2].name[0]}
            </div>
            <div className="w-20 h-12 bg-[rgba(71,184,255,0.1)] border border-[rgba(71,184,255,0.2)] rounded-t-xl flex flex-col items-center justify-center">
              <span className="text-lg">🥉</span>
              <span className="text-xs text-[#7777A0]">{members[2].km}km</span>
            </div>
          </div>
        </div>

        {/* Full ranking list */}
        <div className="flex flex-col gap-2">
          {members.map((m, i) => (
            <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-sm font-bold w-4 text-[#44445A]">{i + 1}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border"
                style={{ background: `${m.color}20`, borderColor: `${m.color}55`, color: m.color }}>
                {m.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-[#7777A0]">{m.runs}回</p>
              </div>
              <span className="text-sm font-bold" style={{ color: m.color }}>{m.km}km</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-5 pt-6">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#44445A] mb-3">みんなの活動</p>
        <div className="flex flex-col gap-3">
          {feed.map((item, i) => (
            <div key={i} className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(197,255,71,0.12)] border border-[rgba(197,255,71,0.3)] flex items-center justify-center font-bold text-[#C5FF47]">
                  {item.user[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#C5FF47]">{item.user}</p>
                  <p className="text-xs text-[#7777A0]">{item.time}</p>
                </div>
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <p className="text-sm text-[#EEEEF8] mb-3">{item.action}</p>
              <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                <button className="flex items-center gap-1 text-xs text-[#7777A0] hover:text-[#C5FF47] transition-colors">
                  👏 応援する
                </button>
                <button className="flex items-center gap-1 text-xs text-[#7777A0] hover:text-[#C5FF47] transition-colors">
                  💬 コメント {item.comment > 0 && `(${item.comment})`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}