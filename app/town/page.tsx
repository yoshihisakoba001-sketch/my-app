'use client';

import { useState, useEffect, useRef } from 'react';
import BottomNav from '../components/BottomNav';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeContext';

const BUILDINGS = [
  { name: '木',         unlockedAt: 50,  icon: '🌳' },
  { name: '公園',       unlockedAt: 100, icon: '🌳' },
  { name: '橋',         unlockedAt: 150, icon: '🌉' },
  { name: 'カフェ',     unlockedAt: 200, icon: '☕' },
  { name: '川・森',     unlockedAt: 250, icon: '🌊' },
  { name: 'スタジアム', unlockedAt: 300, icon: '🏟️' },
  { name: '図書館',     unlockedAt: 350, icon: '📚' },
  { name: '温泉',       unlockedAt: 400, icon: '♨️' },
  { name: '城',         unlockedAt: 500, icon: '🏯' },
  { name: '花火',       unlockedAt: 600, icon: '🎆' },
  { name: '城アップグレード', unlockedAt: 750, icon: '🚩' },
];

const getRunnerX = (km: number): number => {
  if (km >= 500) return 908;
  if (km >= 400) return 838;
  if (km >= 350) return 774;
  if (km >= 300) return 698;
  if (km >= 250) return 616;
  if (km >= 200) return 546;
  if (km >= 150) return 478;
  if (km >= 100) return 408;
  if (km >= 50)  return 338;
  return 298;
};

