import { useState, useEffect } from 'react';
import { getLeaderboard } from '../firebase/db';
import { FaTrophy, FaMedal, FaBolt, FaFire, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { C, F } from '../styles/tokens';
import Avatar from '../components/Avatar';

export default function LeaderboardScreen({ currentUserId, onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    getLeaderboard().then(data => { setEntries(data); setLoading(false); });
  }, [refresh]);

  const total = entries.length;
  const maxDx = entries[0]?.dx || 1;
  const promoteZone = 3;
  const demoteZone  = total >= 7 ? 3 : 0;
  const zoneColor   = (rank) => {
    if (rank <= promoteZone) return '#22d3a0';
    if (demoteZone > 0 && rank > total - demoteZone) return '#ff4d4d';
    return null;
  };
  const rankIcon = (rank, isGrandmaster) => {
    if (rank === 1 && isGrandmaster) return <FaTrophy size={24} color='#FFD700' style={{ filter:'drop-shadow(0 0 8px #FFD700)' }} />;
    if (rank === 1) return <FaMedal size={22} color='#FFD700' />;
    if (rank === 2) return <FaMedal size={20} color='#C0C0C0' />;
    if (rank === 3) return <FaMedal size={18} color='#CD7F32' />;
    return rank;
  };

  return (
    <div style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'#1c2b32', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer', minWidth:44, minHeight:44 }}>‹</button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>RANKING GLOBAL</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}><FaTrophy size={18} color={C.yellow} /> Leaderboard</div>
        </div>
        <button onClick={() => { setEntries([]); setRefresh(r => r+1); }}
          style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:10, color: loading ? C.accent : C.textDim, fontSize:18, cursor:'pointer', padding:'8px 12px' }}>
          {loading ? '⟳' : '↺'}
        </button>
      </div>

      {/* Legenda */}
      {!loading && total >= 7 && (
        <div style={{ display:'flex', gap:12, padding:'8px 16px 4px', justifyContent:'flex-end' }}>
          <span style={{ fontFamily:F.mono, fontSize:10, color:'#22d3a0', display:'flex', alignItems:'center', gap:3 }}><FaArrowUp size={9} /> PROMOÇÃO</span>
          <span style={{ fontFamily:F.mono, fontSize:10, color:'#ff4d4d', display:'flex', alignItems:'center', gap:3 }}><FaArrowDown size={9} /> REBAIXAMENTO</span>
        </div>
      )}

      <div style={{ flex:1, overflowY:'auto', padding:'8px 0 80px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:14 }}>Carregando ranking…</div>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <FaTrophy size={56} color={C.yellow} style={{ marginBottom:16 }} />
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:800, marginBottom:8 }}>Seja o primeiro!</div>
          </div>
        ) : (
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            {/* Separador zona promoção */}
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 16px 8px' }}>
              <div style={{ flex:1, height:1, background:'#22d3a044' }}/>
              <div style={{ fontFamily:F.mono, fontSize:10, color:'#22d3a0', letterSpacing:1 }}>⬆ ZONA DE PROMOÇÃO</div>
              <div style={{ flex:1, height:1, background:'#22d3a044' }}/>
            </div>

            {entries.map((entry, idx) => {
              const rank    = idx + 1;
              const isMe    = entry.userId === currentUserId;
              const zone    = zoneColor(rank);
              const barW    = Math.max(4, Math.round(((entry.dx||0) / maxDx) * 100));
              const showDemoteSep = demoteZone > 0 && rank === total - demoteZone + 1;

              return (
                <div key={entry.id}>
                  {showDemoteSep && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px 6px' }}>
                      <div style={{ flex:1, height:1, background:'#ff4d4d44' }}/>
                      <div style={{ fontFamily:F.mono, fontSize:10, color:'#ff4d4d', letterSpacing:1 }}>⬇ ZONA DE REBAIXAMENTO</div>
                      <div style={{ flex:1, height:1, background:'#ff4d4d44' }}/>
                    </div>
                  )}
                  <div style={{
                    margin:'0 16px 10px',
                    background: isMe ? (zone ? zone+'18' : 'rgba(255,75,122,0.1)') : '#1c2b32',
                    border:`1.5px solid ${isMe ? 'rgba(255,75,122,0.3)' : zone ? zone+'33' : 'rgba(255,255,255,0.06)'}`,
                    borderLeft:`4px solid ${isMe ? '#ff4b7a' : zone || 'rgba(255,255,255,0.1)'}`,
                    borderRadius:16, padding:'14px 16px',
                    display:'flex', alignItems:'center', gap:14, transition:'all .12s',
                  }}>
                    <div style={{ fontFamily:"'Roboto Mono',monospace", fontSize:rank<=3?20:15, fontWeight:900, color:zone||(isMe?'#ff4b7a':'rgba(255,255,255,0.3)'), minWidth:32, textAlign:'center', flexShrink:0 }}>
                      {rankIcon(rank, entry.grandmaster)}
                    </div>
                    <div style={{ fontSize:30, lineHeight:1, flexShrink:0 }}><Avatar profile={{ avatarId: entry.avatarId, avatarColor: entry.avatarColor }} size={36} /></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                        <div style={{ fontFamily:F.display, color:isMe?(zone||C.accent):C.text, fontSize:15, fontWeight:800, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                          {entry.name}
                        </div>
                        {isMe && <div style={{ fontFamily:F.mono, fontSize:10, color:zone||C.accent, background:(zone||C.accent)+'22', borderRadius:6, padding:'2px 7px', flexShrink:0, letterSpacing:1 }}>VOCÊ</div>}
                      </div>
                      <div style={{ height:6, background:C.border, borderRadius:99, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${barW}%`, background:isMe?(zone||C.accent):zone||C.cyan, borderRadius:99, transition:'width .6s ease' }}/>
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:F.display, fontSize:16, fontWeight:900, color:zone||(isMe?C.accent:C.text), display:'flex', alignItems:'center', gap:4 }}><FaBolt size={12} />{entry.dx||0} DX</div>
                      <div style={{ fontFamily:F.mono, fontSize:11, color:C.textDim, marginTop:2, display:'flex', alignItems:'center', gap:4 }}><FaFire size={10} color={C.orange} />{entry.streak||0} dias</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
