
// ─── AI Plan Screen ──────────────────────────────────────────────────

const PlanScreen = () => {
  const t = useTheme();
  const [input, setInput] = useState('');

  const planData = [
    { month: '5月', phase: 'ベース構築', weekly: '35km', longRun: '16km' },
    { month: '6月', phase: 'ベース構築', weekly: '42km', longRun: '20km' },
    { month: '7月', phase: '有酸素強化', weekly: '48km', longRun: '22km' },
    { month: '8月', phase: '有酸素強化', weekly: '50km', longRun: '24km' },
    { month: '9月', phase: 'スピード強化', weekly: '52km', longRun: '26km' },
    { month: '10月', phase: 'スピード強化', weekly: '55km', longRun: '28km' },
    { month: '11月', phase: 'ピーク', weekly: '58km', longRun: '30km' },
    { month: '12月', phase: 'ピーク', weekly: '55km', longRun: '32km' },
    { month: '1月', phase: '最終仕上げ', weekly: '48km', longRun: '30km' },
    { month: '2月', phase: 'テーパリング', weekly: '35km', longRun: '21km' },
    { month: '3月', phase: 'レース', weekly: '20km', longRun: '—' },
  ];

  const messages = [
    { role: 'ai', text: 'こんにちは！RunPlan AIコーチです 🏃\nまず目標レースを教えてください。' },
    { role: 'user', text: '2027年3月の東京マラソンを完走したいです！' },
    { role: 'ai', text: '素晴らしい目標ですね！東京マラソンは世界6大メジャーのひとつ。\n現在の月間走行距離はどのくらいですか？' },
    { role: 'user', text: '月100kmくらいです。週3〜4日走ってます。' },
    { role: 'ai', text: null, isPlan: true },
    { role: 'user', text: 'もう少しゆるめにしてほしいです。8月が夏で大変そうで…' },
    { role: 'ai', text: '了解です！夏場（7〜8月）の負荷を下げて、涼しくなる9月から段階的に上げる形に調整しました。無理せず継続できるペースが一番大切ですよ 👍', isAdjust: true },
  ];

  const PlanCard = () => (
    <div style={{
      background: t.isDark ? 'rgba(197,255,71,0.05)' : 'rgba(232,87,10,0.04)',
      border: `1px solid ${t.borderAccent}`,
      borderRadius: 14, padding: '14px', marginTop: 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon name="zap" size={16} color={t.accent}/>
        <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>東京マラソン2027 トレーニングプラン</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${t.border}` }}>
            {['月', 'フェーズ', '週間', 'ロング'].map(h => (
              <th key={h} style={{ padding: '4px 6px', color: t.text3, fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planData.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${t.separatorColor}` }}>
              <td style={{ padding: '5px 6px', fontWeight: 600, color: t.text, whiteSpace: 'nowrap' }}>{row.month}</td>
              <td style={{ padding: '5px 6px', color: t.text2, fontSize: 10, whiteSpace: 'nowrap' }}>{row.phase}</td>
              <td style={{ padding: '5px 6px', color: t.accent2, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.weekly}</td>
              <td style={{ padding: '5px 6px', color: t.accent, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.longRun}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{
        width: '100%', marginTop: 12, padding: '10px',
        background: t.buttonGradient, border: 'none', borderRadius: 10,
        fontSize: 13, fontWeight: 700, color: t.accentText, cursor: 'pointer',
      }}>このプランでカレンダーに保存 →</button>
    </div>
  );

  const aiBubbleBg = t.isDark ? 'rgba(26,26,40,0.9)' : 'rgba(255,255,255,0.9)';
  const userBubbleBg = t.isDark ? 'rgba(197,255,71,0.13)' : 'rgba(232,87,10,0.1)';
  const userBubbleBorder = t.isDark ? 'rgba(197,255,71,0.25)' : 'rgba(232,87,10,0.22)';

  const quickReplies = ['もっとゆるめに', '週2日に減らして', 'このまま確定'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: t.text }}>AI プランナー</div>
        <div style={{ fontSize: 12, color: t.text2, marginTop: 2 }}>目標から逆算した計画を自動生成</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }} className="hide-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%',
                    background: t.isDark
                      ? 'linear-gradient(135deg, #C5FF47, #47B8FF)'
                      : 'linear-gradient(135deg, #E8570A, #0080E0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="zap" size={12} color="#FFF" strokeWidth={2.5}/>
                  </div>
                  <span style={{ fontSize: 11, color: t.text2, fontWeight: 600 }}>RunPlan AI</span>
                </div>
              )}
              {msg.isPlan ? (
                <div style={{ maxWidth: '90%' }}><PlanCard/></div>
              ) : (
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? userBubbleBg : aiBubbleBg,
                  border: `1px solid ${msg.role === 'user' ? userBubbleBorder : t.border}`,
                  boxShadow: t.isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
                  fontSize: 13, lineHeight: 1.6, color: t.text, whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                  {msg.isAdjust && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Pill color={t.accent}>7月 42km→36km</Pill>
                      <Pill color={t.accent2} bg={`${t.accent2}18`}>8月 48km→40km</Pill>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ height: 8 }}/>
      </div>

      <div style={{ padding: '8px 12px 4px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="hide-scroll">
          {quickReplies.map(r => (
            <button key={r} style={{
              whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 99,
              background: t.qrBg, border: `1px solid ${t.qrBorder}`,
              color: t.text2, fontSize: 12, cursor: 'pointer', flexShrink: 0,
              boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
            }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 12px 12px', flexShrink: 0, borderTop: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="メッセージを送る…"
            style={{ flex: 1, padding: '11px 14px', borderRadius: 24,
              background: t.inputBg, border: `1px solid ${t.border}`,
              color: t.text, fontSize: 14, outline: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
            }}/>
          <button style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: t.buttonGradient, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 3px 12px ${t.accent}44` }}>
            <Icon name="send" size={18} color={t.accentText} strokeWidth={2}/>
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { PlanScreen });
