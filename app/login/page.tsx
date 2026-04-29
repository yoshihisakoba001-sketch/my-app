'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/');
      }
    });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, name });
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
    <div className="min-h-screen bg-[#08080F] text-[#EEEEF8] flex flex-col items-center justify-center px-5">

      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#C5FF47] tracking-tight mb-4">RunPlan</h1>
        <p className="text-base font-semibold text-[#EEEEF8] leading-relaxed">ゴールまでの道を、みんなでつくる</p>
        <p className="text-base font-semibold text-[#C5FF47] leading-relaxed">さあ、今日も一歩</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[rgba(26,26,40,0.85)] border border-white/10 rounded-2xl p-6">

        {/* Tab */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'login',  label: 'ログイン' },
            { id: 'signup', label: '新規登録' },
          ].map(t => (
            <button key={t.id} onClick={() => { setMode(t.id as any); setMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                mode === t.id
                  ? 'bg-[rgba(197,255,71,0.1)] text-[#C5FF47] border-[rgba(197,255,71,0.3)]'
                  : 'bg-transparent text-[#7777A0] border-white/10'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <p className="text-xs text-[#7777A0] mb-1.5 font-semibold">名前</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="山田太郎"
                className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-[#EEEEF8] placeholder-[#44445A]"
              />
            </div>
          )}

          <div>
            <p className="text-xs text-[#7777A0] mb-1.5 font-semibold">メールアドレス</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-[#EEEEF8] placeholder-[#44445A]"
            />
          </div>

          <div>
            <p className="text-xs text-[#7777A0] mb-1.5 font-semibold">パスワード</p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8文字以上"
              className="w-full bg-[rgba(26,26,40,0.9)] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-[#EEEEF8] placeholder-[#44445A]"
            />
          </div>

          {message && (
            <p className={`text-xs text-center ${message.includes('送信') ? 'text-[#C5FF47]' : 'text-[#FF4D6A]'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5FF47] to-[#A0E030] text-[#08080F] font-bold text-base disabled:opacity-50">
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウントを作成'}
          </button>
        </div>
      </div>
    </div>
  );
}