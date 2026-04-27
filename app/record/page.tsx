
// ─── Record Screen ────────────────────────────────────────────────────

const RecordScreen = ({ onNavigate }) => {
  const t = useTheme();
  const [tab, setTab] = useState('suunto');
  const [uploaded, setUploaded] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [form, setForm] = useState({ distance: '18.2', time: '1:58:24', pace: "6'31\"", hr: '142', note: '' });
  const [saved, setSaved] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => setParsed(true), 1200);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onNavigate && onNavigate('home'); }, 1800);
  };

  const Field = ({ label, value, unit, color, onChange }) => (
    <div style={{ flex: 1, minWidth: '42%' }}>
      <div style={{ fontSize: 10, color: t.text3, fontWeight: 600, letterSpacing: '0.06em',
        marginBottom: 5, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4,
        background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 12px',
        boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>
        <input value={value} onChange={e => onChange && onChange(e.target.value)}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
            fontSize: 20, fontWeight: 700, color: color || t.text,
            fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em', width: '100%' }}/>
        {unit && <span style={{ fontSize: 11, color: t.text3, flexShrink: 0 }}>{unit}</span>}
      </div>
    </div>
  );

  if (saved) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%',
        background: `${t.accent}22`, border: `2px solid ${t.accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <Icon name="check" size={32} color={t.accent} strokeWidth={2.5}/>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>記録しました！</div>
      <div style={{ fontSize: 13, color: t.text2 }}>マイタウンが少し成長しました 🏙️</div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }} className="hide-scroll">
      <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: t.text }}>記録する</div>
        <div style={{ fontSize: 12, color: t.text2, marginTop: 1 }}>4月27日（月）</div>
      </div>

      {/* Type tabs */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8 }}>
        {[['suunto','Suunto画像'],['manual','手動入力'],['gym','筋トレ']].map(([type, label]) => (
          <button key={type} onClick={() => { setTab(type); setUploaded(false); setParsed(false); }} style={{
            flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: tab === type ? `${t.accent}1A` : t.isDark ? 'rgba(26,26,40,0.6)' : 'rgba(255,255,255,0.7)',
            color: tab === type ? t.accent : t.text2,
            fontSize: 11, fontWeight: 600,
            outline: tab === type ? `1px solid ${t.accent}44` : `1px solid ${t.border}`,
            boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        {/* Suunto upload */}
        {tab === 'suunto' && !uploaded && (
          <div onClick={handleUpload} style={{
            border: `1.5px dashed ${t.accent}44`, borderRadius: 16,
            padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
            background: `${t.accent}08`,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${t.accent}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon name="upload" size={26} color={t.accent}/>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 6 }}>
              Suuntoスクリーンショットを追加
            </div>
            <div style={{ fontSize: 12, color: t.text2, lineHeight: 1.6 }}>
              タップしてギャラリーから選択<br/>または長押しで撮影
            </div>
            <div style={{ marginTop: 12 }}>
              <Pill>AIが自動読み取り</Pill>
            </div>
          </div>
        )}

        {tab === 'suunto' && uploaded && !parsed && (
          <div style={{ border: `1.5px solid ${t.borderAccent}`, borderRadius: 16,
            padding: '32px', textAlign: 'center',
            background: t.isDark ? 'transparent' : 'rgba(255,255,255,0.5)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%',
              background: `conic-gradient(${t.accent} 60%, ${t.accent}22 60%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', animation: 'spin 1s linear infinite' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.bg }}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>AI解析中...</div>
            <div style={{ fontSize: 12, color: t.text2, marginTop: 4 }}>距離・タイム・ペース・心拍を読み取っています</div>
          </div>
        )}

        {tab === 'suunto' && parsed && (
          <div style={{ border: `1px solid ${t.borderAccent}`, borderRadius: 16, overflow: 'hidden',
            boxShadow: t.isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 72, background: t.isDark
                ? 'linear-gradient(135deg, #1a1a3a, #0a2a2a)'
                : 'linear-gradient(135deg, #E8F4FF, #FFF5EC)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: t.text3, letterSpacing: '0.04em' }}>
              <span style={{ opacity: 0.5 }}>── Suunto App スクリーンショット ──</span>
            </div>
            <div style={{ padding: '8px 12px', background: `${t.accent}0A`,
              display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="check" size={14} color={t.accent} strokeWidth={2.5}/>
              <span style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>4項目を自動読み取りしました</span>
            </div>
          </div>
        )}

        {/* Manual / Gym form */}
        {(tab === 'manual' || tab === 'gym' || parsed) && (
          <div style={{ marginTop: tab === 'suunto' ? 14 : 0 }}>
            {tab === 'gym' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['種目','プッシュアップ'],['セット数','3'],['回数','20']].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: t.text3, fontWeight: 600,
                      letterSpacing: '0.06em', marginBottom: 5, textTransform: 'uppercase' }}>{label}</div>
                    <input defaultValue={val} placeholder={label} style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      background: t.inputBg, border: `1px solid ${t.border}`,
                      color: t.text, fontSize: 15, outline: 'none',
                      fontFamily: 'Space Grotesk, sans-serif',
                      boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                    }}/>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <Field label="距離" value={form.distance} unit="km" color={t.accent}
                    onChange={v => setForm(f => ({ ...f, distance: v }))}/>
                  <Field label="タイム" value={form.time} color={t.accent2}
                    onChange={v => setForm(f => ({ ...f, time: v }))}/>
                  <Field label="ペース" value={form.pace} unit="/km" color={t.accent3}
                    onChange={v => setForm(f => ({ ...f, pace: v }))}/>
                  <Field label="心拍数" value={form.hr} unit="bpm" color={t.danger}
                    onChange={v => setForm(f => ({ ...f, hr: v }))}/>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 10, color: t.text3, fontWeight: 600,
                    letterSpacing: '0.06em', marginBottom: 5, textTransform: 'uppercase' }}>メモ</div>
                  <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="感想・コメントを追加..." rows={2} style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      background: t.inputBg, border: `1px solid ${t.border}`,
                      color: t.text, fontSize: 13, outline: 'none', resize: 'none',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}/>
                </div>
              </>
            )}
          </div>
        )}

        {(tab !== 'suunto' || parsed) && (
          <button onClick={handleSave} style={{
            width: '100%', marginTop: 20, padding: '15px',
            background: t.buttonGradient, border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 700, color: t.accentText, cursor: 'pointer',
            boxShadow: `0 4px 20px ${t.accent}44`,
          }}>記録を保存する</button>
        )}
      </div>
      <div style={{ height: 20 }}/>
    </div>
  );
};

Object.assign(window, { RecordScreen });
