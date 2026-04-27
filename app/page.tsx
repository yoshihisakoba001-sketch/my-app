
// ─── Home Screen ─────────────────────────────────────────────────────

const HomeScreen = ({ onNavigate }) => {
  const t = useTheme();

  const feedItems = [
    { user: '田中', action: '18kmのLSDランを完走！', time: '2時間前', emoji: '🔥' },
    { user: '鈴木', action: 'マイタウンでスタジアムをアンロック！', time: '5時間前', emoji: '🏟️' },
    { user: '山本', action: '朝ラン 5km テンポ走', time: '昨日', emoji: '⚡' },
  ];

  const DarkTown = () => (
    <svg viewBox="0 0 340 90" style={{ width: '100%', height: 90 }}>
      <defs>
        <linearGradient id="msky_d" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#08081A"/><stop offset="100%" stopColor="#12122A"/>
        </linearGradient>
      </defs>
      <rect width="340" height="90" fill="url(#msky_d)"/>
      <rect x="0" y="68" width="340" height="22" fill="#0D1A0D"/>
      <rect x="0" y="70" width="340" height="10" fill="#181828"/>
      {[0,30,60,90,120,160,200,240,290].map(x => <rect key={x} x={x} y={74} width={20} height={2} fill="#2A2A48"/>)}
      <rect x="8" y="42" width="22" height="30" fill="#141428" rx="1"/>
      <rect x="14" y="47" width="4" height="4" fill="#C5FF47" opacity="0.5"/>
      <rect x="20" y="47" width="4" height="4" fill="#C5FF47" opacity="0.3"/>
      <rect x="36" y="30" width="28" height="42" fill="#1C1C35" rx="1"/>
      <rect x="40" y="35" width="5" height="5" fill="#C5FF47" opacity="0.7"/>
      <rect x="48" y="35" width="5" height="5" fill="#C5FF47" opacity="0.4"/>
      <rect x="56" y="35" width="5" height="5" fill="#47B8FF" opacity="0.3"/>
      <rect x="40" y="44" width="5" height="5" fill="#47B8FF" opacity="0.5"/>
      <rect x="48" y="44" width="5" height="5" fill="#C5FF47" opacity="0.6"/>
      <rect x="72" y="55" width="38" height="17" fill="#0F2010"/>
      <circle cx="83" cy="55" r="6" fill="#1A4020"/>
      <circle cx="97" cy="56" r="5" fill="#183818"/>
      <circle cx="107" cy="55" r="5" fill="#1E4828"/>
      <rect x="118" y="38" width="24" height="34" fill="#1A1A32" rx="1"/>
      <rect x="122" y="43" width="5" height="5" fill="#C5FF47" opacity="0.8"/>
      <rect x="130" y="43" width="5" height="5" fill="#C5FF47" opacity="0.5"/>
      <rect x="148" y="24" width="32" height="48" fill="#20203C" rx="1"/>
      <rect x="153" y="29" width="6" height="6" fill="#C5FF47" opacity="0.9"/>
      <rect x="163" y="29" width="6" height="6" fill="#47B8FF" opacity="0.7"/>
      <rect x="153" y="39" width="6" height="6" fill="#C5FF47" opacity="0.5"/>
      <rect x="163" y="39" width="6" height="6" fill="#C5FF47" opacity="0.8"/>
      <rect x="153" y="49" width="6" height="6" fill="#47B8FF" opacity="0.4"/>
      <rect x="163" y="49" width="6" height="6" fill="#C5FF47" opacity="0.6"/>
      <rect x="190" y="60" width="60" height="12" fill="#0A1A2A" rx="2"/>
      <path d="M190 63 Q210 60 230 63 Q250 66 270 63" stroke="#1A3A5A" strokeWidth="1.5" fill="none"/>
      <rect x="200" y="42" width="20" height="30" fill="#181830" rx="1"/>
      <rect x="228" y="35" width="26" height="37" fill="#1C1C38" rx="1"/>
      <rect x="232" y="40" width="5" height="5" fill="#C5FF47" opacity="0.7"/>
      <rect x="241" y="40" width="5" height="5" fill="#C5FF47" opacity="0.4"/>
      <ellipse cx="295" cy="52" rx="28" ry="16" fill="none" stroke="#C5FF47" strokeWidth="1" opacity="0.3" strokeDasharray="3 2"/>
      <text x="295" y="56" textAnchor="middle" fontSize="7" fill="#C5FF47" opacity="0.4" fontFamily="Space Grotesk">STADIUM</text>
      {[[180,12],[45,8],[130,6],[320,10],[260,5]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={0.8} fill="#EEEEF8" opacity="0.5"/>)}
    </svg>
  );

  // Mini Minecraft day town
  const LightTown = () => (
    <svg viewBox="0 0 340 90" style={{ width: '100%', height: 90 }}>
      {/* Sky */}
      <rect width="340" height="90" fill="#7EC4E8"/>
      {/* Sun */}
      <rect x="296" y="6" width="18" height="18" fill="#FFE040"/>
      <rect x="299" y="9" width="12" height="12" fill="#FFD000"/>
      {/* Clouds */}
      <rect x="18" y="8"  width="40" height="8" fill="#F8F8F8"/>
      <rect x="14" y="12" width="48" height="6" fill="#F8F8F8"/>
      <rect x="160" y="6"  width="44" height="7" fill="#EFEFEF"/>
      <rect x="156" y="11" width="52" height="6" fill="#EFEFEF"/>
      {/* Grass */}
      <rect x="0" y="68" width="340" height="8" fill="#5AA82A"/>
      {[0,16,32,48,64,80,96,112,128,160,192,224,256,288,320].map(x => (
        <rect key={x} x={x} y={68} width={6} height={4} fill="#4A9020" opacity="0.5"/>
      ))}
      {/* Dirt + road */}
      <rect x="0" y="76" width="340" height="14" fill="#8B6432"/>
      <rect x="0" y="76" width="340" height="9"  fill="#8A8A98"/>
      {[4,32,60,88,116,144,172,200,228,256,284,312].map(x => (
        <rect key={x} x={x} y={79} width={16} height={3} fill="#AAAACC" opacity="0.6"/>
      ))}
      {/* Park */}
      <rect x="2" y="62" width="44" height="8" fill="#38900C"/>
      {/* Tree 1 (mini pixel) */}
      <rect x="5"  y="56" width="4" height="8" fill="#6A4018"/>
      <rect x="1"  y="50" width="12" height="8" fill="#2A5E10"/>
      <rect x="3"  y="44" width="8"  height="7" fill="#387818"/>
      {/* Tree 2 */}
      <rect x="28" y="57" width="4" height="7" fill="#6A4018"/>
      <rect x="24" y="51" width="12" height="7" fill="#2A5E10"/>
      <rect x="26" y="46" width="8"  height="6" fill="#387818"/>
      {/* Stone tower */}
      <rect x="52" y="22" width="36" height="48" fill="#6E6E7A"/>
      {[0,8,16,24,32,40].map(i => <rect key={i} x={52} y={22+i} width={36} height={1} fill="#505060" opacity="0.5"/>)}
      {[52,64,76].map(x => <rect key={x} x={x} y={14} width={8} height={10} fill="#6E6E7A"/>)}
      <rect x="52" y="22" width="36" height="2" fill="#505060"/>
      {[0,1,2].map(col => [0,1,2].map(row => (
        <rect key={`t${col}-${row}`} x={57+col*10} y={26+row*13} width={7} height={9}
          fill={col===1&&row===1?'#FFD060':'#90B8D8'} opacity="0.8"/>
      )))}
      {/* Brick building */}
      <rect x="94" y="34" width="28" height="36" fill="#B85040"/>
      {[0,8,16,24,32].map(i => <rect key={i} x={94} y={34+i} width={28} height={1} fill="#983830" opacity="0.5"/>)}
      {[0,1].map(col => [0,1].map(row => (
        <rect key={`b${col}-${row}`} x={99+col*12} y={40+row*13} width={8} height={8} fill="#D4C870" opacity="0.75"/>
      )))}
      {/* Glass tower */}
      <rect x="128" y="16" width="28" height="54" fill="#6898C8"/>
      {[0,8,16,24,32,40,48].map(i => <rect key={i} x={128} y={16+i} width={28} height={1} fill="#5080B0" opacity="0.4"/>)}
      {[0,1].map(col => [0,1,2,3].map(row => (
        <rect key={`g${col}-${row}`} x={133+col*11} y={22+row*12} width={8} height={8} fill="#A8D0F0" opacity="0.65"/>
      )))}
      <rect x="126" y="12" width="32" height="5" fill="#5080B0"/>
      {/* River */}
      <rect x="162" y="60" width="52" height="10" fill="#4A8CD4"/>
      {[162,178,194,208].map(x => <rect key={x} x={x} y={60} width={12} height={10} fill="#5898DC" opacity="0.5"/>)}
      {/* Bridge */}
      <rect x="176" y="56" width="24" height="6" fill="#888898"/>
      {/* Small houses */}
      <rect x="222" y="52" width="20" height="18" fill="#BC9448"/>
      <rect x="222" y="44" width="20" height="10" fill="#8A2020"/>
      <rect x="226" y="56" width="6"  height="6"  fill="#90C4E0" opacity="0.7"/>
      <rect x="248" y="54" width="18" height="16" fill="#A88040"/>
      <rect x="248" y="46" width="18" height="10" fill="#203878"/>
      <rect x="252" y="58" width="6"  height="6"  fill="#90C4E0" opacity="0.7"/>
      {/* Stadium locked */}
      <rect x="276" y="50" width="32" height="3"  fill="#906030" opacity="0.4"/>
      <rect x="276" y="67" width="32" height="3"  fill="#906030" opacity="0.4"/>
      <rect x="276" y="50" width="3"  height="20" fill="#906030" opacity="0.4"/>
      <rect x="305" y="50" width="3"  height="20" fill="#906030" opacity="0.4"/>
      <text x="292" y="63" textAnchor="middle" fontSize="6" fill="#906030" opacity="0.6"
        fontFamily="Space Grotesk" fontWeight="700">🔒 STADIUM</text>
    </svg>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }} className="hide-scroll">
      {/* Hero */}
      <div style={{ padding: '12px 20px 20px',
        background: `linear-gradient(180deg, ${t.heroBg} 0%, transparent 100%)`,
        borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <Pill>🏆 東京マラソン 2027</Pill>
          <span style={{ fontSize: 11, color: t.text3 }}>フルマラソン</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 72, fontWeight: 700, color: t.accent, lineHeight: 1, letterSpacing: '-0.04em' }}>243</span>
          <span style={{ fontSize: 20, color: t.text2, fontWeight: 500 }}>日</span>
        </div>
        <div style={{ fontSize: 13, color: t.text2 }}>2027年3月1日（日） · 東京都庁前スタート</div>
      </div>

      {/* Next training */}
      <div style={{ padding: '16px 20px 0' }}>
        <SectionLabel>今日のトレーニング</SectionLabel>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12,
            background: `${t.accent}18`, border: `1px solid ${t.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="zap" size={22} color={t.accent}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: t.text, marginBottom: 3 }}>LSD — 18 km</div>
            <div style={{ fontSize: 12, color: t.text2 }}>ゆっくりペース 6:30/km · 約1時間57分</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22 }}>☁️</div>
            <div style={{ fontSize: 11, color: t.text2 }}>14°C</div>
          </div>
        </Card>
      </div>

      {/* Weekly progress */}
      <div style={{ padding: '16px 20px 0' }}>
        <SectionLabel>今週の進捗</SectionLabel>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 28, fontWeight: 700, color: t.text, letterSpacing: '-0.03em' }}>28</span>
              <span style={{ fontSize: 13, color: t.text2, marginLeft: 3 }}>/ 42 km</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>67%</span>
              <div style={{ fontSize: 11, color: t.text2 }}>達成率</div>
            </div>
          </div>
          <ProgressBar value={28} max={42} height={6}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            {['月','火','水','木','金','土','日'].map((d, i) => {
              const states = ['done','done','done','today','plan','rest','plan'];
              const colors = {
                done: t.accent, today: t.accent2,
                plan: t.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                rest: t.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              };
              return (
                <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: colors[states[i]],
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {states[i] === 'done' && <Icon name="check" size={14} color={t.accentText} strokeWidth={3}/>}
                    {states[i] === 'today' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.accentText }}/>}
                  </div>
                  <span style={{ fontSize: 10, color: i === 3 ? t.accent2 : t.text3 }}>{d}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Mini town */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <SectionLabel>マイタウン</SectionLabel>
          <button onClick={() => onNavigate('town')} style={{ background: 'none', border: 'none',
            color: t.accent, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 3 }}>
            全景を見る <Icon name="chevronRight" size={12} color={t.accent}/>
          </button>
        </div>
        <Card style={{ padding: '10px 10px 6px', overflow: 'hidden' }}>
          {t.isDark ? <DarkTown/> : <LightTown/>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, padding: '4px 4px 0' }}>
            <div style={{ fontSize: 12, color: t.text2 }}>
              累計 <span style={{ color: t.accent, fontWeight: 600 }}>284 km</span>
            </div>
            <Pill color={t.accent3} bg={`${t.accent3}18`}>🏟️ スタジアムまで 16km</Pill>
          </div>
        </Card>
      </div>

      {/* Feed */}
      <div style={{ padding: '16px 20px 0' }}>
        <SectionLabel>グループの活動</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {feedItems.map((item, i) => (
            <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <Avatar name={item.user} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  <span style={{ color: t.accent }}>{item.user}</span>
                  <span style={{ color: t.text }}> さん</span>
                </div>
                <div style={{ fontSize: 12, color: t.text2 }}>{item.action}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 18 }}>{item.emoji}</div>
                <div style={{ fontSize: 10, color: t.text3 }}>{item.time}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ height: 20 }}/>
    </div>
  );
};

Object.assign(window, { HomeScreen });
