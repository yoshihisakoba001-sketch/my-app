'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { id: 'home',     href: '/',         icon: '🏠', label: 'ホーム' },
  { id: 'calendar', href: '/calendar', icon: '📅', label: 'カレンダー' },
  { id: 'record',   href: '/record',   icon: '➕', label: '記録',  fab: true },
  { id: 'town',     href: '/town',     icon: '🗺️', label: 'マイタウン' },
  { id: 'social',   href: '/social',   icon: '👥', label: 'ソーシャル' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[rgba(10,10,18,0.96)] backdrop-blur-xl border-t border-white/10 flex items-center px-2 z-50">
      {tabs.map(tab => (
        <Link key={tab.id} href={tab.href} className="flex-1 flex flex-col items-center justify-center gap-1 no-underline">
          {tab.fab ? (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C5FF47] to-[#A0E030] flex items-center justify-center -mt-6 shadow-lg shadow-[#C5FF47]/40">
              <span className="text-2xl">➕</span>
            </div>
          ) : (
            <>
              <span className="text-2xl">{tab.icon}</span>
              <span className={`text-[10px] font-semibold ${pathname === tab.href ? 'text-[#C5FF47]' : 'text-[#44445A]'}`}>
                {tab.label}
              </span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}   