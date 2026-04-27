
// ─── Themes ──────────────────────────────────────────────────────────
const { useState, useEffect, useRef, createContext, useContext } = React;

const DARK = {
  isDark: true,
  bg: '#08080F',
  cardBg: 'rgba(26,26,40,0.85)',
  inputBg: 'rgba(26,26,40,0.9)',
  navBg: 'rgba(10,10,18,0.96)',
  heroBg: 'rgba(197,255,71,0.055)',
  text: '#EEEEF8',
  text2: '#7777A0',
  text3: '#44445A',
  accent: '#C5FF47',
  accentText: '#08080F',
  accent2: '#47B8FF',
  accent3: '#FF8547',
  danger: '#FF4D6A',
  success: '#47FFB3',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.13)',
  borderAccent: 'rgba(197,255,71,0.22)',
  progressBg: 'rgba(255,255,255,0.08)',
  accentPillBg: 'rgba(197,255,71,0.12)',
  qrBg: 'rgba(26,26,40,0.9)',
  qrBorder: 'rgba(255,255,255,0.1)',
  pillColor: '#C5FF47',
  pillBg: 'rgba(197,255,71,0.12)',
  statsBg: 'rgba(255,255,255,0.04)',
  missedColor: '#FF4D6A',
  todayColor: '#47B8FF',
  doneColor: '#C5FF47',
  planColor: 'rgba(255,255,255,0.22)',
  separatorColor: 'rgba(255,255,255,0.05)',
  fabGradient: 'linear-gradient(135deg, #C5FF47, #A0E030)',
  buttonGradient: 'linear-gradient(135deg, #C5FF47, #A0E030)',
};

const LIGHT = {
  isDark: false,
  bg: '#ECEEF4',
  cardBg: 'rgba(255,255,255,0.95)',
  inputBg: 'rgba(255,255,255,0.98)',
  navBg: 'rgba(236,238,244,0.97)',
  heroBg: 'rgba(241,43,126,0.06)',
  text: '#1A1A2A',
  text2: '#585878',
  text3: '#9090A8',
  accent: '#F12B7E',
  accentText: '#FFFFFF',
  accent2: '#28D6C0',
  accent3: '#F89221',
  danger: '#F12B7E',
  success: '#28D6C0',
  border: 'rgba(0,0,0,0.08)',
  border2: 'rgba(0,0,0,0.14)',
  borderAccent: 'rgba(241,43,126,0.28)',
  progressBg: 'rgba(0,0,0,0.08)',
  accentPillBg: 'rgba(241,43,126,0.1)',
  qrBg: 'rgba(255,255,255,0.9)',
  qrBorder: 'rgba(0,0,0,0.1)',
  pillColor: '#F12B7E',
  pillBg: 'rgba(241,43,126,0.1)',
  statsBg: 'rgba(0,0,0,0.04)',
  missedColor: '#F12B7E',
  todayColor: '#28D6C0',
  doneColor: '#28D6C0',
  planColor: 'rgba(0,0,0,0.16)',
  separatorColor: 'rgba(0,0,0,0.06)',
  fabGradient: 'linear-gradient(135deg, #F12B7E, #F633A2)',
  buttonGradient: 'linear-gradient(135deg, #F12B7E, #F633A2)',
};

const ThemeContext = createContext(DARK);
const useTheme = () => useContext(ThemeContext);

