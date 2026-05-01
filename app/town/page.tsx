'use client';

import { useState, useEffect } from 'react';
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

const groupMembers = [
  { name: '田中', km: 312, color: '#FFD700' },
  { name: '鈴木', km: 198, color: '#47B8FF' },
  { name: '山本', km: 156, color: '#FF8547' },
  { name: '佐藤', km: 89,  color: '#B847FF' },
];

const DayTown = ({ km }: { km: number }) => (
  <svg viewBox="0 0 360 160" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="daysky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB"/>
        <stop offset="100%" stopColor="#C9E8F5"/>
      </linearGradient>
    </defs>
    <rect width="360" height="160" fill="url(#daysky)"/>
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

    {/* 50km: 木 */}
    {km >= 50 && (
      <>
        <rect x="109" y="120" width="5" height="10" fill="#5D4037"/>
        <circle cx="111" cy="113" r="9" fill="#388E3C"/>
        <circle cx="111" cy="113" r="6" fill="#43A047"/>
      </>
    )}

    {/* 100km: 公園 */}
    {km >= 100 && (
      <>
        <rect x="120" y="118" width="16" height="12" fill="#388E3C" rx="1"/>
        <circle cx="128" cy="112" r="10" fill="#2E7D32"/>
        <circle cx="128" cy="112" r="7" fill="#388E3C"/>
        <rect x="118" y="125" width="24" height="5" fill="#1B5E20" rx="1"/>
      </>
    )}

    {/* 150km: 橋 */}
    {km >= 150 && (
      <>
        <rect x="262" y="122" width="52" height="8" fill="#757575" rx="2"/>
        <path d="M264 122 Q278 108 288 122" stroke="#9E9E9E" strokeWidth="3" fill="none"/>
        <path d="M288 122 Q298 108 314 122" stroke="#9E9E9E" strokeWidth="3" fill="none"/>
        <rect x="276" y="106" width="3" height="16" fill="#616161"/>
        <rect x="301" y="106" width="3" height="16" fill="#616161"/>
      </>
    )}

    {/* 200km: カフェ */}
    {km >= 200 && (
      <>
        <rect x="262" y="88" width="25" height="40" fill="#FFCCBC" rx="2"/>
        <rect x="262" y="83" width="25" height="7" fill="#FF8A65" rx="1"/>
        <rect x="265" y="95" width="8" height="10" fill="#87CEEB" opacity="0.8"/>
        <rect x="277" y="95" width="7" height="10" fill="#87CEEB" opacity="0.8"/>
        <rect x="270" y="110" width="10" height="12" fill="#8D6E63" rx="1"/>
        <text x="274" y="81" textAnchor="middle" fontSize="6" fill="#BF360C" fontFamily="sans-serif">CAFE</text>
      </>
    )}

    {/* 250km: 川・森 */}
    {km >= 250 && (
      <>
        <rect x="290" y="118" width="35" height="12" fill="#29B6F6" rx="2" opacity="0.8"/>
        <rect x="290" y="100" width="5" height="20" fill="#5D4037"/>
        <circle cx="292" cy="95" r="10" fill="#1B5E20"/>
        <circle cx="292" cy="95" r="7" fill="#2E7D32"/>
        <rect x="304" y="105" width="5" height="15" fill="#5D4037"/>
        <circle cx="306" cy="100" r="9" fill="#33691E"/>
      </>
    )}

    {/* 300km: スタジアム */}
    {km >= 300 ? (
      <>
        <ellipse cx="338" cy="116" rx="20" ry="12" fill="#81C784" stroke="#4CAF50" strokeWidth="1.5"/>
        <ellipse cx="338" cy="116" rx="13" ry="7" fill="#A5D6A7"/>
        <ellipse cx="338" cy="116" rx="6" ry="3" fill="#66BB6A"/>
        <text x="338" y="119" textAnchor="middle" fontSize="5" fill="#1B5E20" fontFamily="sans-serif" fontWeight="bold">STADIUM</text>
      </>
    ) : (
      <>
        <ellipse cx="338" cy="116" rx="19" ry="11" fill="none" stroke="#BDBDBD" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="338" y="113" textAnchor="middle" fontSize="7" fill="#BDBDBD">🔒</text>
        <text x="338" y="121" textAnchor="middle" fontSize="5" fill="#BDBDBD" fontFamily="sans-serif">STADIUM</text>
      </>
    )}

    {/* 350km: 図書館 */}
    {km >= 350 && (
      <>
        <rect x="4" y="55" width="30" height="38" fill="#CE93D8" rx="2"/>
        <rect x="4" y="50" width="30" height="7" fill="#AB47BC" rx="1"/>
        <rect x="4" y="44" width="30" height="8" fill="#9C27B0" rx="1"/>
        {[0,1,2].map(col => [0,1].map(row => (
          <rect key={`lib-${col}-${row}`} x={7+col*10} y={60+row*14} width={7} height={10} fill="#F3E5F5" opacity={0.9}/>
        )))}
        <text x="19" y="48" textAnchor="middle" fontSize="5" fill="#F3E5F5" fontFamily="sans-serif">LIBRARY</text>
      </>
    )}

    {/* 400km: 温泉 */}
    {km >= 400 && (
      <>
        <rect x="36" y="38" width="30" height="28" fill="#FFAB91" rx="2"/>
        <rect x="36" y="33" width="30" height="7" fill="#FF7043" rx="1"/>
        <ellipse cx="46" cy="50" rx="4" ry="6" fill="white" opacity="0.5"/>
        <ellipse cx="56" cy="48" rx="4" ry="6" fill="white" opacity="0.5"/>
        <text x="51" y="31" textAnchor="middle" fontSize="5" fill="#BF360C" fontFamily="sans-serif">♨ SPA</text>
      </>
    )}

    {/* 500km: 城 */}
    {km >= 500 && (
      <>
        <rect x="108" y="58" width="40" height="68" fill="#ECEFF1" rx="1"/>
        <rect x="104" y="53" width="48" height="8" fill="#CFD8DC" rx="1"/>
        <rect x="108" y="40" width="12" height="16" fill="#B0BEC5" rx="1"/>
        <rect x="128" y="40" width="12" height="16" fill="#B0BEC5" rx="1"/>
        <rect x="113" y="33" width="4" height="9" fill="#90A4AE"/>
        <rect x="131" y="33" width="4" height="9" fill="#90A4AE"/>
        {[0,1,2].map(col => [0,1,2,3].map(row => (
          <rect key={`castle-${col}-${row}`} x={112+col*13} y={62+row*14} width={9} height={10} fill="#B3E5FC" opacity={0.7}/>
        )))}
        <rect x="120" y="108" width="16" height="18" fill="#8D6E63" rx="1"/>
      </>
    )}

    {/* 600km: 花火 */}
    {km >= 600 && (
      <>
        <circle cx="280" cy="30" r="2" fill="#FF5252"/>
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`f1-${i}`}
            x1="280" y1="30"
            x2={280+Math.cos(i*Math.PI/4)*12} y2={30+Math.sin(i*Math.PI/4)*12}
            stroke="#FF5252" strokeWidth="1.5" opacity="0.8"/>
        ))}
        <circle cx="300" cy="20" r="2" fill="#FFD740"/>
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`f2-${i}`}
            x1="300" y1="20"
            x2={300+Math.cos(i*Math.PI/4)*10} y2={20+Math.sin(i*Math.PI/4)*10}
            stroke="#FFD740" strokeWidth="1.5" opacity="0.8"/>
        ))}
      </>
    )}

    {/* 750km: 城アップグレード */}
    {km >= 750 && (
      <>
        <rect x="117" y="23" width="3" height="12" fill="#F44336"/>
        <polygon points="120,23 130,27 120,31" fill="#F44336"/>
        <rect x="133" y="23" width="3" height="12" fill="#2196F3"/>
        <polygon points="136,23 146,27 136,31" fill="#2196F3"/>
      </>
    )}
  </svg>
);

