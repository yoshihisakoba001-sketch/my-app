'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';

const tabs = [
  { id: 'home',     href: '/',         icon: '🏠', label: 'ホーム' },
  { id: 'calendar', href: '/calendar', icon: '📅', label: 'カレンダー' },
  { id: 'coach',    href: '/coach',    icon: '🏃', label: 'AIコーチ', fab: true },
  { id: 'town',     href: '/town',     icon: '🗺️', label: 'マイタウン' },
  { id: 'social',   href: '/social',   icon: '👥', label: 'ソーシャル' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isDark } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 backdrop-blur-xl border-t flex items-center px-2 z-50"
      style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
      {tabs.map(tab => (
        <Link key={tab.id} href={tab.href} className="flex-1 flex flex-col items-center justify-center gap-1 no-underline">
          {tab.fab ? (
            <div className="w-14 h-14 rounded-full flex items-center justify-center -mt-6 shadow-lg"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #C5FF47, #A0E030)'
                  : 'linear-gradient(135deg, #FF3B8B, #FF6B9D)',
                boxShadow: isDark ? '0 4px 15px rgba(197,255,71,0.4)' : '0 4px 15px rgba(255,59,139,0.4)',
              }}>
              <span className="text-2xl">🏃</span>
            </div>
          ) : (
            <>
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-[10px] font-semibold" style={{ color: pathname === tab.href ? 'var(--accent)' : 'var(--text-muted)' }}>
                {tab.label}
              </span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}