// ── Icons ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, color = 'currentColor', strokeWidth = 1.8 }) => {
  const paths = {
    home:     <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.5z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></>,
    plus:     <><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></>,
    map:      <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    flame:    <><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z"/></>,
    heart:    <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
    message:  <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    zap:      <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    check:    <><polyline points="20 6 9 17 4 12"/></>,
    camera:   <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
    upload:   <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    send:     <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    star:     <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    trophy:   <><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 22V18"/><path d="M14 22V18"/><path d="M8 18h8"/><path d="M12 15c-3.314 0-6-4.686-6-7V4h12v4c0 2.314-2.686 7-6 7z"/></>,
    sun:      <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:     <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ── Status Bar ────────────────────────────────────────────────────────
const StatusBar = () => {
  const t = useTheme();
  return (
    <div style={{
      height: 50, display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', padding: '0 26px 10px',
      color: t.text, fontSize: 13, fontWeight: 600, flexShrink: 0, letterSpacing: '-0.01em'
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={t.text}>
          <rect x="0" y="4" width="3" height="8" rx="0.5"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5"/>
          <rect x="9" y="0.5" width="3" height="11.5" rx="0.5"/>
          <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={t.text}>
          <path d="M8 2.4C10.7 2.4 13.1 3.5 14.8 5.3L16 4C14 1.8 11.1 0.5 8 0.5C4.9 0.5 2 1.8 0 4L1.2 5.3C2.9 3.5 5.3 2.4 8 2.4Z" opacity="0.35"/>
          <path d="M8 5.2C9.8 5.2 11.4 5.9 12.6 7.1L13.8 5.8C12.3 4.3 10.3 3.3 8 3.3C5.7 3.3 3.7 4.3 2.2 5.8L3.4 7.1C4.6 5.9 6.2 5.2 8 5.2Z" opacity="0.65"/>
          <circle cx="8" cy="10" r="1.5"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700 }}>100%</span>
      </div>
    </div>
  );
};

// ── Bottom Nav ────────────────────────────────────────────────────────
const BottomNav = ({ active, onNavigate }) => {
  const t = useTheme();
  const tabs = [
    { id: 'home',     icon: 'home',     label: 'ホーム' },
    { id: 'calendar', icon: 'calendar', label: 'カレンダー' },
    { id: 'record',   icon: 'plus',     label: '記録', fab: true },
    { id: 'town',     icon: 'map',      label: 'マイタウン' },
    { id: 'social',   icon: 'users',    label: 'ソーシャル' },
  ];
  return (
    <div style={{
      height: 78, background: t.navBg,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 8px', flexShrink: 0, position: 'relative', zIndex: 100,
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onNavigate(tab.id)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: tab.fab ? 0 : 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {tab.fab ? (
            <div style={{
              width: 52, height: 52, borderRadius: '50%', background: t.fabGradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 20px ${t.accent}55`, marginTop: -20,
            }}>
              <Icon name="plus" size={24} color={t.accentText} strokeWidth={2.5}/>
            </div>
          ) : (
            <>
              <Icon name={tab.icon} size={22}
                color={active === tab.id ? t.accent : t.text3}
                strokeWidth={active === tab.id ? 2 : 1.8}/>
              <span style={{ fontSize: 10, fontWeight: active === tab.id ? 600 : 400,
                color: active === tab.id ? t.accent : t.text3, letterSpacing: '-0.01em' }}>
                {tab.label}
              </span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

// ── Card ──────────────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => {
  const t = useTheme();
  return (
    <div onClick={onClick} style={{
      background: t.cardBg,
      border: `1px solid ${t.border}`,
      borderRadius: 16, padding: '16px',
      backdropFilter: 'blur(10px)',
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: t.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
      ...style,
    }}>{children}</div>
  );
};

// ── Pill ──────────────────────────────────────────────────────────────
const Pill = ({ children, color, bg }) => {
  const t = useTheme();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 99,
      background: bg || t.accentPillBg,
      color: color || t.accent,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
    }}>{children}</span>
  );
};

// ── ProgressBar ───────────────────────────────────────────────────────
const ProgressBar = ({ value, max, color, height = 4, style = {} }) => {
  const t = useTheme();
  const c = color || t.accent;
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: t.progressBg, borderRadius: 99, height, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: c,
        transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 8px ${c}60` }}/>
    </div>
  );
};

// ── Avatar ────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 36 }) => {
  const t = useTheme();
  const palettes = t.isDark
    ? ['#C5FF47','#47B8FF','#FF7847','#B847FF','#47FFB8']
    : ['#E8570A','#0080E0','#1FAF52','#9B3DD9','#E0A800'];
  const color = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color, flexShrink: 0,
    }}>{name[0]}</div>
  );
};

// Section label
const SectionLabel = ({ children }) => {
  const t = useTheme();
  return (
    <div style={{ fontSize: 11, color: t.text3, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  );
};

Object.assign(window, {
  DARK, LIGHT, ThemeContext, useTheme,
  Icon, StatusBar, BottomNav, Card, Pill, ProgressBar, Avatar, SectionLabel,
  useState, useEffect, useRef, createContext, useContext,
});
