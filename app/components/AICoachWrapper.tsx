'use client';

import { usePathname } from 'next/navigation';
import AICoach from './AICoach';

export default function AICoachWrapper() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return <AICoach />;
}
