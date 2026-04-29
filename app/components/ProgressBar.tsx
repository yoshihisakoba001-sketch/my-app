type Props = {
  value: number;
  max: number;
  label?: string;
  unit?: string;
  milestones?: { value: number; icon: string }[];
  showLv?: boolean;
  streak?: number;
};

export default function ProgressBar({ value, max, label, unit = '', milestones, showLv, streak }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const lv = Math.floor(value / (max / 5)) + 1;

  return (
    <div className="bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {showLv && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[rgba(197,255,71,0.15)] text-[#C5FF47] border border-[rgba(197,255,71,0.3)]">
              LV.{lv}
            </span>
          )}
          <div>
            <span className="text-3xl font-bold tracking-tight text-[#EEEEF8]">{value}</span>
            <span className="text-sm text-[#7777A0] ml-1">/ {max} {unit}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak && streak > 0 && (
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[rgba(255,133,71,0.15)] text-[#FF8547] border border-[rgba(255,133,71,0.3)]">
              🔥 {streak}日連続
            </span>
          )}
          <div className="text-right">
            <span className="text-2xl font-bold text-[#C5FF47]">{pct}%</span>
            {label && <p className="text-xs text-[#7777A0]">{label}</p>}
          </div>
        </div>
      </div>
      <div className="relative h-5 bg-white/10 rounded-full overflow-hidden border border-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #C5FF47 0%, #47B8FF 60%, rgba(71,184,255,0.4) 100%)',
            boxShadow: '0 0 12px rgba(197,255,71,0.5), 0 0 24px rgba(71,184,255,0.3)',
          }}
        />
        <div
          className="absolute left-0 top-0 h-1/2 rounded-full opacity-30"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-white opacity-60"
          style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      {milestones && milestones.length > 0 && (
        <div className="relative mt-2 h-5">
          {milestones.map((m, i) => {
            const mPct = Math.min(100, (m.value / max) * 100);
            const achieved = value >= m.value;
            return (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: `${mPct}%`, transform: 'translateX(-50%)' }}>
                <span className="text-sm" style={{ opacity: achieved ? 1 : 0.3 }}>{m.icon}</span>
                <span className="text-[9px] text-[#44445A] whitespace-nowrap">{m.value}{unit}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