const NightTown = ({ km }: { km: number }) => (
  <svg viewBox="0 0 360 160" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="nightsky2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#05050A"/>
        <stop offset="100%" stopColor="#0D0D22"/>
      </linearGradient>
    </defs>
    <rect width="360" height="160" fill="url(#nightsky2)"/>
    {[[15,8],[40,14],[80,5],[130,10],[180,4],[220,9],[270,6],[310,13],[345,7]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={0.9} fill="#EEEEF8" opacity="0.7"/>
    ))}
    <rect x="0" y="130" width="360" height="30" fill="#0D1A0D"/>
    <rect x="0" y="130" width="360" height="8" fill="#181828"/>
    {[0,35,70,105,140,175,210,245,280,315].map(x => (
      <rect key={x} x={x} y={133} width={22} height={3} fill="#2A2A48" opacity="0.7"/>
    ))}
    <rect x="5" y="95" width="25" height="37" fill="#1E1E3A" rx="1"/>
    <rect x="9"  y="100" width="6" height="6" fill="#FFB347" opacity="0.8"/>
    <rect x="18" y="100" width="6" height="6" fill="#C5FF47" opacity="0.6"/>
    <rect x="9"  y="110" width="6" height="6" fill="#C5FF47" opacity="0.5"/>
    <rect x="18" y="110" width="6" height="6" fill="#FFB347" opacity="0.4"/>
    <rect x="9"  y="120" width="6" height="6" fill="#FFB347" opacity="0.7"/>
    <rect x="36" y="55" width="32" height="77" fill="#252542" rx="1"/>
    <rect x="51" y="48" width="2" height="8" fill="#3A3A58"/>
    <circle cx="52" cy="47" r="2" fill="#FF4D4D" opacity="0.8"/>
    {[0,1,2].map(col => [0,1,2,3,4].map(row => (
      <rect key={`b2-${col}-${row}`} x={40+col*10} y={60+row*13} width={7} height={8}
        fill={col===1&&row===2 ? '#FFB347' : col===0&&row===0 ? '#FFB347' : col===2&&row===3 ? '#FFB347' : col===0&&row===4 ? '#FFB347' : '#C5FF47'}
        opacity={col===1&&row===1 ? 0.3 : col===2&&row===2 ? 0.2 : 0.7}/>
    )))}
    {km >= 100 && (
      <>
        <rect x="74" y="118" width="42" height="14" fill="#0F2010"/>
        <circle cx="85"  cy="116" r="9"  fill="#1A4020"/>
        <circle cx="97"  cy="118" r="7"  fill="#183818"/>
        <circle cx="108" cy="116" r="8"  fill="#1E4828"/>
        <circle cx="82"  cy="120" r="5"  fill="#122A14"/>
      </>
    )}
    <rect x="122" y="78" width="28" height="54" fill="#1E1E3A" rx="1"/>
    {[0,1].map(col => [0,1,2].map(row => (
      <rect key={`b3-${col}-${row}`} x={126+col*13} y={83+row*14} width={9} height={10}
        fill={col===0&&row===1 ? '#FFB347' : col===1&&row===0 ? '#FFB347' : '#C5FF47'}
        opacity={col===0&&row===2 ? 0.3 : 0.7}/>
    )))}
    <rect x="156" y="38" width="38" height="94" fill="#28284A" rx="1"/>
    <rect x="170" y="30" width="10" height="10" fill="#2E2E50"/>
    <rect x="173" y="27" width="4" height="5"  fill="#3A3A60"/>
    {[0,1].map(col => [0,1,2,3,4,5].map(row => (
      <rect key={`b4-${col}-${row}`} x={161+col*16} y={44+row*13} width={11} height={9}
        fill={col===0&&row===0 ? '#FFB347' : col===1&&row===2 ? '#FFB347' : col===0&&row===4 ? '#FFB347' : col===1&&row===5 ? '#FFB347' : '#C5FF47'}
        opacity={col===0&&row===3 ? 0.25 : col===1&&row===1 ? 0.3 : 0.8}/>
    )))}
    {km >= 150 && (
      <>
        <rect x="202" y="118" width="56" height="14" fill="#0A1828" rx="2"/>
        <path d="M202 121 Q218 114 230 121 Q242 128 258 121" stroke="#1A3A5A" strokeWidth="2" fill="none"/>
        <rect x="214" y="112" width="3" height="10" fill="#1E3850"/>
        <rect x="242" y="112" width="3" height="10" fill="#1E3850"/>
      </>
    )}
    <rect x="206" y="72" width="24" height="58" fill="#1C1C38" rx="1"/>
    {[0,1].map(col => [0,1,2,3].map(row => (
      <rect key={`b5-${col}-${row}`} x={210+col*11} y={77+row*13} width={8} height={9}
        fill={col===0&&row===1 ? '#FFB347' : col===1&&row===3 ? '#FFB347' : '#C5FF47'}
        opacity={col===1&&row===0 ? 0.3 : 0.7}/>
    )))}
    <rect x="236" y="50" width="30" height="82" fill="#202040" rx="1"/>
    <rect x="238" y="52" width="8" height="78" fill="#ffffff" opacity="0.04"/>
    {[0,1].map(col => [0,1,2,3,4,5].map(row => (
      <rect key={`b6-${col}-${row}`} x={240+col*13} y={56+row*12} width={9} height={8}
        fill={col===0&&row===2 ? '#FFB347' : col===1&&row===0 ? '#FFB347' : col===0&&row===5 ? '#FFB347' : '#47B8FF'}
        opacity={col===1&&row===3 ? 0.25 : col===0&&row===1 ? 0.3 : 0.7}/>
    )))}
    {km >= 300 ? (
      <>
        <ellipse cx="318" cy="112" rx="34" ry="20" fill="#1A2A1A" stroke="#C5FF47" strokeWidth="1.2"/>
        <ellipse cx="318" cy="112" rx="22" ry="13" fill="#0A1A0A"/>
        <text x="318" y="116" textAnchor="middle" fontSize="9" fill="#C5FF47" opacity="0.9" fontFamily="sans-serif">STADIUM</text>
      </>
    ) : (
      <>
        <ellipse cx="318" cy="112" rx="32" ry="18" fill="none" stroke="#C5FF47" strokeWidth="1" opacity="0.25" strokeDasharray="4 3"/>
        <text x="318" y="110" textAnchor="middle" fontSize="7" fill="#C5FF47" opacity="0.3" fontFamily="sans-serif">🔒</text>
        <text x="318" y="119" textAnchor="middle" fontSize="6" fill="#C5FF47" opacity="0.25" fontFamily="sans-serif">STADIUM</text>
      </>
    )}
    <circle cx="335" cy="22" r="10" fill="#2A2A40"/>
    <circle cx="330" cy="19" r="10" fill="#05050A"/>
    <circle cx="345" cy="18" r="4"  fill="#3A3A58" opacity="0.4"/>
  </svg>
);

