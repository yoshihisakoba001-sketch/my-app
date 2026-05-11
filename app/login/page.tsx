'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setMode('signup');
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    if (mode === 'signup') {
      const inviteToken = localStorage.getItem('invite_token');
      const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
      if (inviteToken) callbackUrl.searchParams.set('invite_token', inviteToken);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callbackUrl.toString() },
      });
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        localStorage.setItem('pending_name', name);
        setMessage('確認メールを送信しました。メールを確認してください。');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage('メールアドレスまたはパスワードが違います。');
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0EFF8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1.25rem', fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ロゴ */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <img src="/logo.png" alt="RunPlan" style={{ height: 80, objectFit: 'contain' }}/>
        <p style={{ fontSize: '.95rem', fontWeight: 600, color: '#1A1A2E', marginTop: '.75rem', lineHeight: 1.6 }}>ゴールまでの道を、みんなでつくる</p>
        <p style={{ fontSize: '.95rem', fontWeight: 600, color: '#FF3B8B', lineHeight: 1.6 }}>さあ、今日も一歩</p>
      </div>

      {/* カード */}
      <div style={{ width: '100%', maxWidth: 400, background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, padding: '1.5rem', boxShadow: '0 4px 24px rgba(255,59,139,0.08)' }}>

        {/* タブ */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {[
            { id: 'login', label: 'ログイン' },
            { id: 'signup', label: '新規登録' },
          ].map(t => (
            <button key={t.id} onClick={() => { setMode(t.id as any); setMessage(''); }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 12, fontSize: '.875rem', fontWeight: 700, border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                background: mode === t.id ? 'rgba(255,59,139,0.08)' : 'transparent',
                color: mode === t.id ? '#FF3B8B' : '#A0A0BE',
                borderColor: mode === t.id ? 'rgba(255,59,139,0.3)' : 'rgba(0,0,0,0.08)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* フォーム */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <p style={{ fontSize: '.75rem', color: '#A0A0BE', marginBottom: 6, fontWeight: 700 }}>名前</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="山田太郎"
                style={{ width: '100%', background: '#F0EFF8', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: '.875rem', outline: 'none', color: '#1A1A2E', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div>
            <p style={{ fontSize: '.75rem', color: '#A0A0BE', marginBottom: 6, fontWeight: 700 }}>メールアドレス</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{ width: '100%', background: '#F0EFF8', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: '.875rem', outline: 'none', color: '#1A1A2E', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <p style={{ fontSize: '.75rem', color: '#A0A0BE', marginBottom: 6, fontWeight: 700 }}>パスワード</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8文字以上"
              style={{ width: '100%', background: '#F0EFF8', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '12px 16px', fontSize: '.875rem', outline: 'none', color: '#1A1A2E', boxSizing: 'border-box' }}
            />
          </div>

          {message && (
            <p style={{ fontSize: '.75rem', textAlign: 'center', color: message.includes('送信') ? '#5D9E3F' : '#FF4D6A' }}>
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '14px 0', borderRadius: 16, background: 'linear-gradient(90deg, #FF3B8B, #FF6B9D)', color: 'white', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1, boxShadow: '0 4px 16px rgba(255,59,139,0.3)' }}>
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウントを作成'}
          </button>
        </div>
      </div>

      {/* LPへのリンク */}
      <a href="/lp" style={{ marginTop: '1.5rem', fontSize: '.8rem', color: '#A0A0BE', textDecoration: 'none' }}>
        RunPlanについて詳しく見る →
      </a>
    </div>
  );
}