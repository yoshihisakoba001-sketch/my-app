'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      // token_hashがある場合はメール認証を処理
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          console.error('認証エラー:', error);
          router.push('/login?error=auth');
          return;
        }
      }

      // セッション取得後にinvite_tokenを処理
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
          // profileが存在しない場合は作成
          //   const { data: existingProfile } = await supabase
          //     .from('profiles')
          //     .select('id')
          //     .eq('id', session.user.id)
          //     .maybeSingle();
          
          if (!existingProfile) {
                const pendingName = localStorage.getItem('pending_name') || '';
                await supabase.from('profiles').insert({
                   id: session.user.id,
                   email: session.user.email,
                   name: pendingName,
                   pending_invite_token: localStorage.getItem('invite_token') || null,
                });
                localStorage.removeItem('pending_name');
            }
            
    　　　// invite_token処理
      const inviteToken = localStorage.getItem('invite_token');
      if (inviteToken) {
         await handleInviteToken(inviteToken, session.user.id);
         localStorage.removeItem('invite_token');
      }
    }

      router.push('/');
    };

    const handleInviteToken = async (token: string, newUserId: string) => {
      const { data: inviteData } = await supabase
        .from('invite_tokens')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (!inviteData) return;

      await supabase.from('friendships').insert({
        requester_id: inviteData.inviter_id,
        receiver_id: newUserId,
        status: 'accepted',
      });

      await supabase.from('invite_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', inviteData.id);
    };

    handleCallback();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0EFF8' }}>
      <p style={{ color: '#FF3B8B', fontFamily: 'Space Grotesk, sans-serif' }}>ログイン処理中...</p>
    </div>
  );
}