'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // tokenをlocalStorageに保存してからサインアップへ
      localStorage.setItem('invite_token', token);
    }
    router.push('/login?mode=signup');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#08080F' }}>
      <p style={{ color: '#C5FF47' }}>招待リンクを処理中...</p>
    </div>
  );
}