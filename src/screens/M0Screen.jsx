// ─── MÓDULO 0 — PUZZLE DE ARQUITETURA SECOPS ──────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { C, F } from '../styles/tokens';
import { M0_PUZZLE } from '../data/content';
import NodeIcon from '../components/NodeIcon';
import { FaHeartBroken, FaTrophy, FaCrosshairs, FaMapMarkerAlt, FaTimes, FaSyncAlt, FaShieldAlt } from 'react-icons/fa';
import { Lives } from '../components/GameUI';

const STYLE = `
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
  @keyframes glow { 0%,100%{opacity:.6} 50%{opacity:1} }
`;

function useAnimVal(target) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!target) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    ref.current = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(ref.current);
    }, 30);
    return () => clearInterval(ref.current);
  }, [target]);
  return val;
}

export default function M0Screen({ onComplete, onBack }) {
  const blanks = M0_PUZZLE.nodes.filter(n => n.blank);
  const [optionsCache] = useState(() =>
    [...blanks.map(b => b.label), ...M0_PUZZLE.distractors].sort(() => Math.random() - 0.5)
  );

  const [phase,      setPhase]      = useState('build');
  const [placed,     setPlaced]     = useState({});
  const [usedBank,   setUsedBank]   = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [errors,     setErrors]     = useState({});
  const [lives,      setLives]      = useState(3);
  const [animStep,   setAnimStep]   = useState(-1);
  const [explainIdx, setExplainIdx] = useState(0);
  const totalXp = blanks.length * 20;
  const animXp  = useAnimVal(phase === 'done' ? totalXp : 0);

  useEffect(() => {
    if (phase !== 'animate') return;
    if (animStep >= M0_PUZZLE.nodes.length) { setTimeout(() => setPhase('explain'), 400); return; }
    const t = setTimeout(() => setAnimStep(s => s + 1), 360);
    return () => clearTimeout(t);
  }, [phase, animStep]);

  useEffect(() => {
    if (phase !== 'build') return;
    if (blanks.every(b => placed[b.id] === b.label)) {
      setTimeout(() => { setPhase('animate'); setAnimStep(0); }, 400);
    }
  }, [placed]);

  const tap = (nodeId, correct) => {
    if (!selected) return;
    if (selected === correct) {
      setPlaced(p => ({ ...p, [nodeId]: selected }));
      setUsedBank(u => [...u, selected]);
      setSelected(null);
    } else {
      setErrors(e => ({ ...e, [nodeId]: true }));
      setLives(l => l - 1);
      setTimeout(() => setErrors(e => { const n = {...e}; delete n[nodeId]; return n; }), 600);
      setSelected(null);
    }
  };

  const remove = (nodeId) => {
    const label = placed[nodeId];
    setPlaced(p => { const n = {...p}; delete n[nodeId]; return n; });
    setUsedBank(u => u.filter(x => x !== label));
  };

  const isAnim = (id) => {
    const idx = M0_PUZZLE.nodes.findIndex(n => n.id === id);
    return phase === 'animate' && idx <= animStep;
  };

  const bankAvailable = optionsCache.filter(o => !usedBank.includes(o));
  const allPlaced = blanks.every(b => placed[b.id]);

  // ── SEM VIDAS ──
  if (lives <= 0) return (
    <div className='sq-module-root' style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center' }}>
      <style>{STYLE}</style>
      <FaHeartBroken size={56} color='#ff4d4d' style={{ marginBottom:16 }} />
      <div style={{ fontFamily:F.display, color:C.red, fontSize:'clamp(22px, 5vw, 28px)', fontWeight:800, marginBottom:8 }}>Sem vidas!</div>
      <button onClick={() => { setPlaced({}); setUsedBank([]); setSelected(null); setErrors({}); setLives(3); setPhase('build'); setAnimStep(-1); }}
        style={{ background:C.accent, color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px 32px', fontFamily:F.display, fontWeight:800, fontSize:'clamp(17px, 3.5vw, 20px)', cursor:'pointer' }}>
        ↺ TENTAR NOVAMENTE
      </button>
    </div>
  );

  // ── EXPLICAÇÃO ──
  if (phase === 'explain') {
    const expls = M0_PUZZLE.explanation;
    const isLast = explainIdx >= expls.length - 1;
    const exp = expls[explainIdx];
    return (
      <div style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column' }}>
        <style>{STYLE}</style>
        <div className='sq-mobile-only' style={{ background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", padding:'13px 18px', display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:'clamp(20px, 4.5vw, 24px)', cursor:'pointer' }}>‹</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', letterSpacing:3 }}>MÓDULO 1 · ARQUITETURA SECOPS</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:'clamp(18px, 4vw, 22px)', fontWeight:700 }}>Explicação do Fluxo</div>
          </div>
          <span style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(14px, 2.5vw, 16px)' }}>{explainIdx+1}/{expls.length}</span>
        </div>

        {/* Fluxo horizontal */}
        <div style={{ padding:'8px 18px', overflowX:'auto', background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:0, minWidth:'max-content' }}>
            {M0_PUZZLE.nodes.map((node, i) => {
              const label = placed[node.id] || node.label;
              const isActive = label === exp.node;
              return (
                <div key={node.id} style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ background: isActive ? node.color+'33' : C.surface2, border:`1px solid ${isActive ? node.color : C.border}`, borderRadius:7, padding:'4px 8px', textAlign:'center', minWidth:55, transition:'all .3s' }}>
                    <NodeIcon icon={node.icon} color={node.color} size={16} />
                    <div style={{ fontFamily:F.mono, color: isActive ? node.color : C.textDim, fontSize:'clamp(14px, 2.5vw, 16px)', marginTop:1, whiteSpace:'nowrap' }}>
                      {label.split(' ')[0]}
                    </div>
                  </div>
                  {i < M0_PUZZLE.nodes.length - 1 && <div style={{ width:8, height:1, background:C.border, flexShrink:0 }}/>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex:1, padding:'16px 18px 120px', overflowY:'auto' }}>
          <div style={{ background:C.accent+'16', border:`1px solid ${C.accent}44`, borderRadius:14, padding:20 }}>
            <div style={{ fontFamily:F.mono, color:C.accent, fontSize:'clamp(15px, 2.8vw, 17px)', letterSpacing:2, marginBottom:10 }}><><FaMapMarkerAlt size={11} style={{marginRight:4}} />{exp.node}</></div>
            <div style={{ fontFamily:F.mono, color:C.text, fontSize:'clamp(14px, 2.5vw, 16px)', lineHeight:1.9 }}>{exp.info}</div>
          </div>
        </div>

        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 18px 32px', background:'#131f24', borderTop:`1px solid ${C.border}` }}>
          <button onClick={() => {
            if (isLast) { onComplete({ m0: true }, totalXp, true); setPhase('done'); }
            else setExplainIdx(i => i + 1);
          }} style={{ width:'100%', background: isLast ? C.green : C.accent, color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:'clamp(17px, 3.5vw, 20px)', cursor:'pointer', boxShadow:`0 0 24px ${isLast ? C.green : C.accent}44` }}>
            {isLast ? <><FaTrophy size={14} style={{marginRight:6}} /> CONCLUIR MÓDULO</> : 'PRÓXIMA ETAPA →'}
          </button>
        </div>
      </div>
    );
  }

  // ── CONCLUÍDO ──
  if (phase === 'done') return (
    <div style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center' }}>
      <style>{STYLE}</style>
      <FaCrosshairs size={64} color='#22d3a0' style={{ marginBottom:12 }} />
      <div style={{ fontFamily:F.display, fontSize:'clamp(22px, 5vw, 28px)', fontWeight:800, color:C.green, marginBottom:6 }}>FLUXO COMPLETO!</div>
      <div style={{ fontFamily:F.display, fontSize:'clamp(26px, 6vw, 34px)', color:C.yellow, marginBottom:28 }}>+{animXp} DX</div>
      <button onClick={onBack}
        style={{ background:C.green, color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px 40px', fontFamily:F.display, fontWeight:800, fontSize:'clamp(17px, 3.5vw, 20px)', cursor:'pointer', boxShadow:`0 0 24px ${C.green}44` }}>
        ← VOLTAR AO INÍCIO
      </button>
    </div>
  );

  // ── BUILD ──
  return (
    <div style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column' }}>
      <style>{STYLE}</style>

      <div style={{ background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", padding:'13px 18px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:'clamp(20px, 4.5vw, 24px)', cursor:'pointer' }}>‹</button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', letterSpacing:3 }}>MÓDULO 1 · INTRODUÇÃO</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:'clamp(18px, 4vw, 22px)', fontWeight:700 }}>Arquitetura SecOps</div>
        </div>
        <div style={{ display:'flex', gap:3 }}>
          <Lives count={lives} />
        </div>
      </div>

      <div style={{ padding:'10px 18px', background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', lineHeight:1.7 }}>
          Monte o fluxo genérico do Google SecOps — do dado bruto até a resposta automática.
        </div>
        {selected && (
          <div style={{ fontFamily:F.mono, color:C.accent, fontSize:'clamp(14px, 2.5vw, 16px)', marginTop:6 }}>
            ✦ "{selected}" — toque num slot vazio
          </div>
        )}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px max(16px, calc((100% - 568px) / 2)) 8px' }}>
        {M0_PUZZLE.nodes.map((node, i) => {
          const anim = isAnim(node.id);
          const hasPlaced = placed[node.id];
          const isError = errors[node.id];
          return (
            <div key={node.id} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              {i > 0 && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'2px 0' }}>
                  <div style={{ width:2, height:14, background: anim ? C.accent : C.border, transition:'background .3s', borderRadius:2 }}/>
                  <div style={{ width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`6px solid ${anim ? C.accent : C.border}`, transition:'border-top-color .3s' }}/>
                </div>
              )}
              {node.blank ? (
                <div onClick={() => { if (hasPlaced) { remove(node.id); return; } if (selected) tap(node.id, node.label); }}
                  style={{
                    background: isError ? 'rgba(255,77,77,.12)' : hasPlaced ? node.color+'20' : selected ? '#0a1520' : C.surface,
                    border: `2px solid ${isError ? C.red : hasPlaced ? node.color : selected ? C.accent+'66' : C.border}`,
                    borderRadius:12, padding:'10px 15px', width:'100%', maxWidth:380,
                    display:'flex', alignItems:'center', gap:12,
                    cursor: (selected || hasPlaced) ? 'pointer' : 'default',
                    transition:'all .2s',
                    animation: isError ? 'shake .3s ease' : (hasPlaced ? 'pop .2s ease' : 'none'),
                  }}>
                  {hasPlaced ? (
                    <>
                      <NodeIcon icon={node.icon} color={node.color} size={18} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:F.display, color:node.color, fontSize:'clamp(17px, 3.5vw, 20px)', fontWeight:700 }}>{hasPlaced}</div>
                        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(14px, 2.5vw, 16px)', marginTop:1 }}>{node.sub}</div>
                      </div>
                      <FaTimes size={14} color={C.textDim} />
                    </>
                  ) : (
                    <>
                      <div style={{ width:20, height:20, borderRadius:5, border:`2px dashed ${selected ? C.accent : C.textDim}`, flexShrink:0 }}/>
                      <div style={{ fontFamily:F.mono, color: selected ? C.accent : C.textDim, fontSize:'clamp(14px, 2.5vw, 16px)' }}>
                        {selected ? '← toque para colocar' : '← slot vazio'}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div style={{
                  background: anim ? node.color+'20' : C.surface,
                  border: `1px solid ${anim ? node.color : C.border}`,
                  borderRadius:12, padding:'10px 15px', width:'100%', maxWidth:380,
                  display:'flex', alignItems:'center', gap:12,
                  transition:'all .3s',
                  boxShadow: anim ? `0 0 14px ${node.color}44` : 'none',
                }}>
                  <NodeIcon icon={node.icon} color={node.color} size={18} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:F.display, color: anim ? node.color : C.text, fontSize:'clamp(17px, 3.5vw, 20px)', fontWeight:700, transition:'color .3s' }}>{node.label}</div>
                    <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(14px, 2.5vw, 16px)', marginTop:1 }}>{node.sub}</div>
                  </div>
                  {anim && <div style={{ width:7, height:7, borderRadius:'50%', background:node.color, boxShadow:`0 0 7px ${node.color}`, animation:'glow 1s infinite' }}/>}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height:160 }}/>
      </div>

      {/* Banco */}
      {phase === 'build' && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#1c2b32', borderTop:`1px solid ${C.border}`, padding:'12px 18px 28px' }}>
          {bankAvailable.length === 0 && allPlaced ? (
            <button onClick={() => { setPhase('animate'); setAnimStep(0); }}
              style={{ width:'100%', background:C.accent, color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:'clamp(17px, 3.5vw, 20px)', cursor:'pointer', boxShadow:`0 0 24px ${C.accent}44`, marginBottom:8 }}>
              <><FaTrophy size={14} style={{marginRight:6}} /> VER RESULTADO</>
            </button>
          ) : (
            <>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', letterSpacing:2, marginBottom:8 }}>
                BANCO DE PEÇAS · {Object.keys(placed).length}/{blanks.length} colocados
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {bankAvailable.map(opt => (
                  <button key={opt} onClick={() => setSelected(s => s === opt ? null : opt)}
                    style={{
                      background: selected === opt ? C.cyanDim : C.surface2,
                      border: `2px solid ${selected === opt ? C.accent : C.border}`,
                      borderRadius:9, padding:'7px 13px',
                      fontFamily:F.mono, color: selected === opt ? C.accent : C.textDim,
                      fontSize:'clamp(15px, 2.8vw, 17px)', cursor:'pointer', transition:'all .15s',
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
