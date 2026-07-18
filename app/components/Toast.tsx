'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeContext';

type Props = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, onClose, duration = 3000 }: Props) {
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-[200] px-4 pointer-events-none"
      style={{ animation: 'slideDown 0.35s ease-out' }}>
      <div className="px-6 py-3 rounded-full text-sm font-bold shadow-lg pointer-events-auto"
        style={{
          background: isDark ? 'linear-gradient(135deg, #C5FF47, #A0E030)' : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)',
          color: isDark ? '#08080F' : '#FFFFFF',
          boxShadow: isDark ? '0 4px 20px rgba(197,255,71,0.4)' : '0 4px 20px rgba(255,59,139,0.4)',
        }}>
        {message}
      </div>
    </div>
  );
}
