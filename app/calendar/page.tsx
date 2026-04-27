
// ─── Calendar Screen ─────────────────────────────────────────────────

const CalendarScreen = () => {
  const t = useTheme();
  const [view, setView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(27);

  const weekDays = ['日','月','火','水','木','金','土'];
  const firstDay = 3;
  const daysInMonth = 30;
  const today = 27;

  const trainingData = {
    2:  { type: 'done',   label: 'ジョグ', km: 8,  detail: 'イージーラン' },
    4:  { type: 'done',   label: 'テンポ走', km: 12, detail: 'LT強化' },
    6:  { type: 'done',   label: 'LSD', km: 18, detail: '持久力強化' },
    9:  { type: 'done',   label: 'ジョグ', km: 6,  detail: 'リカバリー' },
    11: { type: 'done',   label: 'インターバル', km: 10, detail: 'VO2max強化' },
    13: { type: 'done',   label: 'LSD', km: 20, detail: '持久力強化' },
    16: { type: 'missed', label: 'ジョグ', km: 8,  detail: 'リカバリー' },
    18: { type: 'done',   label: 'テンポ走', km: 12, detail: 'LT強化' },
    20: { type: 'done',   label: 'LSD', km: 16, detail: '持久力強化' },
    23: { type: 'done',   label: 'ジョグ', km: 8,  detail: 'リカバリー' },
    25: { type: 'done',   label: 'インターバル', km: 10, detail: 'VO2max強化' },
    27: { type: 'today',  label: 'LSD', km: 18, detail: '持久力強化' },
    28: { type: 'plan',   label: 'レスト', km: 0,  detail: '回復日' },
    29: { type: 'plan',   label: 'ジョグ', km: 8,  detail: 'リカバリー' },
    30: { type: 'plan',   label: 'テンポ走', km: 12, detail: 'LT強化' },
  };

  const weatherData = {
    27: { icon: '☁️', temp: 14 },
    28: { icon: '🌤', temp: 16 },
    29: { icon: '🌧', temp: 12 },
    30: { icon: '🌦', temp: 13 },
  };

  const typeColors = {
    done:   t.doneColor,
    today:  t.todayColor,
    plan:   t.planColor,
    missed: t.missedColor,
  };

  // Monthly week plan
  const weeklyPlan = [
    { week: 'W1', dates: '3/30–4/5',  plan: 40, actual: 40, done: true,  sessions: 'ジョグ+テンポ+LSD' },
    { week: 'W2', dates: '4/6–12',    plan: 44, actual: 44, done: true,  sessions: 'ジョグ+インターバル+LSD' },
    { week: 'W3', dates: '4/13–19',   plan: 44, actual: 36, done: false, sessions: 'テンポ+インターバル+LSD' },
    { week: 'W4', dates: '4/20–26',   plan: 42, actual: 28, done: false, sessions: 'ジョグ+LSD（今週）' },
  ];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ height: '100%', overflowY: 'auto' }} className="hide-scroll">
      {/* Header */}
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: t.text }}>2026年 4月</div>
          <div style={{ fontSize: 12, color: t.text2, marginTop: 1 }}>東京マラソンまで 243日</div>
        </div>
        <div style={{ display: 'flex',
          background: t.isDark ? 'rgba(26,26,40,0.9)' : 'rgba(255,255,255,0.85)',
          border: `1px solid ${t.border}`, borderRadius: 10, padding: 3 }}>
          {['month','week'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 14px', borderRadius: 8, border: 'none',
              background: view === v ? `${t.accent}22` : 'transparent',
              color: view === v ? t.accent : t.text2,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{v === 'month' ? '月' : '週'}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '8px 20px 0', display: 'flex', gap: 14 }}>
        {[['done','完了'],['plan','予定'],['missed','未達'],['today','今日']].map(([type, label]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[type] }}/>
            <span style={{ fontSize: 10, color: t.text3 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ padding: '10px 14px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
          {weekDays.map((d,i) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, padding: '3px 0', fontWeight: 600,
              color: i === 0 ? t.danger : i === 6 ? t.accent2 : t.text3 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i}/>;
            const td = trainingData[day];
            const isSelected = day === selectedDay;
            const dotColor = td ? typeColors[td.type] : null;
            const weather = weatherData[day];
            return (
              <div key={i} onClick={() => setSelectedDay(day)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '5px 2px', borderRadius: 10, cursor: 'pointer', minHeight: 56,
                background: isSelected ? `${t.accent}16` : 'transparent',
                border: isSelected ? `1px solid ${t.accent}44` : '1px solid transparent',
              }}>
                <span style={{
                  fontSize: 15, fontWeight: day === today ? 700 : 400,
                  color: day === today ? t.todayColor : day < today ? t.text : t.text2,
                }}>{day}</span>
                {dotColor && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor,
                    margin: '2px 0', boxShadow: `0 0 5px ${dotColor}70` }}/>
                )}
                {weather && <span style={{ fontSize: 13 }}>{weather.icon}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Today's motivational training card ── */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          background: t.isDark
            ? 'linear-gradient(135deg, rgba(197,255,71,0.08), rgba(71,184,255,0.06))'
            : 'linear-gradient(135deg, rgba(74,120,210,0.08), rgba(40,176,132,0.06))',
          border: `1px solid ${t.borderAccent}`,
          boxShadow: t.isDark ? 'none' : '0 3px 16px rgba(74,120,210,0.12)',
        }}>
          {/* Header strip */}
          <div style={{
            padding: '10px 14px 8px',
            background: t.isDark
              ? 'linear-gradient(90deg, rgba(197,255,71,0.12), rgba(71,184,255,0.08))'
              : 'linear-gradient(90deg, rgba(74,120,210,0.12), rgba(40,176,132,0.08))',
            borderBottom: `1px solid ${t.borderAccent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <div>
                <div style={{ fontSize: 10, color: t.text3, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  4月27日（月）今日のトレーニング
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.text, letterSpacing: '-0.02em' }}>
                  LSD — Long Slow Distance
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 22 }}>☁️</div>
              <div style={{ fontSize: 11, color: t.text2 }}>14°C</div>
            </div>
          </div>

          {/* Main stats */}
          <div style={{ padding: '10px 14px 0' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {[
                { label: '距離', value: '18 km', color: t.accent },
                { label: 'ペース', value: "6'30\"/km", color: t.accent2 },
                { label: '想定時間', value: '1h 57m', color: t.accent3 || t.danger },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, padding: '8px 8px 7px',
                  background: t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                  borderRadius: 10, border: `1px solid ${t.border}`, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: t.text3, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Motivational message */}
            <div style={{
              padding: '9px 12px', borderRadius: 10,
              background: t.isDark ? 'rgba(197,255,71,0.06)' : 'rgba(74,120,210,0.07)',
              border: `1px solid ${t.borderAccent}`,
              marginBottom: 10,
            }}>
              <div style={{ fontSize: 12, color: t.text, lineHeight: 1.65, fontStyle: 'italic' }}>
                💬 「LSDは体脂肪燃焼と有酸素基盤づくりに最適。会話できるくらいのペースで、じっくり距離を稼ごう。今日の18kmは東京マラソン完走への大きな一歩！」
              </div>
            </div>

            {/* HR zone + tips */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{
                flex: 1, padding: '7px 10px', borderRadius: 10,
                background: t.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${t.border}`,
              }}>
                <div style={{ fontSize: 10, color: t.text3, marginBottom: 2 }}>心拍ゾーン</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.accent2 }}>Zone 2</div>
                <div style={{ fontSize: 10, color: t.text3 }}>最大心拍の 65–75%</div>
              </div>
              <div style={{
                flex: 1, padding: '7px 10px', borderRadius: 10,
                background: t.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${t.border}`,
              }}>
                <div style={{ fontSize: 10, color: t.text3, marginBottom: 2 }}>推奨コース</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>平坦ルート</div>
                <div style={{ fontSize: 10, color: t.text3 }}>アップダウン少なめ</div>
              </div>
              <div style={{
                flex: 1, padding: '7px 10px', borderRadius: 10,
                background: t.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${t.border}`,
              }}>
                <div style={{ fontSize: 10, color: t.text3, marginBottom: 2 }}>補給</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.accent3 || t.danger }}>10km以降</div>
                <div style={{ fontSize: 10, color: t.text3 }}>ジェル1本推奨</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Monthly training plan ── */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{ fontSize: 11, color: t.text3, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: 8 }}>4月 月間計画</div>
        <div style={{
          background: t.cardBg, border: `1px solid ${t.border}`,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: t.isDark ? 'none' : '0 2px 10px rgba(30,60,120,0.07)',
        }}>
          {/* Total progress — game XP style */}
          <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${t.separatorColor}` }}>
            {/* Row 1: Level badge + distance + streak */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Level badge */}
                <div style={{
                  padding: '4px 9px', borderRadius: 6,
                  background: t.isDark
                    ? 'linear-gradient(135deg, #C5FF47, #47B8FF)'
                    : 'linear-gradient(135deg, #4A78D2, #28B084)',
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
                  color: t.isDark ? '#08080F' : '#FFF',
                  animation: 'lvBounce 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                }}>LV.4</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: t.accent, letterSpacing: '-0.04em' }}>128</span>
                  <span style={{ fontSize: 12, color: t.text2 }}>/ 170 km</span>
                </div>
              </div>
              {/* Streak pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 99,
                background: 'rgba(255,120,0,0.12)',
                border: '1px solid rgba(255,120,0,0.28)',
              }}>
                <span style={{ fontSize: 16, display: 'inline-block', animation: 'flamePulse 1.6s ease-in-out infinite' }}>🔥</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#FF7800' }}>12</span>
                <span style={{ fontSize: 10, color: t.text3 }}>日連続</span>
              </div>
            </div>

            {/* XP bar with milestone markers */}
            <div style={{ position: 'relative', paddingBottom: 18 }}>
              {/* Milestone markers (above bar) */}
              {[{km:50,pct:29,icon:'🏅',done:true},{km:100,pct:59,icon:'⭐',done:true},{km:150,pct:88,icon:'🎯',done:false}].map(m => (
                <div key={m.km} style={{
                  position: 'absolute', top: 0, left: `${m.pct}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  zIndex: 2,
                }}>
                  <span style={{ fontSize: 13, filter: m.done ? 'none' : 'grayscale(0.6)', opacity: m.done ? 1 : 0.45 }}>{m.icon}</span>
                </div>
              ))}

              {/* Bar track */}
              <div style={{
                height: 16, marginTop: 18,
                background: t.progressBg,
                borderRadius: 4, overflow: 'hidden', position: 'relative',
              }}>
                {/* Segment lines */}
                {[25,50,75].map(pct => (
                  <div key={pct} style={{
                    position: 'absolute', left: `${pct}%`, top: 0,
                    width: 1, height: '100%',
                    background: t.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    zIndex: 2,
                  }}/>
                ))}
                {/* Fill */}
                <div style={{
                  width: '75%', height: '100%', borderRadius: 3,
                  background: t.isDark
                    ? 'linear-gradient(90deg, #C5FF47 0%, #47B8FF 100%)'
                    : 'linear-gradient(90deg, #4A78D2 0%, #28B084 100%)',
                  animation: 'xpFill 1.2s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Shine sweep */}
                  <div style={{
                    position: 'absolute', top: 0, width: '45%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                    animation: 'shineSweep 3.5s ease-in-out infinite',
                  }}/>
                  {/* Inner highlight */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
                    background: 'rgba(255,255,255,0.2)', borderRadius: '3px 3px 0 0' }}/>
                </div>
                {/* Current position marker */}
                <div style={{
                  position: 'absolute', top: -3, left: '75%',
                  transform: 'translateX(-50%)',
                  width: 6, height: 22, borderRadius: 3,
                  background: t.isDark ? '#EEEEF8' : '#1A2440',
                  boxShadow: `0 0 8px ${t.accent}`,
                }}/>
              </div>

              {/* Milestone labels (below bar) */}
              <div style={{ position: 'relative', height: 16, marginTop: 4 }}>
                {[{km:50,pct:29},{km:100,pct:59},{km:150,pct:88},{km:170,pct:100}].map(m => (
                  <span key={m.km} style={{
                    position: 'absolute', left: `${m.pct}%`,
                    transform: 'translateX(-50%)',
                    fontSize: 9, color: t.text3, whiteSpace: 'nowrap',
                  }}>{m.km}km</span>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              {[['75%','達成率', t.accent],['42km','残り', t.text2],['3週','残り', t.text3]].map(([val,label,color]) => (
                <div key={label} style={{
                  flex: 1, textAlign: 'center', padding: '6px 4px',
                  background: t.statsBg, borderRadius: 8,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color, letterSpacing: '-0.02em' }}>{val}</div>
                  <div style={{ fontSize: 10, color: t.text3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Week breakdown */}
          <div style={{ padding: '8px 0' }}>
            {weeklyPlan.map((w, i) => {
              const pct = Math.round((w.actual / w.plan) * 100);
              const isCurrentWeek = i === 3;
              return (
                <div key={i} style={{
                  padding: '7px 14px',
                  background: isCurrentWeek ? `${t.accent}08` : 'transparent',
                  borderLeft: isCurrentWeek ? `3px solid ${t.accent}` : '3px solid transparent',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isCurrentWeek ? t.accent : t.text2,
                      minWidth: 22 }}>{w.week}</span>
                    <span style={{ fontSize: 10, color: t.text3, flex: 1 }}>{w.dates} · {w.sessions}</span>
                    <span style={{ fontSize: 11, fontWeight: 600,
                      color: w.done ? t.doneColor : isCurrentWeek ? t.accent : t.text2 }}>
                      {w.actual}/{w.plan}km
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600,
                      color: w.done ? t.doneColor : isCurrentWeek ? t.accent : t.text3,
                      minWidth: 30, textAlign: 'right' }}>{pct}%</span>
                  </div>
                  <ProgressBar value={w.actual} max={w.plan} height={3}
                    color={w.done ? t.doneColor : isCurrentWeek ? t.accent : t.planColor}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ height: 20 }}/>
    </div>
  );
};

Object.assign(window, { CalendarScreen });
