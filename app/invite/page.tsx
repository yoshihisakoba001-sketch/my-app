'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // tokenをlocalStorageに保存してからLPへ
      localStorage.setItem('invite_token', token);
      router.push(`/lp?token=${token}`);
    } else {
      router.push('/lp');
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0EFF8' }}>
      <p style={{ color: '#FF3B8B' }}>招待リンクを処理中...</p>
    </div>
  );
}