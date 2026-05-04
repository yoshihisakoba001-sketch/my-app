'use client';

import { useEffect, useRef, useState } from 'react';

// ===== マイタウン SVG =====
const DayTownSVG = ({ km }: { km: number }) => (
  <svg viewBox="0 0 360 160" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="lp-daysky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB"/>
        <stop offset="100%" stopColor="#C9E8F5"/>
      </linearGradient>
    </defs>
    <rect width="360" height="160" fill="url(#lp-daysky)"/>
    <circle cx="320" cy="22" r="14" fill="#FFE066"/>
    <circle cx="320" cy="22" r="10" fill="#FFD700"/>
    <ellipse cx="55" cy="22" rx="22" ry="11" fill="white" opacity="0.95"/>
    <ellipse cx="38" cy="26" rx="14" ry="9" fill="white" opacity="0.95"/>
    <ellipse cx="72" cy="26" rx="14" ry="9" fill="white" opacity="0.95"/>
    <ellipse cx="180" cy="18" rx="18" ry="9" fill="white" opacity="0.85"/>
    <ellipse cx="165" cy="22" rx="12" ry="7" fill="white" opacity="0.85"/>
    <ellipse cx="195" cy="22" rx="12" ry="7" fill="white" opacity="0.85"/>
    <rect x="0" y="128" width="360" height="32" fill="#5D9E3F"/>
    <rect x="0" y="128" width="360" height="5" fill="#7BC142"/>
    <rect x="0" y="136" width="360" height="8" fill="#8B8B8B" opacity="0.4"/>
    {[20,60,100,140,180,220,260,300,340].map(x => (
      <rect key={x} x={x} y={139} width={20} height={2} fill="white" opacity="0.5"/>
    ))}
    {/* 建物1 */}
    <rect x="4" y="92" width="28" height="38" fill="#F0F0F0" rx="2"/>
    <rect x="4" y="86" width="28" height="8" fill="#E0E0E0" rx="2"/>
    <rect x="9" y="96" width="7" height="8" fill="#87CEEB" opacity="0.8"/>
    <rect x="20" y="96" width="7" height="8" fill="#87CEEB" opacity="0.8"/>
    <rect x="9" y="108" width="7" height="8" fill="#87CEEB" opacity="0.8"/>
    <rect x="20" y="108" width="7" height="8" fill="#87CEEB" opacity="0.8"/>
    <rect x="13" y="118" width="10" height="12" fill="#8D6E63" rx="1"/>
    {/* 建物2: 赤茶色ビル */}
    <rect x="36" y="65" width="30" height="65" fill="#C0392B" rx="2"/>
    <rect x="36" y="60" width="30" height="7" fill="#A93226" rx="1"/>
    {[0,1,2].map(col => [0,1,2,3,4].map(row => (
      <rect key={`b2-${col}-${row}`} x={40+col*9} y={68+row*12} width={6} height={8} fill="#FFE0B2" opacity={0.85}/>
    )))}
    <rect x="48" y="120" width="8" height="10" fill="#5D4037" rx="1"/>
    {/* 建物3: 灰色高層ビル */}
    <rect x="70" y="40" width="35" height="90" fill="#9E9E9E" rx="2"/>
    <rect x="70" y="35" width="35" height="7" fill="#757575" rx="1"/>
    <rect x="83" y="28" width="3" height="9" fill="#616161"/>
    <circle cx="84" cy="27" r="2" fill="#EF5350" opacity="0.9"/>
    {[0,1].map(col => [0,1,2,3,4,5,6].map(row => (
      <rect key={`b3-${col}-${row}`} x={74+col*16} y={44+row*12} width={10} height={8} fill="#B3E5FC" opacity={0.8}/>
    )))}
    {/* 建物4: 青いオフィスビル */}
    <rect x="140" y="25" width="42" height="105" fill="#42A5F5" rx="2"/>
    <rect x="140" y="20" width="42" height="7" fill="#1E88E5" rx="1"/>
    <rect x="155" y="13" width="5" height="9" fill="#1565C0"/>
    <circle cx="157" cy="12" r="2.5" fill="#EF5350" opacity="0.9"/>
    {[0,1].map(col => [0,1,2,3,4,5,6,7].map(row => (
      <rect key={`b4-${col}-${row}`} x={145+col*18} y={28+row*12} width={13} height={8} fill="white" opacity={0.3}/>
    )))}
    {/* 建物5: オレンジビル */}
    <rect x="190" y="60" width="28" height="70" fill="#FF8F00" rx="2"/>
    <rect x="190" y="55" width="28" height="7" fill="#E65100" rx="1"/>
    {[0,1].map(col => [0,1,2,3,4].map(row => (
      <rect key={`b5-${col}-${row}`} x={194+col*13} y={63+row*12} width={9} height={8} fill="#FFF9C4" opacity={0.8}/>
    )))}
    <rect x="200" y="120" width="10" height="10" fill="#5D4037" rx="1"/>
    {/* 建物6: 青緑ビル */}
    <rect x="222" y="38" width="36" height="92" fill="#26C6DA" rx="2"/>
    <rect x="222" y="33" width="36" height="7" fill="#00ACC1" rx="1"/>
    {[0,1].map(col => [0,1,2,3,4,5,6].map(row => (
      <rect key={`b6-${col}-${row}`} x={226+col*15} y={40+row*12} width={11} height={8} fill="white" opacity={0.3}/>
    )))}
    {/* 木（50km以上） */}
    {km >= 50 && (
      <><rect x="109" y="120" width="5" height="10" fill="#5D4037"/><circle cx="111" cy="113" r="9" fill="#388E3C"/><circle cx="111" cy="113" r="6" fill="#43A047"/></>
    )}
    {/* スタジアム（300km） */}
    {km >= 300 ? (
      <><ellipse cx="338" cy="116" rx="20" ry="12" fill="#81C784" stroke="#4CAF50" strokeWidth="1.5"/><ellipse cx="338" cy="116" rx="13" ry="7" fill="#A5D6A7"/><ellipse cx="338" cy="116" rx="6" ry="3" fill="#66BB6A"/><text x="338" y="119" textAnchor="middle" fontSize="5" fill="#1B5E20" fontFamily="sans-serif" fontWeight="bold">STADIUM</text></>
    ) : (
      <><ellipse cx="338" cy="116" rx="19" ry="11" fill="none" stroke="#BDBDBD" strokeWidth="1" strokeDasharray="3 2"/><text x="338" y="113" textAnchor="middle" fontSize="7" fill="#BDBDBD">🔒</text><text x="338" y="121" textAnchor="middle" fontSize="5" fill="#BDBDBD" fontFamily="sans-serif">STADIUM</text></>
    )}
  </svg>
);

