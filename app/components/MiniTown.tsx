'use client';

const MiniTown = ({ isDark, km }: { isDark: boolean; km: number }) => {
  const vw = km >= 500 ? 340 : km >= 400 ? 322 : km >= 350 ? 300 : km >= 300 ? 278 :
             km >= 250 ? 248 : km >= 200 ? 224 : km >= 150 ? 200 : km >= 100 ? 174 :
             km >= 50  ? 150 : 136;
  const svgH = Math.round(80 * 340 / vw);
  const sx = vw - 20;

  return (
  <svg viewBox={`0 0 ${vw} 80`} shapeRendering="crispEdges" style={{ width: '100%', height: svgH, display: 'block', imageRendering: 'pixelated' } as React.CSSProperties}>
    <defs>
      <linearGradient id="minisky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={isDark ? '#05050F' : '#5BB8F5'}/>
        <stop offset="100%" stopColor={isDark ? '#0D0D20' : '#C2E8FF'}/>
      </linearGradient>
    </defs>
    <rect width={vw} height="80" fill="url(#minisky)"/>

    {isDark ? (
      <><circle cx={sx+3} cy="10" r="6" fill="#252540"/>
        <circle cx={sx}   cy="8"  r="6" fill="#05050E"/></>
    ) : (
      <><rect x={sx-7} y="4"  width="14" height="14" fill="#FFE040"/>
        <rect x={sx-3} y="2"  width="6"  height="2"  fill="#FFE040"/>
        <rect x={sx-3} y="18" width="6"  height="2"  fill="#FFE040"/>
        <rect x={sx-9} y="8"  width="2"  height="6"  fill="#FFE040"/>
        <rect x={sx+7} y="8"  width="2"  height="6"  fill="#FFE040"/></>
    )}
    {isDark && [[14,5],[42,11],[82,3],[132,7],[182,3],[222,7],[268,4]].map(([x,y],i) => (
      <rect key={i} x={x} y={y} width={1} height={1} fill="#EEEEF8" opacity="0.8"/>
    ))}
    {!isDark && (<>
      <rect x="32" y="10" width="26" height="4" fill="white" opacity="0.9"/>
      <rect x="36" y="7"  width="18" height="6" fill="white" opacity="0.9"/>
      <rect x="155" y="7" width="20" height="4" fill="white" opacity="0.8"/>
      <rect x="159" y="4" width="12" height="6" fill="white" opacity="0.8"/>
    </>)}

    <rect x="0" y="64" width={vw} height="16" fill={isDark ? '#0D1A0D' : '#4A9E2F'}/>
    <rect x="0" y="64" width={vw} height="3"  fill={isDark ? '#182818' : '#6BBF3E'}/>
    {!isDark && [0,40,80,120,160,200,240,280,320].map(x => (
      <rect key={x} x={x} y={70} width={18} height={1} fill="white" opacity="0.35"/>
    ))}
    {isDark && [0,35,70,105,140,175,210,245,280,315].map(x => (
      <rect key={x} x={x} y={67} width={22} height={2} fill="#2A2A48" opacity="0.6"/>
    ))}

    <rect x="4"  y="48" width="20" height="18" fill={isDark ? '#333366' : '#EDD9A3'}/>
    <rect x="4"  y="42" width="20" height="8"  fill={isDark ? '#222255' : '#CC4444'}/>
    <rect x="7"  y="51" width="5"  height="5"  fill={isDark ? '#FFD060' : '#90C8E8'} opacity="0.85"/>
    <rect x="15" y="51" width="5"  height="5"  fill={isDark ? '#FFB040' : '#90C8E8'} opacity="0.75"/>
    <rect x="10" y="58" width="6"  height="6"  fill={isDark ? '#0D0D20' : '#8B4513'}/>

    <rect x="26" y="30" width="16" height="36" fill={isDark ? '#003366' : '#B0C4DE'}/>
    <rect x="26" y="24" width="16" height="8"  fill={isDark ? '#002255' : '#8898AA'}/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`ma2-${col}-${row}`} x={28+col*7} y={32+row*9} width={4} height={6}
        fill={isDark ? '#FFD060' : '#C8E8FF'} opacity={isDark ? 0.8 : 0.85}/>
    )))}
    <rect x="29" y="58" width="6" height="6" fill={isDark ? '#0D0D22' : '#5D4037'}/>

    <rect x="44" y="40" width="16" height="26" fill={isDark ? '#333366' : '#F5C870'}/>
    <rect x="44" y="33" width="16" height="9"  fill={isDark ? '#222255' : '#D4822A'}/>
    <rect x="42" y="46" width="20" height="3"  fill={isDark ? '#1A1A44' : '#DD3333'}/>
    <rect x="46" y="50" width="5"  height="6"  fill={isDark ? '#FFD060' : '#90C8E8'} opacity="0.85"/>
    <rect x="53" y="50" width="5"  height="6"  fill={isDark ? '#88BBFF' : '#90C8E8'} opacity="0.75"/>

    <rect x="63" y="12" width="14" height="54" fill={isDark ? '#003366' : '#7BA7CC'}/>
    <rect x="63" y="6"  width="14" height="8"  fill={isDark ? '#002255' : '#5A88AA'}/>
    <rect x="69" y="2"  width="2"  height="6"  fill={isDark ? '#003366' : '#4A7899'}/>
    {[0,1].map(col => [0,1,2,3,4].map(row => (
      <rect key={`ma4-${col}-${row}`} x={65+col*6} y={14+row*9} width={4} height={6}
        fill={isDark ? '#FFD060' : '#C8E8FF'} opacity={isDark ? 0.75 : 0.8}/>
    )))}

    <rect x="79" y="20" width="14" height="46" fill={isDark ? '#333300' : '#C84040'}/>
    <rect x="79" y="14" width="14" height="8"  fill={isDark ? '#222200' : '#A03030'}/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`ma5-${col}-${row}`} x={81+col*6} y={22+row*10} width={4} height={7}
        fill={isDark ? '#FFB347' : '#FFD8B0'} opacity="0.8"/>
    )))}

    <rect x="95"  y="6"  width="10" height="60" fill={isDark ? '#003300' : '#9898C8'}/>
    <rect x="94"  y="2"  width="12" height="6"  fill={isDark ? '#002200' : '#7878A8'}/>
    {[0,1].map(col => [0,1,2,3,4,5].map(row => (
      <rect key={`ma6-${col}-${row}`} x={97+col*4} y={8+row*9} width={3} height={6}
        fill={isDark ? '#FFD060' : '#E0E8FF'} opacity={isDark ? 0.75 : 0.75}/>
    )))}

    <rect x="109" y="56" width="3" height="10" fill={isDark ? '#1A1A0A' : '#7B4F2E'}/>
    <rect x="105" y="45" width="11" height="13" fill={isDark ? '#1A4020' : '#2E8B2E'}/>
    <rect x="107" y="38" width="7"  height="9"  fill={isDark ? '#1E4828' : '#38A038'}/>
    <rect x="118" y="57" width="3" height="9"  fill={isDark ? '#1A1A0A' : '#7B4F2E'}/>
    <rect x="115" y="48" width="9"  height="10" fill={isDark ? '#183818' : '#33691E'}/>

    {km >= 50 && (<>
      <rect x="128" y="56" width="3" height="10" fill={isDark ? '#1A0A1A' : '#7B4F2E'}/>
      <rect x="124" y="45" width="11" height="13" fill={isDark ? '#663366' : '#2E8B2E'}/>
      <rect x="126" y="38" width="7"  height="10" fill={isDark ? '#553055' : '#38A038'}/>
      <rect x="128" y="31" width="5"  height="9"  fill={isDark ? '#442844' : '#4CC050'}/>
    </>)}

    {km >= 100 && (<>
      <rect x="141" y="56" width="3" height="10" fill={isDark ? '#0A1A0A' : '#7B4F2E'}/>
      <rect x="137" y="45" width="11" height="13" fill={isDark ? '#003399' : '#2E8B2E'}/>
      <rect x="139" y="38" width="7"  height="10" fill={isDark ? '#002888' : '#38A038'}/>
      <rect x="151" y="57" width="3" height="9"  fill={isDark ? '#1A0A0A' : '#7B4F2E'}/>
      <rect x="148" y="47" width="11" height="11" fill={isDark ? '#663300' : '#33691E'}/>
      <rect x="139" y="62" width="14" height="2"  fill={isDark ? '#2A2010' : '#9B7B30'}/>
    </>)}

    {km >= 150 && (<>
      <rect x="162" y="60" width="24" height="4"  fill={isDark ? '#333399' : '#999'}/>
      <rect x="162" y="60" width="24" height="1"  fill={isDark ? '#3D3DAA' : '#AAA'}/>
      <rect x="164" y="52" width="4"  height="10" fill={isDark ? '#242275' : '#777'}/>
      <rect x="180" y="52" width="4"  height="10" fill={isDark ? '#242275' : '#777'}/>
      <rect x="162" y="57" width="24" height="4"  fill={isDark ? '#2A2A88' : '#888'}/>
      {[0,1,2,3].map(i => <rect key={i} x={166+i*4} y={54} width={2} height={4} fill={isDark ? '#333399' : '#AAA'}/>)}
      {isDark && [0,2].map(i => <rect key={i} x={167+i*8} y={52} width={2} height={2} fill="#FFDD88" opacity="0.85"/>)}
    </>)}

    {km >= 200 && (<>
      <rect x="190" y="36" width="18" height="30" fill={isDark ? '#663300' : '#FFDDBB'}/>
      <rect x="190" y="28" width="18" height="10" fill={isDark ? '#442200' : '#CC5500'}/>
      <rect x="188" y="43" width="22" height="3"  fill={isDark ? '#331A00' : '#DD6600'}/>
      <rect x="193" y="48" width="5"  height="7"  fill={isDark ? '#FFD060' : '#90C8E8'} opacity="0.88"/>
      <rect x="200" y="48" width="5"  height="7"  fill={isDark ? '#FFB040' : '#90C8E8'} opacity="0.78"/>
      {isDark && <rect x="190" y="28" width="18" height="2" fill="#FF2288" opacity="0.7"/>}
    </>)}

    {km >= 250 && (<>
      <rect x="215" y="57" width="3" height="9"  fill={isDark ? '#0A0A1A' : '#7B4F2E'}/>
      <rect x="211" y="46" width="11" height="13" fill={isDark ? '#333399' : '#2A7A2A'}/>
      <rect x="213" y="39" width="7"  height="10" fill={isDark ? '#282888' : '#38903A'}/>
      <rect x="226" y="58" width="3" height="8"  fill={isDark ? '#1A0A1A' : '#7B4F2E'}/>
      <rect x="222" y="48" width="11" height="11" fill={isDark ? '#663366' : '#2A7A2A'}/>
      <rect x="211" y="63" width="22" height="3"  fill={isDark ? '#071620' : '#4499DD'}/>
      <rect x="211" y="63" width="22" height="1"  fill={isDark ? '#0B1E2C' : '#66BBFF'}/>
    </>)}

    {km >= 300 && (<>
      <rect x="236" y="36" width="28" height="30" fill={isDark ? '#003399' : '#6A9A6A'}/>
      <rect x="234" y="30" width="32" height="8"  fill={isDark ? '#002266' : '#557755'}/>
      <rect x="234" y="38" width="4"  height="24" fill={isDark ? '#002266' : '#557755'}/>
      <rect x="260" y="38" width="4"  height="24" fill={isDark ? '#002266' : '#557755'}/>
      <rect x="240" y="40" width="20" height="14" fill={isDark ? '#001A4D' : '#5A9A5A'}/>
      {[0,1].map(i => <rect key={i} x={240+i*10} y={28} width={8} height={4} fill={isDark ? '#FF4444' : '#CC4444'} opacity="0.9"/>)}
      {[0,1].map(i => <rect key={i} x={240+i*10} y={62} width={8} height={3} fill={isDark ? '#4466FF' : '#4444CC'} opacity="0.85"/>)}
    </>)}

    {km >= 350 && (<>
      <rect x="270" y="22" width="16" height="44" fill={isDark ? '#663366' : '#C8A8E8'}/>
      <rect x="270" y="16" width="16" height="8"  fill={isDark ? '#442244' : '#A878C8'}/>
      <rect x="270" y="22" width="3"  height="44" fill={isDark ? '#553355' : '#D8B8F8'}/>
      <rect x="283" y="22" width="3"  height="44" fill={isDark ? '#553355' : '#D8B8F8'}/>
      {[0,1].map(row => (
        <rect key={row} x={274} y={28+row*16} width={8} height={11}
          fill={isDark ? '#FFD060' : '#F0E8FF'} opacity={isDark ? 0.85 : 0.85}/>
      ))}
      <rect x="274" y="54" width="10" height="12" fill={isDark ? '#331A33' : '#7868A8'}/>
      {isDark && <rect x="270" y="16" width="16" height="2" fill="#88BBFF" opacity="0.7"/>}
    </>)}

    {km >= 400 && (<>
      <rect x="290" y="34" width="16" height="32" fill={isDark ? '#663300' : '#FFBB99'}/>
      <rect x="290" y="27" width="16" height="9"  fill={isDark ? '#442200' : '#FF7744'}/>
      <rect x="288" y="41" width="20" height="3"  fill={isDark ? '#331A00' : '#EE6633'}/>
      <rect x="292" y="45" width="12" height="8"  fill={isDark ? '#1A3A66' : '#55BBEE'} opacity="0.8"/>
      {isDark && <rect x="290" y="27" width="16" height="2" fill="#FF4499" opacity="0.7"/>}
      <rect x="293" y="19" width="2" height="7"  fill="white" opacity={isDark ? 0.35 : 0.5}/>
      <rect x="298" y="17" width="2" height="9"  fill="white" opacity={isDark ? 0.28 : 0.45}/>
      <rect x="303" y="20" width="2" height="7"  fill="white" opacity={isDark ? 0.3 : 0.5}/>
    </>)}

    {km >= 500 && (<>
      <rect x="310" y="18" width="20" height="48" fill={isDark ? '#333399' : '#D0D0E0'}/>
      <rect x="308" y="12" width="24" height="8"  fill={isDark ? '#222266' : '#B8B8C8'}/>
      {[0,1,2].map(i => <rect key={i} x={309+i*7} y={7} width={5} height={7} fill={isDark ? '#222266' : '#C0C0D0'}/>)}
      <rect x="313" y="2"  width="14" height="8"  fill={isDark ? '#333399' : '#C8C8D8'}/>
      {[0,1].map(i => <rect key={i} x={314+i*6} y={0} width={4} height={4} fill={isDark ? '#222266' : '#B8B8C8'}/>)}
      {[0,1].map(row => (
        <rect key={row} x={312} y={24+row*14} width={16} height={10}
          fill={isDark ? '#FFD060' : '#E8E8F0'} opacity={isDark ? 0.8 : 0.7}/>
      ))}
      <rect x="316" y="50" width="8"  height="16" fill={isDark ? '#1A1A44' : '#B8B8C8'}/>
      <rect x="308" y="28" width="4"  height="38" fill={isDark ? '#282866' : '#C8C8D8'}/>
      <rect x="328" y="28" width="4"  height="38" fill={isDark ? '#282866' : '#C8C8D8'}/>
      {km >= 750 && (<>
        <rect x="318" y="1" width="2" height="9" fill="#CC2222" opacity="0.9"/>
        <rect x="320" y="1" width="5" height="3" fill="#CC2222" opacity="0.9"/>
        <rect x="324" y="1" width="2" height="9" fill="#2222CC" opacity="0.9"/>
        <rect x="326" y="1" width="5" height="3" fill="#2222CC" opacity="0.9"/>
      </>)}
    </>)}

    {km >= 600 && isDark && (
      [[-4,-5],[0,-8],[4,-5],[5,0],[4,5],[0,8],[-4,5],[-5,0]].map(([dx,dy],i) => (
        <rect key={i} x={330+dx} y={10+dy} width={2} height={2}
          fill={['#FF4444','#FFD700','#44AAFF','#44FF88','#CC44FF'][i%5]} opacity="0.9"/>
      ))
    )}
  </svg>
  );
};

export default MiniTown;