export default function TownPage() {
  const { isDark } = useTheme();
  const [viewTab, setViewTab] = useState<'my' | 'group'>('my');
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: runs } = await supabase.from('runs').select('distance').eq('user_id', user.id);
      if (runs) {
        const total = runs.reduce((sum, r) => sum + (r.distance || 0), 0);
        setTotalKm(Math.round(total * 10) / 10);
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
            <div style={{ height: 200 }}>
              {isDark ? <NightTown km={totalKm}/> : <DayTown km={totalKm}/>}
            </div>
            <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm">
                累計 <span className="font-bold" style={{ color: 'var(--accent)' }}>{loading ? '...' : totalKm} km</span>
              </div>
              {nextUnlock && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--accent-3-bg)', color: 'var(--accent-3)' }}>
                  {nextUnlock.icon} {nextUnlock.name}まで {Math.max(0, nextUnlock.unlockedAt - totalKm)}km
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
          {groupMembers.map((member, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: isDark ? '#0D0D20' : '#E8F4F8' }}>
              <div style={{ height: 160 }}>
                {isDark ? <NightTown km={member.km}/> : <DayTown km={member.km}/>}
              </div>
              <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border"
                    style={{ background: `${member.color}20`, borderColor: `${member.color}55`, color: member.color }}>
                    {member.name[0]}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: member.color }}>{member.name}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{member.km} km</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}