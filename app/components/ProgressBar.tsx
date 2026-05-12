'use client';

import { useTheme } from './ThemeContext';

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
  const { isDark } = useTheme();
  const pct = Math.min(100, Math.round((value / max) * 100));
  const lv = Math.floor(value / (max / 5)) + 1;

  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {showLv && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md border" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--border-accent)' }}>
              LV.{lv}
            </span>
          )}
          <div>
            <span className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</span>
            <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>/ {max} {unit}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak && streak > 0 && (
            <span className="text-xs font-bold px-2 py-1 rounded-full border" style={{ background: 'var(--accent-3-bg)', color: 'var(--accent-3)', borderColor: `var(--accent-3)` }}>
              🔥 {streak}日連続
            </span>
          )}
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{pct}%</span>
            {label && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>}
          </div>
        </div>
      </div>
      <div className="relative h-5 rounded-full overflow-hidden border" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderColor: 'var(--border)' }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isDark
              ? 'linear-gradient(90deg, #C5FF47 0%, #47B8FF 60%, rgba(71,184,255,0.4) 100%)'
              : 'linear-gradient(90deg, #FF3B8B 0%, #FF8547 60%, rgba(255,133,71,0.4) 100%)',
            boxShadow: isDark
              ? '0 0 12px rgba(197,255,71,0.5), 0 0 24px rgba(71,184,255,0.3)'
              : '0 0 12px rgba(255,59,139,0.4)',
          }}
        />
        <div
          className="absolute left-0 top-0 h-1/2 rounded-full opacity-30"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, transparent 100%)' }}
        />
        <div
          className="absolute top-0 h-full w-0.5 opacity-60"
          style={{ left: `${pct}%`, transform: 'translateX(-50%)', background: isDark ? 'white' : 'rgba(0,0,0,0.3)' }}
        />
      </div>
      {milestones && milestones.length > 0 && (
        <div className="relative mt-2 h-5">
          {milestones.map((m, i) => {
            const mPct = (m.value / max) * 100;
            if (mPct > 100) return null;
            const achieved = value >= m.value;
            return (
              <div key={i} className="absolute flex flex-col items-center" style={{ left: `${mPct}%`, transform: 'translateX(-50%)' }}>
                <span className="text-sm" style={{ opacity: achieved ? 1 : 0.3 }}>{m.icon}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}