const DayTown = ({ km }: { km: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const runnerX = getRunnerX(km);

  useEffect(() => {
    if (scrollRef.current) {
      const w = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = Math.max(0, runnerX - Math.round(w * 0.36));
    }
  }, [runnerX]);

  return (
    <div ref={scrollRef} style={{ overflowX: 'auto', height: '100%', scrollbarWidth: 'none' } as React.CSSProperties}>
      <svg width="1200" height="160" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
        <defs>
          <linearGradient id="pixelDaySky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5BB8F5"/>
            <stop offset="100%" stopColor="#C2E8FF"/>
          </linearGradient>
          <style>{`
            .tr-run   { animation: trRun   0.28s steps(2,end) alternate infinite; transform-box: fill-box; transform-origin: center bottom; }
            .tr-steam { animation: trSteam 1.6s  ease-in-out  infinite;           transform-box: fill-box; transform-origin: center bottom; }
            .tr-fw1   { animation: trPulse 1.3s          ease-in-out infinite; }
            .tr-fw2   { animation: trPulse 1.3s 0.43s    ease-in-out infinite; }
            .tr-fw3   { animation: trPulse 1.3s 0.86s    ease-in-out infinite; }
            @keyframes trRun   { 0%{transform:translateY(0)} 100%{transform:translateY(-3px)} }
            @keyframes trSteam { 0%,100%{opacity:0.55;transform:translateY(0)} 50%{opacity:0.05;transform:translateY(-10px)} }
            @keyframes trPulse { 0%,100%{opacity:1} 50%{opacity:0.08} }
          `}</style>
        </defs>

        {/* Sky */}
        <rect width="1200" height="128" fill="url(#pixelDaySky)"/>

        {/* Sun */}
        <rect x="1132" y="8"  width="22" height="22" fill="#FFE040"/>
        <rect x="1137" y="4"  width="12" height="4"  fill="#FFE040"/>
        <rect x="1137" y="30" width="12" height="4"  fill="#FFE040"/>
        <rect x="1128" y="13" width="4"  height="12" fill="#FFE040"/>
        <rect x="1154" y="13" width="4"  height="12" fill="#FFE040"/>
        <rect x="1130" y="10" width="4"  height="4"  fill="#FFE040"/>
        <rect x="1152" y="10" width="4"  height="4"  fill="#FFE040"/>
        <rect x="1130" y="24" width="4"  height="4"  fill="#FFE040"/>
        <rect x="1152" y="24" width="4"  height="4"  fill="#FFE040"/>

        {/* Pixel clouds */}
        <rect x="26"  y="22" width="42" height="4"  fill="white" opacity={0.93}/>
        <rect x="30"  y="18" width="34" height="6"  fill="white" opacity={0.93}/>
        <rect x="36"  y="14" width="22" height="8"  fill="white" opacity={0.93}/>
        <rect x="220" y="24" width="32" height="4"  fill="white" opacity={0.86}/>
        <rect x="224" y="20" width="24" height="6"  fill="white" opacity={0.86}/>
        <rect x="228" y="16" width="16" height={8}  fill="white" opacity={0.86}/>
        <rect x="530" y="18" width="44" height="4"  fill="white" opacity={0.91}/>
        <rect x="534" y="14" width="36" height="6"  fill="white" opacity={0.91}/>
        <rect x="540" y="10" width="24" height={8}  fill="white" opacity={0.91}/>
        <rect x="790" y="20" width="36" height="4"  fill="white" opacity={0.86}/>
        <rect x="794" y="16" width="28" height="6"  fill="white" opacity={0.86}/>
        <rect x="798" y="12" width="18" height={8}  fill="white" opacity={0.86}/>

        {/* Ground */}
        <rect x="0" y="128" width="1200" height="32" fill="#4A9E2F"/>
        <rect x="0" y="128" width="1200" height="3"  fill="#6BBF3E"/>

        {/* Road */}
        <rect x="0" y="135" width="1200" height="11" fill="#777"/>
        <rect x="0" y="135" width="1200" height="2"  fill="#888"/>
        {Array.from({ length: 29 }, (_, i) => (
          <rect key={i} x={i*44} y={139} width={24} height={2} fill="white" opacity={0.55}/>
        ))}

        {/* ── PRE-EXISTING BUILDINGS (x=4 → x=286) ── */}

        {/* 1. House x=4 */}
        <rect x="18"  y="97"  width="40" height="3"  fill="#CC4444"/>
        <rect x="16"  y="93"  width="44" height="6"  fill="#CC4444"/>
        <rect x="14"  y="89"  width="8"  height="6"  fill="#BB3333"/>
        <rect x="54"  y="89"  width="8"  height="6"  fill="#BB3333"/>
        <rect x="12"  y="85"  width="6"  height="6"  fill="#AA2222"/>
        <rect x="58"  y="85"  width="6"  height="6"  fill="#AA2222"/>
        <rect x="48"  y="81"  width="6"  height="10" fill="#888"/>
        <rect x="47"  y="79"  width="8"  height="4"  fill="#777"/>
        <rect x="18"  y="100" width="40" height="28" fill="#EDD9A3"/>
        {[4,8,12,16,20,24].map(dy => <rect key={dy} x={18} y={100+dy} width={40} height={1} fill="#D4BF86" opacity={0.55}/>)}
        <rect x="22"  y="103" width="13" height="11" fill="#335577"/>
        <rect x="23"  y="104" width="11" height="9"  fill="#90C8E8"/>
        <rect x="28"  y="103" width="2"  height="11" fill="#335577"/>
        <rect x="22"  y="108" width="13" height={1}  fill="#335577" opacity={0.5}/>
        <rect x="41"  y="103" width="13" height="11" fill="#335577"/>
        <rect x="42"  y="104" width="11" height="9"  fill="#90C8E8"/>
        <rect x="47"  y="103" width="2"  height="11" fill="#335577"/>
        <rect x="41"  y="108" width="13" height={1}  fill="#335577" opacity={0.5}/>
        <rect x="30"  y="115" width="16" height="13" fill="#8B4513"/>
        <rect x="32"  y="117" width="5"  height="7"  fill="#A0622D"/>
        <rect x="39"  y="117" width="5"  height="7"  fill="#A0622D"/>
        <rect x="37"  y="120" width="2"  height="2"  fill="#FFD700" opacity={0.8}/>
        <rect x="28"  y="127" width="20" height="2"  fill="#CCC"/>

        {/* 2. Apartment x=68 */}
        <rect x="68"  y="70"  width="48" height="58" fill="#B0C4DE"/>
        <rect x="68"  y="64"  width="48" height="8"  fill="#8898AA"/>
        <rect x="70"  y="60"  width="44" height="6"  fill="#9AAABB"/>
        {[11,22,33,44].map(dy => <rect key={dy} x={68} y={70+dy} width={48} height={1} fill="#9AAABB" opacity={0.6}/>)}
        {[0,1,2].map(col => [0,1,2,3].map(row => (
          <rect key={`apt-${col}-${row}`} x={74+col*14} y={73+row*11} width={10} height={8}
            fill={row===1&&col===1?'#FFEEAA':row===3&&col===0?'#FFDDAA':'#C8E8FF'} opacity={0.9}/>
        )))}
        {[0,1,2].map(col => [0,1,2,3].map(row => (
          <rect key={`aptd-${col}-${row}`} x={74+col*14+4} y={73+row*11} width={2} height={8} fill="#8898AA" opacity={0.35}/>
        )))}
        <rect x="78"  y="117" width="14" height="11" fill="#5D4037"/>
        <rect x="80"  y="119" width="4"  height="7"  fill="#8B6340"/>
        <rect x="86"  y="119" width="4"  height="7"  fill="#8B6340"/>
        <rect x="84"  y="122" width="2"  height="2"  fill="#FFD700" opacity={0.7}/>

        {/* 3. Shop x=124 */}
        <rect x="124" y="92"  width="46" height="36" fill="#F5C870"/>
        <rect x="124" y="84"  width="46" height="12" fill="#D4822A"/>
        <rect x="120" y="98"  width="54" height="7"  fill="#DD3333"/>
        {[0,1,2,3,4,5,6].map(i => <rect key={i} x={120+i*8} y={98} width={4} height={7} fill="#BB1111" opacity={0.3}/>)}
        <rect x="128" y="78"  width="38" height="8"  fill="#CC6600"/>
        <rect x="130" y="79"  width="34" height="4"  fill="#FFAA44"/>
        <rect x="128" y="103" width="14" height="13" fill="#FFE8CC"/>
        <rect x="130" y="105" width="10" height="9"  fill="#FFDDAA"/>
        <rect x="131" y="109" width="3"  height="5"  fill="#E06020"/>
        <rect x="135" y="110" width="3"  height="4"  fill="#20A040"/>
        <rect x="144" y="103" width="18" height="13" fill="#FFE8CC"/>
        <rect x="146" y="105" width="14" height="9"  fill="#FFDDAA"/>
        <rect x="147" y="107" width="4"  height="7"  fill="#4060E0" opacity={0.8}/>
        <rect x="152" y="107" width="4"  height="7"  fill="#E04060" opacity={0.8}/>
        <rect x="134" y="112" width="22" height="16" fill="#8B4513"/>
        <rect x="136" y="114" width="7"  height="8"  fill="#A0622D"/>
        <rect x="145" y="114" width="7"  height="8"  fill="#A0622D"/>
        <rect x="143" y="117" width="2"  height="2"  fill="#FFD700"/>

        {/* 4. Office tower x=178 */}
        <rect x="178" y="42"  width="40" height="86" fill="#7BA7CC"/>
        <rect x="178" y="36"  width="40" height="8"  fill="#5A88AA"/>
        <rect x="193" y="26"  width="4"  height="12" fill="#4A7899"/>
        <rect x="191" y="24"  width="8"  height="4"  fill="#4A7899"/>
        <rect x="194" y="20"  width="2"  height="6"  fill="#4070A0"/>
        <rect x="194" y="18"  width="2"  height="4"  fill="#EE2222" opacity={0.9}/>
        {[0,1].map(col => [0,1,2,3,4,5,6].map(row => (<>
          <rect key={`of-${col}-${row}`}  x={184+col*17} y={44+row*11} width={13} height={8}
            fill={col===0&&row===4?'#FFEEAA':col===1&&row===1?'#FFEEAA':'#C8E8FF'} opacity={0.8}/>
          <rect key={`ofv-${col}-${row}`} x={184+col*17+6} y={44+row*11} width={1} height={8} fill="#5A88AA" opacity={0.35}/>
          <rect key={`ofh-${col}-${row}`} x={184+col*17} y={44+row*11} width={13} height={1} fill="#5A88AA" opacity={0.25}/>
        </>)))}
        <rect x="186" y="118" width="14" height="10" fill="#5D4037"/>

        {/* 5. Red building x=226 */}
        <rect x="226" y="60"  width="42" height="68" fill="#C84040"/>
        <rect x="226" y="54"  width="42" height="8"  fill="#A03030"/>
        {[0,1,2,3].map(i => <rect key={i} x={228+i*10} y={46} width={7} height={10} fill="#B83838"/>)}
        {[4,8,12,16,20,24,28,32,36,40,44,48,52,56,60].map(dy =>
          <rect key={dy} x={226} y={60+dy} width={42} height={1} fill="#A03030" opacity={0.3}/>
        )}
        {[0,1,2].map(col => [0,1,2,3,4].map(row => (
          <rect key={`rd-${col}-${row}`} x={232+col*12} y={63+row*12} width={8} height={9}
            fill={col===1&&row===2?'#FFEEAA':col===0&&row===4?'#FFDDAA':'#FFD8B0'} opacity={0.85}/>
        )))}
        {[0,1,2].map(col => [0,1,2,3,4].map(row => (
          <rect key={`rdg-${col}-${row}`} x={232+col*12+4} y={63+row*12} width={1} height={9} fill="#A03030" opacity={0.4}/>
        )))}
        <rect x="234" y="118" width="16" height="10" fill="#5D4037"/>

        {/* 6. Narrow tower x=276 */}
        <rect x="276" y="34"  width="30" height="94" fill="#9898C8"/>
        <rect x="274" y="28"  width="34" height="8"  fill="#7878A8"/>
        <rect x="278" y="20"  width="6"  height="12" fill="#6868A0"/>
        <rect x="280" y="14"  width="2"  height="8"  fill="#5858A0"/>
        {[11,22,33,44,55,66,77].map(dy => <rect key={dy} x={276} y={38+dy} width={30} height={1} fill="#7878A8" opacity={0.45}/>)}
        {[0,1].map(col => [0,1,2,3,4,5,6].map(row => (
          <rect key={`tw-${col}-${row}`} x={282+col*12} y={38+row*11} width={8} height={8}
            fill={col===0&&row===3?'#FFEEAA':col===1&&row===1?'#FFEEAA':'#E0E8FF'} opacity={0.75}/>
        )))}

        {/* ── UNLOCKABLE FACILITIES ── */}

        {/* 木 50km  x=308 */}
        {km >= 50 ? (<>
          <rect x="314" y="110" width="6"  height="18" fill="#7B4F2E"/>
          <rect x="302" y="92"  width="30" height="22" fill="#2E8B2E"/>
          <rect x="306" y="82"  width="22" height="16" fill="#38A038"/>
          <rect x="310" y="74"  width="14" height="12" fill="#4CC050"/>
          <rect x="313" y="68"  width="8"  height="10" fill="#5AD45A"/>
          <rect x="302" y="112" width="30" height="2"  fill="#226022" opacity={0.25}/>
        </>) : (
          <rect x="300" y="68" width="32" height="60" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 公園 100km  x=348 */}
        {km >= 100 ? (<>
          <rect x="348" y="108" width="4"  height="20" fill="#7B4F2E"/>
          <rect x="336" y="90"  width="28" height="22" fill="#2E8B2E"/>
          <rect x="340" y="80"  width="20" height="16" fill="#38A038"/>
          <rect x="343" y="72"  width="14" height="12" fill="#4CC050"/>
          <rect x="382" y="108" width="4"  height="20" fill="#7B4F2E"/>
          <rect x="370" y="90"  width="28" height="22" fill="#2E8B2E"/>
          <rect x="374" y="80"  width="20" height="16" fill="#38A038"/>
          <rect x="377" y="72"  width="14" height="12" fill="#4CC050"/>
          <rect x="352" y="116" width="28" height="4"  fill="#9B7B30"/>
          <rect x="352" y="120" width="28" height="2"  fill="#7B5B20"/>
          <rect x="354" y="122" width="4"  height="6"  fill="#7B5B20"/>
          <rect x="374" y="122" width="4"  height="6"  fill="#7B5B20"/>
        </>) : (
          <rect x="334" y="70" width="60" height="58" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 橋 150km  x=416 */}
        {km >= 150 ? (<>
          <rect x="412" y="124" width="68" height="6"  fill="#999"/>
          <rect x="412" y="124" width="68" height="2"  fill="#AAA"/>
          <rect x="416" y="110" width="10" height="16" fill="#777"/>
          <rect x="470" y="110" width="10" height="16" fill="#777"/>
          <rect x="412" y="120" width="68" height="6"  fill="#888"/>
          {[0,1,2,3,4,5,6,7,8].map(i => <rect key={i} x={418+i*6} y={114} width={3} height={8} fill="#AAA"/>)}
          <rect x="412" y="122" width="68" height="2"  fill="#BBB"/>
        </>) : (
          <rect x="410" y="108" width="72" height="22" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* カフェ 200km  x=492 */}
        {km >= 200 ? (<>
          <rect x="492" y="88"  width="48" height="40" fill="#FFDDBB"/>
          <rect x="492" y="78"  width="48" height="14" fill="#CC5500"/>
          <rect x="488" y="98"  width="56" height="6"  fill="#DD6600"/>
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x={488+i*8} y={98} width={4} height={6} fill="#BB4400" opacity={0.3}/>)}
          <rect x="498" y="102" width="13" height="12" fill="#335577"/>
          <rect x="499" y="103" width="11" height="10" fill="#90C8E8"/>
          <rect x="504" y="102" width="2"  height="12" fill="#335577" opacity={0.5}/>
          <rect x="498" y="108" width="13" height={1}  fill="#335577" opacity={0.5}/>
          <rect x="515" y="102" width="13" height="12" fill="#335577"/>
          <rect x="516" y="103" width="11" height="10" fill="#90C8E8"/>
          <rect x="521" y="102" width="2"  height="12" fill="#335577" opacity={0.5}/>
          <rect x="515" y="108" width="13" height={1}  fill="#335577" opacity={0.5}/>
          <rect x="504" y="112" width="16" height="16" fill="#8B4513"/>
          <rect x="506" y="114" width="5"  height="8"  fill="#A0622D"/>
          <rect x="513" y="114" width="5"  height="8"  fill="#A0622D"/>
          <rect x="492" y="70"  width="48" height="10" fill="#CC5500"/>
          <rect x="494" y="71"  width="44" height="6"  fill="#FF8833"/>
          <text x="516" y="77" textAnchor="middle" fontSize="5" fill="white" fontFamily="monospace" fontWeight="bold">CAFE</text>
        </>) : (
          <rect x="490" y="76" width="52" height="52" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 川・森 250km  x=552 */}
        {km >= 250 ? (<>
          <rect x="548" y="128" width="74" height="20" fill="#4499DD"/>
          <rect x="548" y="128" width="74" height="3"  fill="#66BBFF"/>
          {[4,12,20,28,36,44,52,60].map(dx => <rect key={dx} x={550+dx} y={132} width={5} height={2} fill="#55AAEE" opacity={0.6}/>)}
          <rect x="550" y="104" width="4"  height="24" fill="#7B4F2E"/>
          <rect x="536" y="84"  width="30" height="24" fill="#2A7A2A"/>
          <rect x="540" y="74"  width="22" height="16" fill="#38903A"/>
          <rect x="543" y="67"  width="16" height="12" fill="#4AA040"/>
          <rect x="590" y="104" width="4"  height="24" fill="#7B4F2E"/>
          <rect x="578" y="84"  width="30" height="24" fill="#2A7A2A"/>
          <rect x="582" y="74"  width="22" height="16" fill="#38903A"/>
          <rect x="585" y="67"  width="16" height="12" fill="#4AA040"/>
        </>) : (
          <rect x="534" y="66" width="74" height="62" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* スタジアム 300km  x=622 */}
        {km >= 300 ? (<>
          <rect x="620" y="76"  width="84" height="52" fill="#6A9A6A"/>
          <rect x="616" y="72"  width="92" height="8"  fill="#557755"/>
          <rect x="612" y="80"  width="8"  height="48" fill="#557755"/>
          <rect x="704" y="80"  width="8"  height="48" fill="#557755"/>
          <rect x="628" y="84"  width="68" height="34" fill="#5A9A5A"/>
          <rect x="660" y="84"  width="2"  height="34" fill="#4A8A4A"/>
          <rect x="628" y="84"  width="68" height="2"  fill="#4A8A4A" opacity={0.5}/>
          <rect x="628" y="102" width="68" height="2"  fill="#4A8A4A" opacity={0.5}/>
          <rect x="628" y="118" width="68" height="2"  fill="#4A8A4A" opacity={0.5}/>
          {[0,1,2,3].map(i => <rect key={i} x={628+i*17} y={76} width={12} height={6} fill="#CC4444"/>)}
          {[0,1,2,3].map(i => <rect key={i} x={628+i*17} y={124} width={12} height={4} fill="#4444CC"/>)}
        </>) : (
          <rect x="610" y="72" width="104" height="56" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 図書館 350km  x=718 */}
        {km >= 350 ? (<>
          <rect x="720" y="68"  width="58" height="60" fill="#C8A8E8"/>
          <rect x="720" y="60"  width="58" height="12" fill="#A878C8"/>
          <rect x="724" y="50"  width="50" height="14" fill="#B888D8"/>
          <rect x="720" y="60"  width="6"  height="68" fill="#D8B8F8"/>
          <rect x="772" y="60"  width="6"  height="68" fill="#D8B8F8"/>
          {[0,1,2].map(col => [0,1].map(row => (<>
            <rect key={`lb-${col}-${row}`} x={730+col*14} y={72+row*22} width={10} height={18} fill="#F0E8FF" opacity={0.85}/>
            <rect key={`lbg-${col}-${row}`} x={730+col*14+4} y={72+row*22} width={2} height={18} fill="#A878C8" opacity={0.3}/>
          </>)))}
          <rect x="732" y="112" width="22" height="16" fill="#7868A8"/>
          <rect x="734" y="114" width="7"  height="10" fill="#9888B8"/>
          <rect x="743" y="114" width="7"  height="10" fill="#9888B8"/>
          <text x="749" y="57" textAnchor="middle" fontSize="5" fill="white" fontFamily="monospace">LIBRARY</text>
        </>) : (
          <rect x="718" y="50" width="62" height="78" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 温泉 400km  x=782 */}
        {km >= 400 ? (<>
          <rect x="782" y="84"  width="52" height="44" fill="#FFBB99"/>
          <rect x="782" y="76"  width="52" height="12" fill="#FF7744"/>
          <rect x="778" y="92"  width="60" height="5"  fill="#EE6633"/>
          <rect x="788" y="96"  width="40" height="20" fill="#55BBEE" opacity={0.75}/>
          <rect x="788" y="96"  width="40" height="3"  fill="#66CCFF" opacity={0.8}/>
          {[4,10,16,22,28,34].map(dx => <rect key={dx} x={790+dx} y={100} width={4} height={2} fill="#88EEFF" opacity={0.6}/>)}
          <g className="tr-steam">
            <rect x="792" y="70" width="4" height="8"  fill="white" opacity={0.6}/>
            <rect x="800" y="66" width="4" height="12" fill="white" opacity={0.5}/>
            <rect x="808" y="68" width="4" height="10" fill="white" opacity={0.55}/>
            <rect x="818" y="70" width="4" height="8"  fill="white" opacity={0.5}/>
          </g>
          <rect x="792" y="116" width="18" height="12" fill="#885533"/>
          <rect x="794" y="118" width="5"  height="8"  fill="#AA7744"/>
          <rect x="801" y="118" width="5"  height="8"  fill="#AA7744"/>
          <text x="808" y="74" textAnchor="middle" fontSize="6" fill="#CC4400" fontFamily="monospace">♨ SPA</text>
        </>) : (
          <rect x="778" y="76" width="60" height="52" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 城 500km  x=848  (+ 城アップグレード 750km) */}
        {km >= 500 ? (<>
          <rect x="850" y="56"  width="52" height="72" fill="#D0D0E0"/>
          <rect x="846" y="50"  width="60" height="10" fill="#B8B8C8"/>
          {[0,1,2,3,4].map(i => <rect key={i} x={848+i*11} y={40} width={8} height={12} fill="#C0C0D0"/>)}
          <rect x="856" y="30"  width="32" height="14" fill="#B8B8C8"/>
          {[0,1,2].map(i => <rect key={i} x={858+i*9} y={22} width={7} height={10} fill="#C0C0D0"/>)}
          {[0,1,2].map(i => <rect key={i} x={860+i*9} y={18} width={3} height={6} fill="#B0B0C0"/>)}
          {[0,1].map(col => [0,1,2,3].map(row => (<>
            <rect key={`cs-${col}-${row}`}  x={856+col*22} y={60+row*14} width={16} height={11}
              fill={col===0&&row===1?'#AAAAEE':'#8888CC'} opacity={0.75}/>
            <rect key={`csg-${col}-${row}`} x={856+col*22+7} y={60+row*14} width={2} height={11} fill="#6666AA" opacity={0.35}/>
          </>)))}
          <rect x="868" y="104" width="18" height="24" fill="#6666AA"/>
          <rect x="870" y="106" width="6"  height="14" fill="#7878BB"/>
          <rect x="878" y="106" width="6"  height="14" fill="#7878BB"/>
          <rect x="846" y="72"  width="6"  height="56" fill="#C8C8D8"/>
          <rect x="900" y="72"  width="6"  height="56" fill="#C8C8D8"/>
          {km >= 750 && (<>
            <rect x="870" y="18"  width="4"  height="16" fill="#CC2222"/>
            <polygon points="874,18 886,22 874,26" fill="#CC2222"/>
            <rect x="882" y="16"  width="4"  height="16" fill="#2222CC"/>
            <polygon points="886,16 898,20 886,24" fill="#2222CC"/>
          </>)}
        </>) : (
          <rect x="844" y="40" width="66" height="88" fill="#AAAAAA" opacity={0.1} stroke="#BBBBBB" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 花火 600km — pixel art in sky above city buildings */}
        {km >= 600 && (<>
          <g className="tr-fw1">
            <rect x="790" y="18" width="6" height="6" fill="#FF4444"/>
            {[[-18,0],[-14,-8],[-8,-14],[0,-18],[8,-14],[14,-8],[18,0],[14,8],[8,14],[0,18],[-8,14],[-14,8]].map(([dx,dy],i) => (
              <rect key={i} x={793+dx} y={21+dy} width={4} height={4} fill="#FF4444"/>
            ))}
          </g>
          <g className="tr-fw2">
            <rect x="848" y="10" width="6" height="6" fill="#FFD700"/>
            {[[-16,0],[-12,-8],[-6,-14],[0,-16],[6,-14],[12,-8],[16,0],[12,8],[6,14],[0,16],[-6,14],[-12,8]].map(([dx,dy],i) => (
              <rect key={i} x={851+dx} y={13+dy} width={4} height={4} fill="#FFD700"/>
            ))}
          </g>
          <g className="tr-fw3">
            <rect x="900" y="16" width="6" height="6" fill="#44AAFF"/>
            {[[-16,0],[-12,-8],[-6,-14],[0,-16],[6,-14],[12,-8],[16,0],[12,8],[6,14],[0,16],[-6,14],[-12,8]].map(([dx,dy],i) => (
              <rect key={i} x={903+dx} y={19+dy} width={4} height={4} fill="#44AAFF"/>
            ))}
          </g>
        </>)}

        {/* ── RUNNER (最前面に描画してビル手前に表示) ── */}
        <g transform={`translate(${runnerX},100)`}>
          <g className="tr-run">
            {/* cap */}
            <rect x="4"  y="0"  width="6"  height="2"  fill="#888888"/>
            <rect x="2"  y="2"  width="12" height="3"  fill="#999999"/>
            <rect x="12" y="5"  width="5"  height="2"  fill="#777777"/>
            {/* head profile facing right */}
            <rect x="2"  y="3"  width="11" height="8"  fill="#FFAA66"/>
            <rect x="11" y="5"  width="2"  height="2"  fill="#111111"/>
            <rect x="12" y="8"  width="2"  height="2"  fill="#DD8844"/>
            {/* neck */}
            <rect x="4"  y="11" width="3"  height="2"  fill="#FFAA66"/>
            {/* torso */}
            <rect x="2"  y="13" width="11" height="7"  fill="#FF3B8B"/>
            <rect x="2"  y="19" width="11" height="1"  fill="#DD2270"/>
            {/* front arm: upper arm→elbow(out)→forearm up — running form */}
            <rect x="12" y="15" width="3"  height="6"  fill="#FFAA66"/>
            <rect x="12" y="20" width="5"  height="2"  fill="#FFAA66"/>
            <rect x="15" y="11" width="3"  height="11" fill="#FFAA66"/>
            <rect x="14" y="10" width="4"  height="3"  fill="#FFAA66"/>
            {/* back arm: trailing behind and down */}
            <rect x="-3" y="15" width="6"  height="2"  fill="#FFAA66"/>
            <rect x="-4" y="16" width="3"  height="5"  fill="#FFAA66"/>
            {/* shorts */}
            <rect x="2"  y="20" width="11" height="4"  fill="#1A1A2E"/>
            {/* front leg: extending forward and down */}
            <rect x="7"  y="24" width="5"  height="5"  fill="#FFAA66"/>
            <rect x="9"  y="28" width="4"  height="5"  fill="#FFAA66"/>
            <rect x="9"  y="32" width="7"  height="3"  fill="#1A1A2E"/>
            {/* back leg: thigh back, shin kicked UP behind */}
            <rect x="-2" y="24" width="5"  height="4"  fill="#FFAA66"/>
            <rect x="-2" y="19" width="4"  height="7"  fill="#FFAA66"/>
            <rect x="-4" y="17" width="6"  height="3"  fill="#1A1A2E"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

const NightTown = ({ km }: { km: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const runnerX = getRunnerX(km);

  useEffect(() => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollLeft = Math.max(0, runnerX - Math.round(w * 0.36));
  }, [runnerX]);

  return (
    <div ref={scrollRef} style={{ overflowX: 'auto', overflowY: 'hidden', height: 160, scrollbarWidth: 'none' }}>
      <svg width="1200" height="160" viewBox="0 0 1200 160" shapeRendering="crispEdges" style={{ display: 'block', imageRendering: 'pixelated' }}>
        <defs>
          <linearGradient id="nSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#010112"/>
            <stop offset="65%" stopColor="#050528"/>
            <stop offset="100%" stopColor="#080838"/>
          </linearGradient>
          <style>{`
            .nr-run   { animation: trRun   0.28s steps(2,end) alternate infinite; transform-box: fill-box; transform-origin: center bottom; }
            .nr-steam { animation: trSteam 1.6s  ease-in-out  infinite;           transform-box: fill-box; transform-origin: center bottom; }
            .nr-fw1   { animation: nPulse 1.4s            ease-in-out infinite; }
            .nr-fw2   { animation: nPulse 1.4s 0.47s      ease-in-out infinite; }
            .nr-fw3   { animation: nPulse 1.4s 0.93s      ease-in-out infinite; }
            .nr-fw4   { animation: nPulse 2.0s 0.35s      ease-in-out infinite; }
            .nr-fw5   { animation: nPulse 1.8s 0.70s      ease-in-out infinite; }
            @keyframes nPulse { 0%,100%{opacity:1} 50%{opacity:0.04} }
          `}</style>
        </defs>

        {/* Night sky */}
        <rect width="1200" height="128" fill="url(#nSky)"/>

        {/* Stars */}
        {([[32,8,2,0.9],[74,15,1,0.7],[124,5,2,0.8],[185,12,1,0.5],[244,6,1,0.85],[305,19,2,0.65],[355,4,1,0.8],[424,11,1,0.55],[485,20,2,0.9],[544,7,1,0.7],[604,15,1,0.75],[665,3,2,0.6],[724,17,1,0.65],[785,9,1,0.85],[845,23,1,0.6],[905,5,2,0.8],[965,19,1,0.7],[1025,8,1,0.9],[1085,14,1,0.6],[62,26,1,0.5],[172,28,2,0.6],[286,23,1,0.65],[405,31,1,0.5],[525,25,2,0.55],[645,36,1,0.65],[765,29,1,0.5],[885,21,2,0.6],[1005,33,1,0.65],[1065,37,1,0.55],[88,42,1,0.4],[205,40,1,0.5],[344,43,1,0.4],[456,37,2,0.45],[584,46,1,0.4],[706,41,1,0.5],[826,39,1,0.4],[946,45,1,0.45],[18,52,1,0.35],[135,54,1,0.3],[255,50,2,0.4],[395,57,1,0.3],[505,52,1,0.4],[635,60,1,0.3],[755,53,1,0.35],[875,50,2,0.3],[995,58,1,0.35],[200,68,1,0.3],[450,64,1,0.3],[700,70,1,0.3],[950,66,1,0.3]] as [number,number,number,number][]).map(([x,y,s,o],i) => (
          <rect key={i} x={x} y={y} width={s} height={s} fill="white" opacity={o}/>
        ))}

        {/* Moon — crescent (pixel circles) */}
        <circle cx="1118" cy="24" r="16" fill="#FFFFD0"/>
        <circle cx="1126" cy="19" r="14" fill="#040420"/>

        {/* Ground */}
        <rect x="0" y="128" width="1200" height="32" fill="#060E06"/>
        <rect x="0" y="128" width="1200" height="3"  fill="#091209"/>

        {/* Road */}
        <rect x="0" y="135" width="1200" height="11" fill="#0E0E18"/>
        <rect x="0" y="135" width="1200" height="2"  fill="#141420"/>
        {Array.from({ length: 29 }, (_, i) => (
          <rect key={i} x={i*44} y={139} width={24} height={2} fill="white" opacity={0.1}/>
        ))}

        {/* ── PRE-EXISTING BUILDINGS (silhouettes + lit windows) ── */}

        {/* 1. House x=4 */}
        <rect x="18"  y="97"  width="40" height="3"  fill="#222255"/>
        <rect x="16"  y="93"  width="44" height="6"  fill="#222255"/>
        <rect x="14"  y="89"  width="8"  height="6"  fill="#1A1A44"/>
        <rect x="54"  y="89"  width="8"  height="6"  fill="#1A1A44"/>
        <rect x="12"  y="85"  width="6"  height="6"  fill="#141440"/>
        <rect x="58"  y="85"  width="6"  height="6"  fill="#141440"/>
        <rect x="48"  y="81"  width="6"  height="10" fill="#2A2A2A"/>
        <rect x="47"  y="79"  width="8"  height="4"  fill="#222222"/>
        <rect x="18"  y="100" width="40" height="28" fill="#333366"/>
        <rect x="23"  y="104" width="11" height="9"  fill="#FFD060" opacity={0.88}/>
        <rect x="42"  y="104" width="11" height="9"  fill="#FFD060" opacity={0.72}/>
        <rect x="23"  y="116" width="11" height="7"  fill="#FFB040" opacity={0.55}/>
        <rect x="30"  y="115" width="16" height="13" fill="#10101E"/>
        <rect x="37"  y="114" width="2"  height="2"  fill="#FFDD88" opacity={0.9}/>
        <rect x="28"  y="127" width="20" height="2"  fill="#1C1C2E"/>

        {/* 2. Apartment x=68 */}
        <rect x="68"  y="60"  width="48" height="68" fill="#003366"/>
        <rect x="68"  y="60"  width="48" height="8"  fill="#002255"/>
        <rect x="70"  y="56"  width="44" height="6"  fill="#003366"/>
        {[0,1,2].map(col => [0,1,2,3].map(row => {
          const lit = (col===0&&row===0)||(col===1&&row===0)||(col===2&&row===0)||
                      (col===0&&row===1)||(col===2&&row===1)||
                      (col===1&&row===2)||(col===2&&row===2)||(col===0&&row===3);
          return <rect key={`an-${col}-${row}`} x={74+col*14} y={73+row*11} width={10} height={8}
            fill={lit ? (col===2 ? '#88BBFF' : '#FFD060') : '#002255'} opacity={lit ? 0.85 : 1}/>;
        }))}
        <rect x="78"  y="117" width="14" height="11" fill="#121230"/>

        {/* 3. Shop x=124 */}
        <rect x="124" y="84"  width="46" height="44" fill="#333366"/>
        <rect x="124" y="84"  width="46" height="12" fill="#222255"/>
        <rect x="120" y="98"  width="54" height="7"  fill="#1A1A44"/>
        <rect x="130" y="79"  width="34" height="4"  fill="#FF2288" opacity={0.75}/>
        <rect x="130" y="79"  width="34" height="1"  fill="#FF99CC" opacity={0.95}/>
        <rect x="129" y="105" width="10" height="9"  fill="#FFD060" opacity={0.85}/>
        <rect x="147" y="105" width="14" height="9"  fill="#88BBFF" opacity={0.72}/>
        <rect x="129" y="116" width="10" height="8"  fill="#FFB347" opacity={0.58}/>
        <rect x="134" y="112" width="22" height="16" fill="#101022"/>

        {/* 4. Office tower x=178 */}
        <rect x="178" y="36"  width="40" height="92" fill="#003366"/>
        <rect x="178" y="36"  width="40" height="8"  fill="#002255"/>
        <rect x="193" y="26"  width="4"  height="12" fill="#003366"/>
        <rect x="191" y="24"  width="8"  height="4"  fill="#003366"/>
        <rect x="194" y="18"  width="2"  height="4"  fill="#FF4444" opacity={0.9}/>
        {[0,1].map(col => [0,1,2,3,4,5,6].map(row => {
          const lit = (col===0&&row===0)||(col===1&&row===0)||
                      (col===0&&row===2)||(col===1&&row===1)||
                      (col===0&&row===4)||(col===1&&row===3)||
                      (col===1&&row===5)||(col===0&&row===6);
          return <rect key={`on-${col}-${row}`} x={184+col*17} y={44+row*11} width={13} height={8}
            fill={lit ? '#FFD060' : '#002255'} opacity={lit ? 0.85 : 1}/>;
        }))}
        <rect x="186" y="118" width="14" height="10" fill="#10102A"/>

        {/* 5. Red building x=226 — dark maroon */}
        <rect x="226" y="46"  width="42" height="82" fill="#333300"/>
        <rect x="226" y="46"  width="42" height="8"  fill="#222200"/>
        {[0,1,2,3].map(i => <rect key={i} x={228+i*10} y={38} width={7} height={10} fill="#1A1A00"/>)}
        {[0,1,2].map(col => [0,1,2,3,4].map(row => {
          const lit = (col===0&&row===0)||(col===0&&row===2)||(col===0&&row===4)||
                      (col===1&&row===0)||(col===1&&row===2)||(col===1&&row===4)||
                      (col===2&&row===1)||(col===2&&row===3);
          return <rect key={`rdn-${col}-${row}`} x={232+col*12} y={63+row*12} width={8} height={9}
            fill={lit ? '#FFB347' : '#1A1A00'} opacity={lit ? 0.82 : 1}/>;
        }))}
        <rect x="234" y="118" width="16" height="10" fill="#100E20"/>

        {/* 6. Narrow tower x=276 */}
        <rect x="276" y="14"  width="30" height="114" fill="#003300"/>
        <rect x="274" y="14"  width="34" height="8"   fill="#002200"/>
        <rect x="278" y="6"   width="6"  height="12"  fill="#003300"/>
        <rect x="280" y="2"   width="2"  height="8"   fill="#004400"/>
        {[0,1].map(col => [0,1,2,3,4,5,6].map(row => {
          const lit = (col===0&&row===0)||(col===1&&row===1)||
                      (col===0&&row===2)||(col===1&&row===2)||
                      (col===0&&row===4)||(col===1&&row===4)||
                      (col===0&&row===6)||(col===1&&row===5);
          return <rect key={`twn-${col}-${row}`} x={282+col*12} y={38+row*11} width={8} height={8}
            fill={lit ? (col===1 ? '#AADDFF' : '#FFD060') : '#002200'} opacity={lit ? 0.82 : 1}/>;
        }))}

        {/* ── UNLOCKABLE FACILITIES (night versions) ── */}

        {/* 🌳 50km — tree silhouette */}
        {km >= 50 ? (<>
          <rect x="314" y="110" width="6"  height="18" fill="#2A1A2A"/>
          <rect x="302" y="92"  width="30" height="22" fill="#663366"/>
          <rect x="306" y="82"  width="22" height="16" fill="#553055"/>
          <rect x="310" y="74"  width="14" height="12" fill="#442844"/>
          <rect x="313" y="68"  width="8"  height="10" fill="#663366"/>
        </>) : (
          <rect x="300" y="68" width="32" height="60" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 🌳 100km — park silhouette */}
        {km >= 100 ? (<>
          {/* 左の木 — #003399 系 */}
          <rect x="348" y="108" width="4"  height="20" fill="#1A1A2A"/>
          <rect x="336" y="90"  width="28" height="22" fill="#003399"/>
          <rect x="340" y="80"  width="20" height="16" fill="#002888"/>
          <rect x="343" y="72"  width="14" height="12" fill="#003399"/>
          {/* 右の木 — #663300 系 */}
          <rect x="382" y="108" width="4"  height="20" fill="#2A1A0A"/>
          <rect x="370" y="90"  width="28" height="22" fill="#663300"/>
          <rect x="374" y="80"  width="20" height="16" fill="#552800"/>
          <rect x="377" y="72"  width="14" height="12" fill="#663300"/>
          {/* ベンチ */}
          <rect x="352" y="116" width="28" height="4"  fill="#2A2010"/>
          <rect x="354" y="122" width="4"  height="6"  fill="#2A2010"/>
          <rect x="374" y="122" width="4"  height="6"  fill="#2A2010"/>
        </>) : (
          <rect x="334" y="70" width="60" height="58" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 🌉 150km — bridge at night */}
        {km >= 150 ? (<>
          <rect x="412" y="124" width="68" height="6"  fill="#333399"/>
          <rect x="412" y="124" width="68" height="2"  fill="#3D3DAA"/>
          <rect x="416" y="110" width="10" height="16" fill="#242275"/>
          <rect x="470" y="110" width="10" height="16" fill="#242275"/>
          <rect x="412" y="120" width="68" height="6"  fill="#2A2A88"/>
          {[0,1,2,3,4,5,6,7,8].map(i => <rect key={i} x={418+i*6} y={114} width={3} height={8} fill="#333399"/>)}
          {[0,3,6].map(i => <rect key={i} x={420+i*12} y={112} width={2} height={2} fill="#FFDD88" opacity={0.85}/>)}
        </>) : (
          <rect x="410" y="108" width="72" height="22" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* ☕ 200km — cafe with neon sign */}
        {km >= 200 ? (<>
          <rect x="492" y="78"  width="48" height="50" fill="#663300"/>
          <rect x="492" y="78"  width="48" height="14" fill="#442200"/>
          <rect x="488" y="98"  width="56" height="6"  fill="#331A00"/>
          <rect x="494" y="68"  width="44" height="8"  fill="#FF2288" opacity={0.85}/>
          <rect x="494" y="68"  width="44" height="2"  fill="#FFAADD" opacity={0.95}/>
          <rect x="494" y="75"  width="44" height="1"  fill="#FF66BB" opacity={0.7}/>
          <rect x="499" y="103" width="11" height="10" fill="#FFD060" opacity={0.88}/>
          <rect x="516" y="103" width="11" height="10" fill="#FFB040" opacity={0.78}/>
          <rect x="504" y="112" width="16" height="16" fill="#331A00"/>
        </>) : (
          <rect x="490" y="76" width="52" height="52" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 🌊 250km — river & forest at night */}
        {km >= 250 ? (<>
          <rect x="548" y="128" width="74" height="20" fill="#071620"/>
          <rect x="548" y="128" width="74" height="3"  fill="#0B1E2C"/>
          {[4,14,26,38,50,62].map(dx => <rect key={dx} x={550+dx} y={132} width={5} height={1} fill="#224488" opacity={0.5}/>)}
          {/* 左の木 — #333399 系 */}
          <rect x="550" y="104" width="4"  height="24" fill="#1A1A2A"/>
          <rect x="536" y="84"  width="30" height="24" fill="#333399"/>
          <rect x="540" y="74"  width="22" height="16" fill="#282888"/>
          <rect x="543" y="67"  width="16" height="12" fill="#333399"/>
          {/* 右の木 — #663366 系 */}
          <rect x="590" y="104" width="4"  height="24" fill="#2A1A2A"/>
          <rect x="578" y="84"  width="30" height="24" fill="#663366"/>
          <rect x="582" y="74"  width="22" height="16" fill="#553055"/>
          <rect x="585" y="67"  width="16" height="12" fill="#663366"/>
        </>) : (
          <rect x="534" y="66" width="74" height="62" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 🏟️ 300km — stadium with floodlights */}
        {km >= 300 ? (<>
          <rect x="620" y="68"  width="84" height="60" fill="#003399"/>
          <rect x="616" y="64"  width="92" height="8"  fill="#002266"/>
          <rect x="612" y="72"  width="8"  height="56" fill="#002266"/>
          <rect x="704" y="72"  width="8"  height="56" fill="#002266"/>
          <rect x="612" y="66"  width="8"  height="6"  fill="#FFFFAA" opacity={0.9}/>
          <rect x="704" y="66"  width="8"  height="6"  fill="#FFFFAA" opacity={0.9}/>
          <rect x="628" y="76"  width="68" height="42" fill="#001A4D"/>
          <rect x="660" y="76"  width="2"  height="42" fill="#003399" opacity={0.7}/>
          <rect x="628" y="76"  width="68" height="2"  fill="#003399" opacity={0.5}/>
          <rect x="628" y="94"  width="68" height="2"  fill="#003399" opacity={0.5}/>
          {[0,1,2,3].map(i => <rect key={i} x={628+i*17} y={62} width={12} height={6} fill="#FF4444" opacity={0.9}/>)}
          {[0,1,2,3].map(i => <rect key={i} x={628+i*17} y={116} width={12} height={6} fill="#4466FF" opacity={0.85}/>)}
        </>) : (
          <rect x="610" y="64" width="104" height="64" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 📚 350km — library */}
        {km >= 350 ? (<>
          <rect x="720" y="40"  width="58" height="88" fill="#663366"/>
          <rect x="720" y="40"  width="58" height="12" fill="#442244"/>
          <rect x="724" y="30"  width="50" height="14" fill="#442244"/>
          <rect x="720" y="40"  width="6"  height="88" fill="#553355"/>
          <rect x="772" y="40"  width="6"  height="88" fill="#553355"/>
          {[0,1,2].map(col => [0,1].map(row => (
            <rect key={`lbn-${col}-${row}`} x={730+col*14} y={72+row*22} width={10} height={18}
              fill={row===0 ? '#FFD060' : '#FFEEAA'} opacity={row===0 ? 0.88 : 0.72}/>
          )))}
          <rect x="732" y="112" width="22" height="16" fill="#331A33"/>
          <rect x="724" y="34"  width="50" height="6"  fill="#88BBFF" opacity={0.7}/>
          <rect x="724" y="34"  width="50" height="1"  fill="#CCDDFF" opacity={0.9}/>
          <text x="749" y="39" textAnchor="middle" fontSize="5" fill="#AACCFF" fontFamily="monospace" fontWeight="bold">LIBRARY</text>
        </>) : (
          <rect x="718" y="30" width="62" height="98" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* ♨️ 400km — onsen at night */}
        {km >= 400 ? (<>
          <rect x="782" y="76"  width="52" height="52" fill="#663300"/>
          <rect x="782" y="76"  width="52" height="12" fill="#442200"/>
          <rect x="778" y="92"  width="60" height="5"  fill="#331A00"/>
          <rect x="788" y="96"  width="40" height="20" fill="#1A3A66"/>
          <rect x="788" y="96"  width="40" height="3"  fill="#2255AA" opacity={0.85}/>
          {[4,10,16,22,28,34].map(dx => <rect key={dx} x={790+dx} y={100} width={4} height={2} fill="#66AAEE" opacity={0.7}/>)}
          <g className="nr-steam">
            <rect x="792" y="70" width="4" height="8"  fill="white" opacity={0.45}/>
            <rect x="800" y="66" width="4" height="12" fill="white" opacity={0.38}/>
            <rect x="808" y="68" width="4" height="10" fill="white" opacity={0.42}/>
            <rect x="818" y="70" width="4" height="8"  fill="white" opacity={0.38}/>
          </g>
          <rect x="792" y="116" width="18" height="12" fill="#331A00"/>
          <rect x="782" y="76"  width="52" height="4"  fill="#FF4499" opacity={0.8}/>
          <rect x="782" y="76"  width="52" height="1"  fill="#FFAACC" opacity={0.9}/>
          <rect x="800" y="68"  width="20" height="4"  fill="#FF4499" opacity={0.75}/>
          <rect x="800" y="68"  width="20" height="1"  fill="#FFAACC" opacity={0.9}/>
        </>) : (
          <rect x="778" y="76" width="60" height="52" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 🏯 500km — castle silhouette */}
        {km >= 500 ? (<>
          <rect x="850" y="30"  width="52" height="98" fill="#333399"/>
          <rect x="846" y="30"  width="60" height="10" fill="#222266"/>
          {[0,1,2,3,4].map(i => <rect key={i} x={848+i*11} y={20} width={8} height={12} fill="#222266"/>)}
          <rect x="856" y="10"  width="32" height="14" fill="#333399"/>
          {[0,1,2].map(i => <rect key={i} x={858+i*9} y={4} width={7} height={10} fill="#222266"/>)}
          {[0,1,2].map(i => <rect key={i} x={860+i*9} y={2} width={3} height={6} fill="#1A1A55"/>)}
          {[0,1].map(col => [0,1,2,3].map(row => (
            <rect key={`csn-${col}-${row}`} x={856+col*22} y={60+row*14} width={16} height={11}
              fill={row%2===0 ? '#FFDD88' : '#FFB347'} opacity={row===0 ? 0.88 : row===3 ? 0.65 : 0.78}/>
          )))}
          <rect x="868" y="104" width="18" height="24" fill="#1A1A44"/>
          <rect x="846" y="60"  width="6"  height="68" fill="#282866"/>
          <rect x="900" y="60"  width="6"  height="68" fill="#282866"/>
          {km >= 750 && (<>
            <rect x="870" y="4"   width="4"  height="16" fill="#CC2222"/>
            <polygon points="874,4 886,8 874,12" fill="#CC2222"/>
            <rect x="882" y="2"   width="4"  height="16" fill="#2222CC"/>
            <polygon points="886,2 898,6 886,10" fill="#2222CC"/>
          </>)}
        </>) : (
          <rect x="844" y="20" width="66" height="108" fill="white" opacity={0.04} stroke="#334455" strokeWidth="1" strokeDasharray="3 2"/>
        )}

        {/* 🎆 600km — FIREWORKS! (5-color night display) */}
        {km >= 600 && (<>
          {/* FW1 — Red x=800 */}
          <g className="nr-fw1">
            <rect x="798" y="26" width="6"  height="6"  fill="#FFFFFF"/>
            {[[-14,0],[-12,-8],[-6,-12],[0,-14],[6,-12],[12,-8],[14,0],[12,8],[6,12],[0,14],[-6,12],[-12,8]].map(([dx,dy],i) => (
              <rect key={i} x={801+dx} y={29+dy} width={4} height={4} fill="#FF4444"/>
            ))}
            {[[-22,0],[-18,-12],[-10,-20],[0,-24],[10,-20],[18,-12],[22,0],[18,12],[10,20],[0,24],[-10,20],[-18,12]].map(([dx,dy],i) => (
              <rect key={i} x={801+dx} y={29+dy} width={2} height={2} fill="#FF9999"/>
            ))}
          </g>
          {/* FW2 — Gold x=878 */}
          <g className="nr-fw2">
            <rect x="876" y="16" width="6"  height="6"  fill="#FFFFFF"/>
            {[[-14,0],[-12,-8],[-6,-12],[0,-14],[6,-12],[12,-8],[14,0],[12,8],[6,12],[0,14],[-6,12],[-12,8]].map(([dx,dy],i) => (
              <rect key={i} x={879+dx} y={19+dy} width={4} height={4} fill="#FFD700"/>
            ))}
            {[[-24,0],[-20,-14],[-12,-22],[0,-26],[12,-22],[20,-14],[24,0],[20,14],[12,22],[0,26],[-12,22],[-20,14]].map(([dx,dy],i) => (
              <rect key={i} x={879+dx} y={19+dy} width={2} height={2} fill="#FFEEAA"/>
            ))}
          </g>
          {/* FW3 — Blue x=956 */}
          <g className="nr-fw3">
            <rect x="954" y="22" width="6"  height="6"  fill="#FFFFFF"/>
            {[[-14,0],[-12,-8],[-6,-12],[0,-14],[6,-12],[12,-8],[14,0],[12,8],[6,12],[0,14],[-6,12],[-12,8]].map(([dx,dy],i) => (
              <rect key={i} x={957+dx} y={25+dy} width={4} height={4} fill="#44AAFF"/>
            ))}
            {[[-22,0],[-18,-12],[-10,-20],[0,-24],[10,-20],[18,-12],[22,0],[18,12],[10,20],[0,24],[-10,20],[-18,12]].map(([dx,dy],i) => (
              <rect key={i} x={957+dx} y={25+dy} width={2} height={2} fill="#AADDFF"/>
            ))}
          </g>
          {/* FW4 — Green x=1034 */}
          <g className="nr-fw4">
            <rect x="1032" y="30" width="6"  height="6"  fill="#FFFFFF"/>
            {[[-12,0],[-10,-6],[-6,-10],[0,-12],[6,-10],[10,-6],[12,0],[10,6],[6,10],[0,12],[-6,10],[-10,6]].map(([dx,dy],i) => (
              <rect key={i} x={1035+dx} y={33+dy} width={4} height={4} fill="#44FF88"/>
            ))}
            {[[-20,0],[-16,-12],[-10,-18],[0,-22],[10,-18],[16,-12],[20,0],[16,12],[10,18],[0,22],[-10,18],[-16,12]].map(([dx,dy],i) => (
              <rect key={i} x={1035+dx} y={33+dy} width={2} height={2} fill="#AAFFCC"/>
            ))}
          </g>
          {/* FW5 — Purple x=1090 */}
          <g className="nr-fw5">
            <rect x="1088" y="14" width="6"  height="6"  fill="#FFFFFF"/>
            {[[-14,0],[-12,-8],[-6,-12],[0,-14],[6,-12],[12,-8],[14,0],[12,8],[6,12],[0,14],[-6,12],[-12,8]].map(([dx,dy],i) => (
              <rect key={i} x={1091+dx} y={17+dy} width={4} height={4} fill="#CC44FF"/>
            ))}
            {[[-22,0],[-18,-12],[-10,-20],[0,-24],[10,-20],[18,-12],[22,0],[18,12],[10,24],[-10,20],[-18,12]].map(([dx,dy],i) => (
              <rect key={i} x={1091+dx} y={17+dy} width={2} height={2} fill="#EECCFF"/>
            ))}
          </g>
        </>)}

        {/* ── RUNNER (最前面に描画してビル手前に表示) ── */}
        <g transform={`translate(${runnerX},100)`}>
          <g className="nr-run">
            {/* cap - dark, neon reflective stripe */}
            <rect x="4"  y="0"  width="6"  height="2"  fill="#1E1E1E"/>
            <rect x="2"  y="2"  width="12" height="3"  fill="#282828"/>
            <rect x="12" y="5"  width="5"  height="2"  fill="#202020"/>
            <rect x="2"  y="3"  width="12" height="1"  fill="#C5FF47" opacity={0.65}/>
            {/* head - dark skin */}
            <rect x="2"  y="3"  width="11" height="8"  fill="#AA6633"/>
            <rect x="11" y="5"  width="2"  height="2"  fill="#111111"/>
            <rect x="12" y="8"  width="2"  height="2"  fill="#552211"/>
            {/* neck */}
            <rect x="4"  y="11" width="3"  height="2"  fill="#AA6633"/>
            {/* torso - neon yellow-green */}
            <rect x="2"  y="13" width="11" height="7"  fill="#C5FF47"/>
            <rect x="2"  y="19" width="11" height="1"  fill="#AADD30"/>
            {/* front arm */}
            <rect x="12" y="15" width="3"  height="6"  fill="#AA6633"/>
            <rect x="12" y="20" width="5"  height="2"  fill="#AA6633"/>
            <rect x="15" y="11" width="3"  height="11" fill="#AA6633"/>
            <rect x="14" y="10" width="4"  height="3"  fill="#AA6633"/>
            {/* back arm */}
            <rect x="-3" y="15" width="6"  height="2"  fill="#AA6633"/>
            <rect x="-4" y="16" width="3"  height="5"  fill="#AA6633"/>
            {/* shorts - very dark */}
            <rect x="2"  y="20" width="11" height="4"  fill="#0D0D22"/>
            {/* front leg */}
            <rect x="7"  y="24" width="5"  height="5"  fill="#AA6633"/>
            <rect x="9"  y="28" width="4"  height="5"  fill="#AA6633"/>
            {/* front shoe - neon */}
            <rect x="9"  y="32" width="7"  height="3"  fill="#C5FF47"/>
            {/* back leg */}
            <rect x="-2" y="24" width="5"  height="4"  fill="#AA6633"/>
            <rect x="-2" y="19" width="4"  height="7"  fill="#AA6633"/>
            {/* back shoe - neon */}
            <rect x="-4" y="17" width="6"  height="3"  fill="#C5FF47"/>
          </g>
        </g>

      </svg>
    </div>
  );
};

export default function TownPage() {
  const { isDark } = useTheme();
  const [viewTab, setViewTab] = useState<'my' | 'group'>('my');
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [groupMembers, setGroupMembers] = useState<{ name: string; km: number; color: string; icon: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 自分のkm
      const { data: runs } = await supabase.from('runs').select('distance').eq('user_id', user.id);
      if (runs) {
        const total = runs.reduce((sum, r) => sum + (r.distance || 0), 0);
        setTotalKm(Math.round(total * 10) / 10);
      }

      // 友人IDを取得
      const { data: friendships } = await supabase
        .from('friendships')
        .select('requester_id, receiver_id')
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const friendIds = friendships?.map(f =>
        f.requester_id === user.id ? f.receiver_id : f.requester_id
      ) || [];

      if (friendIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, icon')
          .in('id', friendIds);

        const { data: friendRuns } = await supabase
          .from('runs')
          .select('user_id, distance')
          .in('user_id', friendIds);

        const kmMap: Record<string, number> = {};
        friendRuns?.forEach(r => {
          kmMap[r.user_id] = (kmMap[r.user_id] || 0) + (r.distance || 0);
        });

        const colors = ['#FFD700', '#47B8FF', '#FF8547', '#B847FF', '#FF4D6A', '#10B981'];
        const memberData = profiles?.map((p, i) => ({
          name: p.name || 'ランナー',
          icon: p.icon || '👟',
          km: Math.round((kmMap[p.id] || 0) * 10) / 10,
          color: colors[i % colors.length],
        })).sort((a, b) => b.km - a.km) || [];

        setGroupMembers(memberData);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const nextUnlock = BUILDINGS.find(b => b.unlockedAt > totalKm);
  const buildings = BUILDINGS.map(b => ({ ...b, unlocked: totalKm >= b.unlockedAt }));

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div className="px-5 pt-12 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-xl font-bold tracking-tight">マイタウン</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>走るたびに街が育ちます</p>
      </div>

      <div className="px-5 pt-4 flex gap-2">
        {[
          { id: 'my',    label: '🏙️ 自分の街' },
          { id: 'group', label: '👥 グループの街' },
        ].map(t => (
          <button key={t.id} onClick={() => setViewTab(t.id as any)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
            style={{
              background: viewTab === t.id ? 'var(--accent-bg)' : 'var(--bg-card)',
              color: viewTab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              borderColor: viewTab === t.id ? 'var(--border-accent)' : 'var(--border)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {viewTab === 'my' && (
        <>
          <div className="mx-5 mt-4 rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: isDark ? '#0D0D20' : '#E8F4F8' }}>
            <div style={{ height: 160 }}>
              {isDark ? <NightTown km={totalKm}/> : <DayTown km={totalKm}/>}
            </div>
            <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm">
                累計 <span className="font-bold" style={{ color: 'var(--accent)' }}>{loading ? '...' : totalKm} km</span>
              </div>
              {nextUnlock && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--accent-3-bg)', color: 'var(--accent-3)' }}>
                  {nextUnlock.icon} {nextUnlock.name}まで {Math.max(0, nextUnlock.unlockedAt - totalKm).toFixed(1)}km
                </span>
              )}
            </div>
            <div className="px-4 pb-4">
              <ProgressBar
                value={totalKm}
                max={nextUnlock ? nextUnlock.unlockedAt : BUILDINGS[BUILDINGS.length - 1].unlockedAt}
                unit="km"
                label="次のアンロック"
                showLv={true}
                milestones={[
                  { value: 50,  icon: '🌳' },
                  { value: 100, icon: '🌳' },
                  { value: 150, icon: '🌉' },
                  { value: 200, icon: '☕' },
                  { value: 250, icon: '🌊' },
                  { value: 300, icon: '🏟️' },
                  { value: 350, icon: '📚' },
                  { value: 400, icon: '♨️' },
                  { value: 500, icon: '🏯' },
                  { value: 600, icon: '🎆' },
                  { value: 750, icon: '🚩' },
                ]}
              />
            </div>
          </div>

          <div className="px-5 pt-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>施設一覧</p>
            <div className="grid grid-cols-2 gap-3">
              {buildings.map((b, i) => (
                <div key={i} className="rounded-xl p-3 border flex items-center gap-3"
                  style={{
                    background: b.unlocked ? 'var(--accent-bg)' : 'var(--bg-card)',
                    borderColor: b.unlocked ? 'var(--border-accent)' : 'var(--border)',
                    opacity: b.unlocked ? 1 : 0.5,
                  }}>
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: b.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {b.name}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      {b.unlocked ? '✅ 解放済み' : `🔒 ${b.unlockedAt}kmで解放`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {viewTab === 'group' && (
        <div className="px-5 pt-4 flex flex-col gap-4">
          {loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-muted)' }}>読み込み中...</p>
          ) : groupMembers.length === 0 ? (
            <div className="rounded-2xl p-6 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-2xl mb-2">👥</p>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>まだ友人がいません</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>友人を追加するとここに街が表示されます</p>
              <a href="/profile" className="inline-block text-xs px-4 py-2 rounded-full font-semibold"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                友人を追加する →
              </a>
            </div>
          ) : (
            groupMembers.map((member, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: isDark ? '#0D0D20' : '#E8F4F8' }}>
                <div style={{ height: 160 }}>
                  {isDark ? <NightTown km={member.km}/> : <DayTown km={member.km}/>}
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg border"
                      style={{ background: `${member.color}20`, borderColor: `${member.color}55` }}>
                      {member.icon}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: member.color }}>{member.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{member.km} km</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}