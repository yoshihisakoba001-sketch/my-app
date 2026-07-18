'use client';

import { useTheme } from './ThemeContext';

type Props = {
  building: { name: string; icon: string };
  onClose: () => void;
};

export default function UnlockPopup({ building, onClose }: Props) {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xs rounded-3xl border flex flex-col items-center py-8 px-6 text-center"
        style={{
          background: isDark ? '#0C0C1A' : '#FFFFFF',
          borderColor: isDark ? 'rgba(197,255,71,0.3)' : 'rgba(255,59,139,0.3)',
          boxShadow: isDark ? '0 0 40px rgba(197,255,71,0.15)' : '0 0 40px rgba(255,59,139,0.15)',
        }}>

        {/* スパークル */}
        <div className="relative mb-3">
          <div className="text-5xl" style={{ animation: 'unlockBounce 0.6s ease-out' }}>{building.icon}</div>
          {['✨','⭐','✨'].map((s, i) => (
            <span key={i} className="absolute text-lg"
              style={{
                top: i === 1 ? '-12px' : '4px',
                left: i === 0 ? '-20px' : i === 2 ? '100%' : '50%',
                transform: i === 1 ? 'translateX(-50%)' : 'none',
                animation: `sparkle 0.8s ease-out ${i * 0.15}s both`,
              }}>{s}</span>
          ))}
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: isDark ? '#C5FF47' : '#FF3B8B' }}>
          NEW UNLOCK 🎉
        </p>
        <p className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {building.name}
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          マイタウンに新施設が登場しました！
        </p>

        <button onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{
            background: isDark ? 'linear-gradient(135deg, #C5FF47, #A0E030)' : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)',
            color: isDark ? '#08080F' : '#FFFFFF',
          }}>
          タウンを確認する
        </button>
      </div>
    </div>
  );
}
