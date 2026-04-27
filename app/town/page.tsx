
// ─── My Town Screen — Minecraft/SimCity Style ────────────────────────

const TownScreen = () => {
  const t = useTheme();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const milestones = [
    { km: 50,   label: '最初の道路',   done: true,  icon: '🛣️' },
    { km: 100,  label: '公園オープン', done: true,  icon: '🌳' },
    { km: 200,  label: '川・橋が完成', done: true,  icon: '🌉' },
    { km: 300,  label: 'スタジアム',   done: false, icon: '🏟️' },
    { km: 500,  label: '森林エリア',   done: false, icon: '🌲' },
    { km: 1000, label: '大都市へ',     done: false, icon: '🌆' },
  ];

  const friends = [
    { name: '田中', km: 312, stage: 3, unlocked: 'スタジアム完成！' },
    { name: '鈴木', km: 189, stage: 2, unlocked: '川・橋が完成' },
    { name: '山本', km: 88,  stage: 1, unlocked: '公園オープン間近' },
  ];

  // ─── Pixel tree helper (Minecraft oak style) ───
  const PixelTree = ({ x, y, isDark: dark }) => {
    const trunk = dark ? '#3A2008' : '#6A4018';
    const l1    = dark ? '#163808' : '#2A5E10';
    const l2    = dark ? '#1E4A10' : '#387A18';
    return (
      <g>
        <rect x={x+7}  y={y+22} width={6} height={16} fill={trunk}/>
        <rect x={x}    y={y+14} width={20} height={10} fill={l1}/>
        <rect x={x+2}  y={y+8}  width={16} height={8}  fill={l2}/>
        <rect x={x+4}  y={y+2}  width={12} height={8}  fill={l1}/>
        <rect x={x+6}  y={y}    width={8}  height={4}  fill={l2}/>
      </g>
    );
  };

  // ─── Pixel building helper ───
  const PixelBuilding = ({ x, y, w, h, fill, dark, winColor, winRows=4, winCols=2, roofColor }) => {
    const wSpacing = Math.floor(w / (winCols + 1));
    const hSpacing = Math.floor(h / (winRows + 1));
    const wins = [];
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        wins.push({ x: x + wSpacing*(c+1) - 4, y: y + hSpacing*(r+1) - 3 });
      }
    }
    // horizontal mortar lines every 8px
    const mortarLines = Array.from({ length: Math.ceil(h/8) }, (_, i) => i);
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill}/>
        {mortarLines.map(i => (
          <rect key={i} x={x} y={y+i*8} width={w} height={1} fill={dark} opacity="0.45"/>
        ))}
        {/* vertical block breaks every 16px */}
        {Array.from({length: Math.ceil(w/16)}, (_,i) => (
          <rect key={i} x={x+i*16} y={y} width={1} height={h} fill={dark} opacity="0.3"/>
        ))}
        {wins.map((win, i) => (
          <rect key={i} x={win.x} y={win.y} width={8} height={6} fill={winColor}/>
        ))}
        {roofColor && <rect x={x-2} y={y-4} width={w+4} height={6} fill={roofColor}/>}
      </g>
    );
  };

  // ══════════════════════════════════════════════════════
  // DAY TOWN — bright Minecraft world
  // ══════════════════════════════════════════════════════
  const DayTown = () => (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 240 }}>
      {/* Sky */}
      <rect width="360" height="240" fill="#7EC4E8"/>

      {/* Minecraft sun — square */}
      <rect x="304" y="10" width="32" height="32" fill="#FFE040"/>
      <rect x="308" y="14" width="24" height="24" fill="#FFD000"/>
      {/* Sun rays (blocky) */}
      <rect x="316" y="4"  width="8" height="6"  fill="#FFE040" opacity="0.7"/>
      <rect x="316" y="36" width="8" height="6"  fill="#FFE040" opacity="0.7"/>
      <rect x="298" y="22" width="6" height="8"  fill="#FFE040" opacity="0.7"/>
      <rect x="330" y="22" width="6" height="8"  fill="#FFE040" opacity="0.7"/>

      {/* Blocky clouds */}
      <rect x="18"  y="16" width="56" height="12" fill="#F8F8F8"/>
      <rect x="12"  y="22" width="68" height="10" fill="#F8F8F8"/>
      <rect x="24"  y="10" width="32" height="8"  fill="#F8F8F8"/>
      <rect x="170" y="12" width="60" height="12" fill="#EFEFEF"/>
      <rect x="164" y="18" width="72" height="10" fill="#EFEFEF"/>
      <rect x="178" y="6"  width="36" height="8"  fill="#EFEFEF"/>

      {/* Background distant buildings (gray/muted) */}
      <rect x="242" y="118" width="24" height="66" fill="#A8B4C0"/>
      <rect x="268" y="128" width="20" height="56" fill="#98A8B8"/>
      <rect x="290" y="112" width="22" height="72" fill="#A0ACBC"/>
      <rect x="314" y="122" width="18" height="62" fill="#98A4B4"/>
      <rect x="334" y="130" width="24" height="54" fill="#A8B0C0"/>
      {/* distant windows (tiny) */}
      {[[245,124],[250,124],[245,136],[250,136],[245,148],[250,148]].map(([wx,wy],i) => (
        <rect key={i} x={wx} y={wy} width={4} height={3} fill="#C8D8E8" opacity="0.6"/>
      ))}

      {/* === Ground layers === */}
      {/* Grass top blocks */}
      <rect x="0" y="180" width="360" height="14" fill="#5AA82A"/>
      {/* Grass texture patches */}
      {[0,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,256,272,288,304,320,336,352].map(x => (
        <rect key={x} x={x} y={180} width={8} height={6} fill="#4A9020" opacity={x%32===0?0.6:0.3}/>
      ))}
      {/* Dirt layer */}
      <rect x="0" y="194" width="360" height="46" fill="#8B6432"/>
      {/* Dirt texture */}
      {[0,24,48,72,96,120,144,168,192,216,240,264,288,312,336].map(x => (
        <rect key={x} x={x+4} y={198} width={16} height={6} fill="#7A5428" opacity="0.5"/>
      ))}
      {/* Stone road */}
      <rect x="0" y="194" width="360" height="14" fill="#8A8A98"/>
      <rect x="0" y="194" width="360" height="2"  fill="#9898A8"/>
      <rect x="0" y="206" width="360" height="2"  fill="#787888"/>
      {/* Road markings */}
      {[8,40,72,104,136,168,200,232,264,296,328].map(x => (
        <rect key={x} x={x} y={199} width={20} height={4} fill="#BCBCCC"/>
      ))}

      {/* === Park area (left) === */}
      <rect x="2"  y="168" width="62" height="14" fill="#38900C"/>
      <rect x="2"  y="168" width="62" height="4"  fill="#2E7808"/>
      {/* Garden path */}
      <rect x="22" y="170" width="20" height="10" fill="#C8B878" opacity="0.7"/>
      <PixelTree x={2}  y={128}/>
      <PixelTree x={36} y={132}/>

      {/* === HERO: Stone Castle Tower === */}
      {/* Foundation */}
      <rect x="70" y="176" width="52" height="6"  fill="#505060"/>
      {/* Main body - cobblestone */}
      <rect x="72" y="52"  width="48" height="126" fill="#6E6E7A"/>
      {/* Block texture */}
      {[0,8,16,24,32,40,48,56,64,72,80,88,96,104,112,120].map(i => (
        <rect key={i} x={72} y={52+i} width={48} height={1} fill="#585868" opacity="0.5"/>
      ))}
      {[0,16,32,48].map(i => (
        <rect key={i} x={72+i} y={52} width={1} height={126} fill="#585868" opacity="0.3"/>
      ))}
      {/* Battlements */}
      {[72,84,96,108].map(x => (
        <rect key={x} x={x} y={44} width={8} height={10} fill="#6E6E7A"/>
      ))}
      <rect x="72" y="52" width="48" height="3" fill="#505060"/>
      {/* Windows - stone tower style */}
      {[0,1,2].map(col => [0,1,2,3,4,5,6].map(row => (
        <rect key={`${col}-${row}`}
          x={78+col*14} y={58+row*16}
          width={9} height={10}
          fill={col===1&&row===3 ? '#FFD060' : '#90B8D8'}
          opacity={col===1&&row===3 ? 0.9 : 0.75}/>
      )))}
      {/* Tower flag */}
      <rect x="92" y="36" width="2" height="12" fill="#4A2808"/>
      <rect x="94" y="36" width="10" height="8"  fill="#CC3030"/>

      {/* === Brick Building === */}
      <rect x="126" y="90"  width="38" height="90" fill="#B85040"/>
      {[0,8,16,24,32,40,48,56,64,72,80].map(i => (
        <rect key={i} x={126} y={90+i} width={38} height={1} fill="#983830" opacity="0.5"/>
      ))}
      {[0,12,24,36].map(i => (
        <rect key={i} x={126+i} y={90} width={1} height={90} fill="#983830" opacity="0.3"/>
      ))}
      {/* Brick windows */}
      {[0,1].map(col => [0,1,2,3,4].map(row => (
        <rect key={`${col}-${row}`}
          x={132+col*16} y={98+row*16}
          width={10} height={8} fill="#D4C870" opacity={0.7+row*0.04}/>
      )))}
      {/* Awning */}
      <rect x="124" y="88" width="42" height="5" fill="#C84020"/>

      {/* === River (blue water blocks) === */}
      <rect x="168" y="164" width="72" height="18" fill="#4A8CD4"/>
      {/* Water blocks pattern */}
      {[168,184,200,216,232].map(x => (
        <rect key={x} x={x} y={164} width={14} height={18} fill="#5898DC" opacity="0.5"/>
      ))}
      <rect x="168" y="164" width="72" height="3"  fill="#6AA8E0" opacity="0.7"/>
      <rect x="168" y="178" width="72" height="3"  fill="#3878C0" opacity="0.5"/>

      {/* Bridge (stone blocks over river) */}
      <rect x="188" y="158" width="32" height="8"  fill="#888898"/>
      <rect x="188" y="156" width="32" height="4"  fill="#9898A8"/>
      <rect x="192" y="148" width="6"  height="12" fill="#787888"/>
      <rect x="210" y="148" width="6"  height="12" fill="#787888"/>

      {/* === Glass Office Tower === */}
      <rect x="168" y="72"  width="40" height="92" fill="#6898C8"/>
      {[0,8,16,24,32,40,48,56,64,72,80].map(i => (
        <rect key={i} x={168} y={72+i} width={40} height={1} fill="#5080B0" opacity="0.4"/>
      ))}
      {/* Glass windows (large blue panes) */}
      {[0,1,2].map(col => [0,1,2,3,4,5].map(row => (
        <rect key={`${col}-${row}`}
          x={172+col*12} y={78+row*14}
          width={9} height={10} fill="#A8D0F0" opacity="0.65"/>
      )))}
      <rect x="166" y="68" width="44" height="6" fill="#5080B0"/>

      {/* === Wooden Houses (right side) === */}
      {/* House 1 */}
      <rect x="248" y="148" width="28" height="34" fill="#BC9448"/>
      {[0,8,16,24,32].map(i => (
        <rect key={i} x={248} y={148+i} width={28} height={1} fill="#9A7830" opacity="0.5"/>
      ))}
      <rect x="248" y="140" width="28" height="10" fill="#8A2020"/>
      <rect x="252" y="154" width={8}  height={8}  fill="#90C4E0" opacity="0.7"/>
      <rect x="264" y="154" width={8}  height={8}  fill="#90C4E0" opacity="0.7"/>
      <rect x="256" y="164" width={12} height={18} fill="#7A5820"/>
      {/* House 2 */}
      <rect x="280" y="152" width="24" height="30" fill="#A88040"/>
      <rect x="280" y="144" width="24" height="10" fill="#203878"/>
      <rect x="284" y="158" width={7}  height={7}  fill="#90C4E0" opacity="0.7"/>
      <rect x="294" y="158" width={7}  height={7}  fill="#90C4E0" opacity="0.7"/>
      <rect x="286" y="167" width={10} height={15} fill="#886830"/>

      {/* === STADIUM (Locked — Minecraft arena outline) === */}
      <g opacity="0.35">
        {/* Arena walls */}
        <rect x="316" y="146" width="42" height="36" fill="none"/>
        <rect x="316" y="146" width="42" height="4"  fill="#906030" opacity="0.5"/>
        <rect x="316" y="178" width="42" height="4"  fill="#906030" opacity="0.5"/>
        <rect x="316" y="146" width="4"  height="36" fill="#906030" opacity="0.5"/>
        <rect x="354" y="146" width="4"  height="36" fill="#906030" opacity="0.5"/>
        {/* Internal grid = seats */}
        {[152,158,164,170,176].map(y => (
          <rect key={y} x={322} y={y} width={34} height={2} fill="#B07840" opacity="0.4"/>
        ))}
        {[324,334,344].map(x => (
          <rect key={x} x={x} y={146} width={2} height={36} fill="#B07840" opacity="0.3"/>
        ))}
      </g>
      <rect x="326" y="158" width="22" height="8" fill="#C09050" opacity="0.2"/>
      <text x="337" y="165" textAnchor="middle" fontSize="7" fill="#906030" opacity="0.6"
        fontFamily="Space Grotesk" fontWeight="700">LOCKED</text>
      <text x="337" y="190" textAnchor="middle" fontSize="7" fill="#906030" opacity="0.5"
        fontFamily="Space Grotesk">🔒 16km先</text>
    </svg>
  );

  // ══════════════════════════════════════════════════════
  // NIGHT TOWN — Minecraft at night, torch-lit
  // ══════════════════════════════════════════════════════
  const NightTown = () => (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 240 }}>
      {/* Night sky gradient */}
      <defs>
        <linearGradient id="nsky2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#04041A"/>
          <stop offset="100%" stopColor="#0C0C28"/>
        </linearGradient>
        <radialGradient id="tglow" cx="42%" cy="60%" r="35%">
          <stop offset="0%" stopColor="#FF8C00" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="360" height="240" fill="url(#nsky2)"/>
      <rect width="360" height="240" fill="url(#tglow)"/>

      {/* Stars */}
      {[[20,14],[45,8],[70,20],[110,6],[155,16],[200,10],[240,22],[280,8],[320,18],[350,12],
        [35,30],[90,35],[140,28],[190,38],[250,32],[300,26],[15,45],[165,42],[235,48]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width={i%5===0?2:1} height={i%5===0?2:1} fill="white" opacity={0.4+i%3*0.15}/>
      ))}

      {/* Moon (Minecraft square) */}
      <rect x="310" y="12" width="26" height="26" fill="#EEEEBB"/>
      <rect x="314" y="16" width="18" height="18" fill="#D8D8A0"/>
      <rect x="318" y="20" width="6"  height="6"  fill="#C8C890" opacity="0.6"/>

      {/* Distant buildings (very dark) */}
      {[[242,128,24,56],[268,138,20,46],[290,122,22,62],[314,132,18,52],[334,140,24,44]].map(([x,y,w,h],i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#0E0E24"/>
          {[[x+4,y+8],[x+10,y+8],[x+4,y+20],[x+10,y+20]].map(([wx,wy],j) => (
            <rect key={j} x={wx} y={wy} width={4} height={4} fill="#FF8C00" opacity={0.4+j*0.1}/>
          ))}
        </g>
      ))}

      {/* Ground layers */}
      <rect x="0" y="180" width="360" height="14" fill="#1A4A08"/>
      {[0,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,256,272,288,304,320,336,352].map(x => (
        <rect key={x} x={x} y={180} width={8} height={6} fill="#0E3004" opacity={x%32===0?0.6:0.3}/>
      ))}
      <rect x="0" y="194" width="360" height="46" fill="#3A2410"/>
      <rect x="0" y="194" width="360" height="14" fill="#343440"/>
      <rect x="0" y="194" width="360" height="2"  fill="#404050"/>
      {[8,40,72,104,136,168,200,232,264,296,328].map(x => (
        <rect key={x} x={x} y={199} width={20} height={4} fill="#4A4A5A"/>
      ))}

      {/* Park */}
      <rect x="2" y="168" width="62" height="14" fill="#0E2804"/>
      <PixelTree x={2}  y={128} isDark={true}/>
      <PixelTree x={36} y={132} isDark={true}/>

      {/* HERO Tower (dark stone, torch windows) */}
      <rect x="70" y="176" width="52" height="6"  fill="#1A1A2A"/>
      <rect x="72" y="52"  width="48" height="126" fill="#2A2A3A"/>
      {[0,8,16,24,32,40,48,56,64,72,80,88,96,104,112,120].map(i => (
        <rect key={i} x={72} y={52+i} width={48} height={1} fill="#1E1E2E" opacity="0.6"/>
      ))}
      {[0,16,32,48].map(i => (
        <rect key={i} x={72+i} y={52} width={1} height={126} fill="#1E1E2E" opacity="0.4"/>
      ))}
      {[72,84,96,108].map(x => (
        <rect key={x} x={x} y={44} width={8} height={10} fill="#2A2A3A"/>
      ))}
      <rect x="72" y="52" width="48" height="3" fill="#1A1A2A"/>
      {[0,1,2].map(col => [0,1,2,3,4,5,6].map(row => (
        <rect key={`${col}-${row}`}
          x={78+col*14} y={58+row*16} width={9} height={10}
          fill={(col+row)%3===0 ? '#FF8C00' : (col+row)%3===1 ? '#FFD060' : '#1A2A3A'}
          opacity={(col+row)%3===2 ? 0.3 : 0.85}/>
      )))}
      {/* Torch glow */}
      <rect x="72" y="52" width="48" height="126" fill="#FF8C00" opacity="0.03"/>
      <rect x="92" y="36" width="2"  height="12" fill="#2A1404"/>
      <rect x="94" y="36" width="10" height="8"  fill="#8B0000"/>

      {/* Brick building */}
      <rect x="126" y="90"  width="38" height="90" fill="#281818"/>
      {[0,8,16,24,32,40,48,56,64,72,80].map(i => (
        <rect key={i} x={126} y={90+i} width={38} height={1} fill="#1A1010" opacity="0.6"/>
      ))}
      {[0,1].map(col => [0,1,2,3,4].map(row => (
        <rect key={`${col}-${row}`}
          x={132+col*16} y={98+row*16} width={10} height={8}
          fill={(col+row)%2===0 ? '#FF8C00' : '#FFD060'} opacity={0.6+row*0.06}/>
      )))}
      <rect x="124" y="88" width="42" height="5" fill="#180808"/>

      {/* River */}
      <rect x="168" y="164" width="72" height="18" fill="#0A1A3A"/>
      {[168,184,200,216,232].map(x => (
        <rect key={x} x={x} y={164} width={14} height={18} fill="#0E2248" opacity="0.5"/>
      ))}
      <rect x="168" y="164" width="72" height="2" fill="#1A3060" opacity="0.7"/>
      {/* Bridge */}
      <rect x="188" y="158" width="32" height="8"  fill="#1E1E2E"/>
      <rect x="192" y="148" width="6"  height="12" fill="#181828"/>
      <rect x="210" y="148" width="6"  height="12" fill="#181828"/>

      {/* Glass tower */}
      <rect x="168" y="72"  width="40" height="92" fill="#101828"/>
      {[0,8,16,24,32,40,48,56,64,72,80].map(i => (
        <rect key={i} x={168} y={72+i} width={40} height={1} fill="#0C1420" opacity="0.5"/>
      ))}
      {[0,1,2].map(col => [0,1,2,3,4,5].map(row => (
        <rect key={`${col}-${row}`}
          x={172+col*12} y={78+row*14} width={9} height={10}
          fill={(col*3+row)%4===0 ? '#C5FF47' : (col*3+row)%4===1 ? '#47B8FF' : '#FF8C00'}
          opacity={0.5+((col+row)%2)*0.25}/>
      )))}
      <rect x="166" y="68" width="44" height="6" fill="#080818"/>

      {/* Wooden houses */}
      {[[248,148,28,34,'#1E1410'],[280,152,24,30,'#1A1208']].map(([x,y,w,h,c],i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={c}/>
          <rect x={x} y={y-8} width={w} height={10} fill="#180808"/>
          {[0,1].map(col => (
            <rect key={col} x={x+4+col*12} y={y+6} width={8} height={8}
              fill={col===0?'#FF8C00':'#FFD060'} opacity="0.8"/>
          ))}
          <rect x={x+col*10+8} y={y+16} width={10} height={h-14} fill="#110C06"/>
        </g>
      ))}

      {/* Stadium (locked) */}
      <g opacity="0.28">
        <rect x="316" y="146" width="42" height="4"  fill="#604020"/>
        <rect x="316" y="178" width="42" height="4"  fill="#604020"/>
        <rect x="316" y="146" width="4"  height="36" fill="#604020"/>
        <rect x="354" y="146" width="4"  height="36" fill="#604020"/>
        {[324,334,344].map(x => (
          <rect key={x} x={x} y={146} width={2} height={36} fill="#604020" opacity="0.4"/>
        ))}
      </g>
      <text x="337" y="165" textAnchor="middle" fontSize="7" fill="#C5FF47" opacity="0.35"
        fontFamily="Space Grotesk" fontWeight="700">LOCKED</text>
      <text x="337" y="190" textAnchor="middle" fontSize="7" fill="#C5FF47" opacity="0.3"
        fontFamily="Space Grotesk">🔒 16km先</text>
    </svg>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }} className="hide-scroll">
      <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: t.text }}>マイタウン</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ fontSize: 12, color: t.text2 }}>
            累計 <span style={{ color: t.accent, fontWeight: 700 }}>284 km</span>
          </div>
          <Pill color={t.accent2} bg={`${t.accent2}18`}>🏟️ スタジアムまで 16km</Pill>
        </div>
      </div>

      {/* Town illustration */}
      <div style={{ background: t.isDark ? '#04041A' : '#7EC4E8', borderBottom: `1px solid ${t.border}` }}>
        {t.isDark ? <NightTown/> : <DayTown/>}
        <div style={{ padding: '6px 20px 4px', background: t.isDark ? '#04041A' : '#7EC4E8' }}>
          <ProgressBar value={284} max={300} height={4}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingBottom: 8 }}>
            <span style={{ fontSize: 10, color: t.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>200km 川・橋</span>
            <span style={{ fontSize: 10, color: t.accent, fontWeight: 600 }}>次: 300km スタジアム</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ padding: '14px 20px 0' }}>
        <SectionLabel>マイルストーン</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 13px', borderRadius: 10,
              background: m.done ? `${t.accent}0A` : t.cardBg,
              border: `1px solid ${m.done ? t.borderAccent : t.border}`,
              opacity: i > 3 ? 0.42 : 1,
              boxShadow: t.isDark ? 'none' : '0 1px 4px rgba(30,60,120,0.06)',
            }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: m.done ? t.text : t.text2 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: t.text3 }}>{m.km} km達成</div>
              </div>
              {m.done
                ? <Icon name="check" size={15} color={t.accent} strokeWidth={2.5}/>
                : <Icon name="lock" size={15} color={t.text3}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Friends' towns */}
      <div style={{ padding: '14px 20px 0' }}>
        <SectionLabel>グループの街</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {friends.map((f, i) => (
            <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}
              onClick={() => setSelectedFriend(f.name)}>
              <Avatar name={f.name} size={38}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>{f.name}さんの街</div>
                <div style={{ fontSize: 11, color: t.text2 }}>{f.unlocked}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.accent2 }}>
                  {f.km}<span style={{ fontSize: 10, color: t.text3, fontWeight: 400 }}>km</span>
                </div>
                <div style={{ fontSize: 10, color: t.text3 }}>Stage {f.stage}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ height: 20 }}/>
    </div>
  );
};

Object.assign(window, { TownScreen });
