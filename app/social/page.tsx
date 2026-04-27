
// ─── Social Screen ───────────────────────────────────────────────────

const SocialScreen = () => {
  const t = useTheme();
  const [tab, setTab] = useState('feed');
  const [liked, setLiked] = useState({});
  const [commentOpen, setCommentOpen] = useState(null);

  const rankings = [
    { name: '田中', km: 142, runs: 14, streak: 12, me: false },
    { name: '小林', km: 128, runs: 11, streak: 8,  me: true  },
    { name: '鈴木', km: 98,  runs: 9,  streak: 5,  me: false },
    { name: '山本', km: 72,  runs: 7,  streak: 3,  me: false },
    { name: '佐藤', km: 45,  runs: 5,  streak: 1,  me: false },
  ];

  const feed = [
    {
      id: 1, user: '田中', time: '2時間前', type: 'run',
      title: 'LSD 18.2 km',
      stats: [['距離','18.2km'],['タイム','1:52:14'],['ペース',"6'10\"/km"]],
      comment: '今日も気持ちよく走れた！脚の調子がいい感じ 💪',
      likes: 3, comments: 1,
    },
    {
      id: 2, user: '鈴木', time: '5時間前', type: 'town',
      title: 'マイタウン アップデート',
      comment: 'ついにスタジアムが完成しました🏟️！312km達成！',
      likes: 5, comments: 2,
    },
    {
      id: 3, user: '山本', time: '昨日', type: 'run',
      title: 'インターバル走 8 km',
      stats: [['距離','8.0km'],['タイム','42:30'],['ペース',"5'19\"/km"]],
      comment: 'インターバルきつかった…でも終わった後の爽快感が最高',
      likes: 2, comments: 0,
    },
  ];

  const toggleLike = id => setLiked(l => ({ ...l, [id]: !l[id] }));

  const MedalIcon = ({ rank }) => {
    if (rank <= 3) return <span style={{ fontSize: 18 }}>{['🥇','🥈','🥉'][rank-1]}</span>;
    return <span style={{ fontSize: 13, fontWeight: 700, color: t.text3, width: 24, display:'inline-block', textAlign:'center' }}>{rank}</span>;
  };

  const podiumOrder  = [rankings[1], rankings[0], rankings[2]];
  const podiumHeights = [80, 104, 64];
  const podiumLabels  = ['2nd','1st','3rd'];
  const podiumColors  = ['rgba(192,192,192,0.2)','rgba(255,215,0,0.2)','rgba(205,127,50,0.2)'];
  const podiumBorder  = ['rgba(192,192,192,0.4)','rgba(255,215,0,0.4)','rgba(205,127,50,0.35)'];
  const medalColors   = ['#C0C0C0','#FFD700','#CD7F32'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: t.text, marginBottom: 12 }}>
          ソーシャル
        </div>
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${t.border}` }}>
          {[['feed','フィード'],['ranking','ランキング']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: '8px', border: 'none', background: 'none',
              color: tab === id ? t.accent : t.text3,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              borderBottom: tab === id ? `2px solid ${t.accent}` : '2px solid transparent',
              marginBottom: -1,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 0' }} className="hide-scroll">

        {/* ── Ranking ── */}
        {tab === 'ranking' && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {['今月','今週','累計'].map((p, i) => (
                <button key={p} style={{
                  padding: '5px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  background: i === 0 ? `${t.accent}1A` : t.isDark ? 'rgba(26,26,40,0.8)' : 'rgba(255,255,255,0.75)',
                  color: i === 0 ? t.accent : t.text2,
                  fontSize: 11, fontWeight: 600,
                  outline: i === 0 ? `1px solid ${t.accent}44` : `1px solid ${t.border}`,
                }}>{p}</button>
              ))}
            </div>

            {/* ── Game Scoreboard Podium (マイタウン統一トンマナ) ── */}
            <div style={{
              borderRadius: 14, overflow: 'hidden', marginBottom: 14,
              background: 'linear-gradient(180deg, #0C0A1E 0%, #161228 100%)',
              border: '1px solid rgba(255,215,0,0.15)',
            }}>
              {/* Cup banner */}
              <div style={{
                padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>🏆</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FFD700',
                  letterSpacing: '0.1em', opacity: 0.9 }}>4月 MONTHLY CUP</span>
                <span style={{ fontSize: 14 }}>🏆</span>
              </div>

              {/* Podium players */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                gap: 4, padding: '14px 10px 0', position: 'relative' }}>

                {/* 2nd place */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 18 }}>🥈</span>
                  <Avatar name={rankings[1].name} size={36}/>
                  {rankings[1].me && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: t.accent,
                      background: `${t.accent}22`, padding: '1px 7px', borderRadius: 4 }}>あなた</span>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C0C0C0' }}>{rankings[1].km}km</div>
                  <div style={{
                    width: '100%', height: 72,
                    background: 'linear-gradient(180deg, #5A5A78 0%, #3A3A58 100%)',
                    borderTop: '2px solid #9898B8',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'flex-start', paddingTop: 6,
                    /* pixel block edge */
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.15), inset -1px -1px 0 rgba(0,0,0,0.3)',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#C0C0C0' }}>2ND</span>
                  </div>
                </div>

                {/* 1st place */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 20, display: 'inline-block',
                    animation: 'crownBounce 2s ease-in-out infinite' }}>👑</span>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '2px solid #FFD700',
                    animation: 'podiumGlow 2.5s ease-in-out infinite',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,215,0,0.18)',
                    fontSize: 19, fontWeight: 800, color: '#FFD700',
                  }}>{rankings[0].name[0]}</div>
                  {rankings[0].me && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: t.accent,
                      background: `${t.accent}22`, padding: '1px 7px', borderRadius: 4 }}>あなた</span>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#FFD700' }}>{rankings[0].km}km</div>
                  <div style={{
                    width: '100%', height: 106,
                    background: 'linear-gradient(180deg, #B8900A 0%, #8A6800 60%, #6A5000 100%)',
                    borderTop: '2px solid #FFD700',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'flex-start', paddingTop: 8, gap: 6,
                    boxShadow: '0 -4px 16px rgba(255,215,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.2)',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#5A3800' }}>1ST</span>
                    <span style={{ fontSize: 26 }}>🏆</span>
                  </div>
                </div>

                {/* 3rd place */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: 18 }}>🥉</span>
                  <Avatar name={rankings[2].name} size={34}/>
                  {rankings[2].me && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: t.accent,
                      background: `${t.accent}22`, padding: '1px 7px', borderRadius: 4 }}>あなた</span>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#CD7F32' }}>{rankings[2].km}km</div>
                  <div style={{
                    width: '100%', height: 54,
                    background: 'linear-gradient(180deg, #7A4A18 0%, #5A3410 100%)',
                    borderTop: '2px solid #CD7F32',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'flex-start', paddingTop: 5,
                    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.12)',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#CD7F32' }}>3RD</span>
                  </div>
                </div>
              </div>

              {/* Bottom rule */}
              <div style={{ height: 1, background: 'rgba(255,215,0,0.1)', margin: '0 14px' }}/>
              <div style={{ padding: '6px 14px 8px', textAlign: 'center' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,215,0,0.4)', letterSpacing: '0.08em' }}>
                  次のカップまで 3日
                </span>
              </div>
            </div>

            {/* Full list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {rankings.map((r, i) => (
                <div key={r.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 12,
                  background: r.me ? `${t.accent}0C` : t.cardBg,
                  border: `1px solid ${r.me ? t.borderAccent : t.border}`,
                  boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
                }}>
                  <MedalIcon rank={i+1}/>
                  <Avatar name={r.name} size={34}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: r.me ? 700 : 600,
                      color: r.me ? t.accent : t.text }}>
                      {r.name}{r.me ? '（あなた）' : ''}
                    </div>
                    <div style={{ fontSize: 11, color: t.text3 }}>{r.runs}回 · {r.streak}日連続</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: r.me ? t.accent : t.text, letterSpacing: '-0.03em' }}>
                    {r.km}<span style={{ fontSize: 11, color: t.text3, fontWeight: 400 }}>km</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Feed ── */}
        {tab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {feed.map(item => (
              <Card key={item.id} style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar name={item.user} size={36}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{item.user}さん</div>
                    <div style={{ fontSize: 11, color: t.text3 }}>{item.time}</div>
                  </div>
                  <Pill color={item.type === 'run' ? t.accent : t.accent3}
                    bg={item.type === 'run' ? `${t.accent}18` : `${t.accent3}18`}>
                    {item.type === 'run' ? '🏃 ラン' : '🏟️ タウン'}
                  </Pill>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 8 }}>{item.title}</div>

                {item.stats && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {item.stats.map(([label, val]) => (
                      <div key={label} style={{ flex: 1, background: t.statsBg, borderRadius: 8, padding: '6px 8px' }}>
                        <div style={{ fontSize: 10, color: t.text3, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{val}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: 12, color: t.text2, lineHeight: 1.6, marginBottom: 10 }}>{item.comment}</div>

                <div style={{ display: 'flex', gap: 14, borderTop: `1px solid ${t.separatorColor}`, paddingTop: 10 }}>
                  <button onClick={() => toggleLike(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: liked[item.id] ? t.danger : t.text3, fontSize: 12, fontWeight: 600,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24"
                      fill={liked[item.id] ? t.danger : 'none'}
                      stroke={liked[item.id] ? t.danger : t.text3}
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                    {item.likes + (liked[item.id] ? 1 : 0)}
                  </button>
                  <button onClick={() => setCommentOpen(commentOpen === item.id ? null : item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: t.text3, fontSize: 12, fontWeight: 600,
                  }}>
                    <Icon name="message" size={16} color={t.text3}/>
                    {item.comments}
                  </button>
                </div>

                {commentOpen === item.id && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <input placeholder="コメントを追加…" style={{
                      flex: 1, padding: '8px 12px', borderRadius: 20,
                      background: t.inputBg, border: `1px solid ${t.border}`,
                      color: t.text, fontSize: 12, outline: 'none',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}/>
                    <button style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: `${t.accent}22`, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="send" size={14} color={t.accent}/>
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        <div style={{ height: 20 }}/>
      </div>
    </div>
  );
};

Object.assign(window, { SocialScreen });