// ===== スマホモックアップ =====
const PhoneMockup = () => (
  <div style={{ width: 260, flexShrink: 0, background: '#1A1A2E', borderRadius: 40, border: '6px solid #1A1A2E', boxShadow: '0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)', overflow: 'hidden' }}>
    {/* ステータスバー */}
    <div style={{ background: '#1A1A2E', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>9:41</span>
      <div style={{ width: 72, height: 10, background: '#0A0A1A', borderRadius: 100 }}/>
      <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>100%</span>
    </div>

    {/* ホーム画面スクリーンショット（上部をトリミングして表示） */}
    <div style={{ width: '100%', height: 520, overflow: 'hidden', position: 'relative' }}>
      <img
        src="/home-screen.png"
        alt="RunPlanホーム画面"
        style={{
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          objectFit: 'cover',
          objectPosition: 'top',
        }}
      />
    </div>
  </div>
);

// ===== アニメーション画面 =====
const CoachScreen = () => (
  <div style={{ padding: '12px', fontFamily: 'sans-serif' }}>
    <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0BE', marginBottom: 10, letterSpacing: '0.1em' }}>AIコーチ</p>
    {[
      { role: 'ai', text: 'こんにちは！横浜マラソンまで174日ですね🏃 今週の計画を作りましょう！' },
      { role: 'user', text: '今週から本格的にトレーニング開始したい' },
      { role: 'ai', text: '今週は基礎構築期として週40kmを目標に設定しました✅ 月・水・金はジョグ、日曜はロング走16kmでいきましょう！' },
    ].map((m, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
        <div style={{ maxWidth: '80%', padding: '8px 10px', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: m.role === 'user' ? 'rgba(255,59,139,0.1)' : 'white', border: `1px solid ${m.role === 'user' ? 'rgba(255,59,139,0.2)' : 'rgba(0,0,0,0.06)'}`, fontSize: 9, color: '#1A1A2E', lineHeight: 1.5 }}>
          {m.text}
        </div>
      </div>
    ))}
  </div>
);

const SocialScreen = () => (
  <div style={{ padding: '12px', fontFamily: 'sans-serif' }}>
    <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0BE', marginBottom: 10, letterSpacing: '0.1em' }}>フィード</p>
    {[
      { icon: '🏔️', name: 'Tanaka', text: '18kmのロング走完走！', time: '2時間前', color: '#F97316', likes: 5 },
      { icon: '🚴', name: 'Suzuki', text: '横浜マラソンにエントリーしました🏆', time: '5時間前', color: '#3B82F6', likes: 8 },
      { icon: '🌿', name: 'Yamamoto', text: 'テンポ走8km！ペース4:50/km', time: '昨日', color: '#5D9E3F', likes: 3 },
    ].map((f, i) => (
      <div key={i} style={{ background: 'white', borderRadius: 12, padding: '10px', marginBottom: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{f.icon}</div>
          <span style={{ fontSize: 9, fontWeight: 700, color: f.color }}>{f.name}</span>
          <span style={{ fontSize: 8, color: '#A0A0BE', marginLeft: 'auto' }}>{f.time}</span>
        </div>
        <p style={{ fontSize: 9, color: '#1A1A2E', marginBottom: 6 }}>{f.text}</p>
        <div style={{ display: 'flex', gap: 12, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 6 }}>
          <span style={{ fontSize: 8, color: '#A0A0BE' }}>👏 {f.likes}</span>
          <span style={{ fontSize: 8, color: '#A0A0BE' }}>💬 コメント</span>
        </div>
      </div>
    ))}
  </div>
);

const TownScreen = () => (
  <div style={{ fontFamily: 'sans-serif' }}>
    <div style={{ padding: '12px 12px 0' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0BE', marginBottom: 8, letterSpacing: '0.1em' }}>マイタウン</p>
    </div>
    <div style={{ background: '#E8F4F8', height: 100 }}>
      <DayTownSVG km={300}/>
    </div>
    <div style={{ padding: '8px 12px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 9, color: '#6B6B8A' }}>累計 <strong style={{ color: '#FF3B8B' }}>300km</strong></span>
        <span style={{ fontSize: 8, background: 'rgba(93,158,63,0.1)', color: '#5D9E3F', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>🏟️ スタジアム解放！</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {[['🌳','木','✅'],['🌳','公園','✅'],['🌉','橋','✅'],['☕','カフェ','✅'],['🌊','川・森','✅'],['🏟️','スタジアム','✅']].map(([icon, name, status], i) => (
          <div key={i} style={{ background: 'rgba(255,59,139,0.05)', borderRadius: 8, padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(255,59,139,0.1)' }}>
            <span style={{ fontSize: 10 }}>{icon}</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: '#1A1A2E' }}>{name}</span>
            <span style={{ fontSize: 7, color: '#5D9E3F', marginLeft: 'auto' }}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SCENES = [
  { title: 'AIコーチが計画を作る', desc: '大会まで何をすべきか、AIが全部考えてくれる', screen: 'coach' },
  { title: '仲間の頑張りが届く', desc: 'フィードに流れる友人の記録があなたを動かす', screen: 'social' },
  { title: '走るたびに街が育つ', desc: '累計距離で施設がアンロック。止まれなくなる', screen: 'town' },
];

// ===== メインコンポーネント =====
export default function LandingPage() {
  const [scene, setScene] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    animRef.current = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setScene(prev => (prev + 1) % SCENES.length);
        setFadeIn(true);
      }, 400);
    }, 3500);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, []);

  const faqs = [
    { q: 'このサービスは有料ですか？', a: '現在は完全無料です。' },
    { q: 'ランニングの計測はできますか？', a: '計測機能はありません。GarminやSuuntoなどのアプリと併用してください。' },
    { q: 'ランニング記録の登録の仕方は？', a: 'ホーム画面の＋ボタンから登録できます。' },
    { q: '友達を招待したいんだけど', a: 'マイページ→友人管理→招待リンクを生成してシェアできます。' },
    { q: 'マイページはどこにありますか？', a: 'ボトムナビのソーシャルページ右上の「マイページ」ボタンからアクセスできます。' },
    { q: 'デザインが２種類あるらしいけど、どこから変更するの？', a: 'マイページ→テーマから切り替えられます。ライトモード（ピンク）とダークモード（グリーン）があります。' },
    { q: 'AIコーチでできることは？', a: 'トレーニング計画の作成・調整、記録へのフィードバック、天気や体調に合わせた代替メニューの提案ができます。' },
  ];

  const targets = [
    { icon: '🏙️', text: 'フルマラソンのサブフォーを目指しているシティランナー' },
    { icon: '📊', text: '月間50〜100kmくらい走っている' },
    { icon: '⌚', text: 'GarminやSuuntoは使っているが、大会に向けた本格的な計画を立てたい' },
    { icon: '👥', text: '同じ大会に出る仲間と一緒に頑張りたい' },
    { icon: '🎮', text: 'トレーニングをもっと楽しくしたい' },
  ];

  const features = [
    { icon: '🤖', title: 'AIコーチ', desc: 'あなただけのトレーニング計画を自動作成。大会までの道筋をAIが導く。', color: '#FF3B8B', bg: 'rgba(255,59,139,0.08)' },
    { icon: '📅', title: 'カレンダー', desc: '日々のトレーニングを可視化。計画通りに進んでいるか一目で分かる。', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
    { icon: '👥', title: 'ソーシャル', desc: '同じ大会を目指す仲間と繋がる。仲間の頑張りが、あなたを動かす。', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
    { icon: '🏙️', title: 'マイタウン', desc: '走るたびに街が育つ。累計距離に応じて新しい施設がアンロックされる。', color: '#26C6DA', bg: 'rgba(38,198,218,0.08)' },
  ];


  return (
    <div style={{ background: '#F0EFF8', color: '#1A1A2E', fontFamily: "'Space Grotesk', sans-serif", minHeight: '100vh' }}>
        <style>{`.fixed.bottom-24.right-5 { display: none !important; }`}</style>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem 1.5rem', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <img src="/logo.png" alt="RunPlan" style={{ height: 40, objectFit: 'contain', objectPosition: 'left center' }}/>
        <a href="/login" style={{ background: 'linear-gradient(90deg,#FF3B8B,#FF6B9D)', color: 'white', fontWeight: 700, fontSize: '.8rem', padding: '9px 20px', borderRadius: '100px', textDecoration: 'none', boxShadow: '0 2px 12px rgba(255,59,139,0.3)', flexShrink: 0 }}>
          無料で始める
        </a>
      </nav>

      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg,#FFF5F8 0%,#FFE8F0 40%,#F0EFF8 100%)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(255,59,139,0.1)', border: '1px solid rgba(255,59,139,0.25)', color: '#FF3B8B', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', padding: '5px 14px', borderRadius: '100px', marginBottom: '1.25rem' }}>
          AIランニングコーチ × ソーシャル × マイタウン
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#1A1A2E', letterSpacing: '-0.03em' }}>
          走るたびに、街が育つ。<br/>
          <span style={{ color: '#FF3B8B' }}>仲間と共に、ゴールへ。</span>
        </h1>
        <p style={{ fontSize: '.9rem', color: '#6B6B8A', lineHeight: 1.8, marginBottom: '1.75rem' }}>
          AIコーチが、あなただけのトレーニング計画を作成。<br/>
          仲間の頑張りが、あなたを動かす。
        </p>
        <a href="/login" style={{ display: 'inline-block', background: 'linear-gradient(90deg,#FF3B8B,#FF6B9D)', color: 'white', fontWeight: 700, fontSize: '1rem', padding: '14px 36px', borderRadius: '100px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,59,139,0.35)' }}>
          無料でアカウントを作成
        </a>
        <p style={{ fontSize: '.72rem', color: '#A0A0BE', marginTop: '.6rem', marginBottom: '3rem' }}>クレジットカード不要・1分で完了</p>

        {/* スマホモックアップ */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup/>
        </div>
      </section>

      {/* アニメーション：機能紹介 */}
      <section style={{ padding: '3rem 1.5rem', background: '#1A1A2E' }}>
        <p style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#FF3B8B', marginBottom: '.75rem', textTransform: 'uppercase' }}>How it works</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem', color: 'white', letterSpacing: '-0.02em' }}>
          ランニングが、<span style={{ color: '#FF3B8B' }}>ゲームになる。</span>
        </h2>

        <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <div style={{ background: '#F0EFF8', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
            {scene === 0 && <CoachScreen/>}
            {scene === 1 && <SocialScreen/>}
            {scene === 2 && <TownScreen/>}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '.5rem' }}>
            {SCENES[scene].title}
          </h3>
          <p style={{ fontSize: '.875rem', color: '#7777A0' }}>{SCENES[scene].desc}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
          {SCENES.map((_, i) => (
            <div key={i} onClick={() => { setScene(i); setFadeIn(true); }}
              style={{ flex: i === scene ? 3 : 1, height: 4, borderRadius: 100, background: i === scene ? '#FF3B8B' : 'rgba(255,255,255,0.15)', transition: 'all 0.4s ease', cursor: 'pointer' }}/>
          ))}
        </div>
      </section>

      {/* 課題提起 */}
      <section style={{ padding: '3rem 1.5rem', background: '#F0EFF8' }}>
        <p style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#FF3B8B', marginBottom: '.75rem', textTransform: 'uppercase' }}>For serious runners</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1A1A2E', letterSpacing: '-0.02em' }}>
          もっと上を目指す<br/>ランナーのために。
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {[
            { icon: '📊', color: '#FF3B8B', text: '記録はしている。でも、次に何をすべきか分からない。' },
            { icon: '🗓️', color: '#F97316', text: 'アプリで距離は測れる。でも、大会に向けた計画は自分で作るしかない。' },
            { icon: '🏃', color: '#3B82F6', text: '走るのは好き。でも、一人だと限界がある。' },
          ].map((p, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: '1.125rem', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>{p.icon}</div>
              <p style={{ fontSize: '.875rem', color: '#444466', lineHeight: 1.7, paddingTop: 4 }}>{p.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg,#FF3B8B,#FF6B9D)', borderRadius: 16, padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>RunPlanは、その3つを一度に解決する。</p>
        </div>
      </section>

      {/* 機能紹介 */}
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <p style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#FF3B8B', marginBottom: '.75rem', textTransform: 'uppercase' }}>Features</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1A1A2E', letterSpacing: '-0.02em' }}>すべてが、ひとつのアプリに。</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: f.bg, borderRadius: 16, padding: '1.25rem', border: `1px solid ${f.color}22`, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.375rem', color: '#1A1A2E' }}>{f.title}</p>
                <p style={{ fontSize: '.8rem', color: '#6B6B8A', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ターゲット */}
      <section style={{ padding: '3rem 1.5rem', background: '#F0EFF8' }}>
        <p style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#FF3B8B', marginBottom: '.75rem', textTransform: 'uppercase' }}>For you</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.5rem', color: '#1A1A2E', letterSpacing: '-0.02em' }}>こんな人におすすめ</h2>
        <p style={{ fontSize: '.875rem', color: '#6B6B8A', marginBottom: '1.5rem', lineHeight: 1.7 }}>月間50〜100kmを走り、仲間とマラソンを目指すシティランナーのために作りました。</p>



        <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
          {targets.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.625rem 0', borderBottom: i < targets.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,59,139,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{t.icon}</div>
              <p style={{ fontSize: '.875rem', color: '#444466', lineHeight: 1.6 }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '3rem 1.5rem', background: '#1A1A2E', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="RunPlan" style={{ height: 40, objectFit: 'contain' }}/>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.75rem', color: 'white', letterSpacing: '-0.02em' }}>
          さあ、仲間と一緒に<br/>ゴールを目指そう。
        </h2>
        <p style={{ fontSize: '.875rem', color: '#7777A0', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          無料でアカウントを作成して、<br/>AIコーチと最初の一歩を踏み出す。
        </p>
        <a href="/login" style={{ display: 'inline-block', background: 'linear-gradient(90deg,#FF3B8B,#FF6B9D)', color: 'white', fontWeight: 700, fontSize: '1rem', padding: '16px 40px', borderRadius: '100px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,59,139,0.4)' }}>
          無料で始める →
        </a>
        <p style={{ fontSize: '.72rem', color: '#44445A', marginTop: '.75rem' }}>クレジットカード不要・1分で完了</p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '3rem 1.5rem 4rem', background: '#F0EFF8' }}>
        <p style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#FF3B8B', marginBottom: '.75rem', textTransform: 'uppercase' }}>FAQ</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1A1A2E', letterSpacing: '-0.02em' }}>よくある質問</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '.875rem', fontWeight: 700, color: '#1A1A2E', flex: 1, paddingRight: '1rem' }}>{faq.q}</span>
                <span style={{ color: '#FF3B8B', fontSize: '1.2rem', flexShrink: 0, display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 1.25rem 1rem', fontSize: '.875rem', color: '#6B6B8A', lineHeight: 1.7, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', background: '#1A1A2E', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.5rem' }}>
          <img src="/logo.png" alt="RunPlan" style={{ height: 40, objectFit: 'contain' }}/>
        </div>
        <p style={{ fontSize: '.72rem', color: '#44445A' }}>© 2026 RunPlan. All rights reserved.</p>
      </footer>

    </div>
  );
}