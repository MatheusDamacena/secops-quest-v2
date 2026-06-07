// ─── MÓDULO 6 — FLUXOS POR FONTE DE LOG ──────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D } from '../components/GameUI';
import { useContent } from '../hooks/useContent';
import NodeIcon from '../components/NodeIcon';
import { FaHeartBroken, FaTrophy, FaCrosshairs, FaMapMarkerAlt, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { Lives } from '../components/GameUI';

const STYLE = `
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
  @keyframes glow { 0%,100%{opacity:.6} 50%{opacity:1} }
`;

// Animação de valor numérico (DX)
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

function PuzzleDetail({ puzzle, pIdx, totalPuzzles, nextPuzzle, onComplete, onBack }) {
  const blanks = puzzle.nodes.filter(n => n.blank);
  const [optionsCache] = useState(() =>
    [...blanks.map(b => b.label), ...puzzle.distractors].sort(() => Math.random() - 0.5)
  );

  const [phase,      setPhase]      = useState('build'); // build | animate | explain | done
  const [placed,     setPlaced]     = useState({});
  const [usedBank,   setUsedBank]   = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [errors,     setErrors]     = useState({});
  const [lives,      setLives]      = useState(3);
  const [animStep,   setAnimStep]   = useState(-1);
  const [explainIdx, setExplainIdx] = useState(0);
  const animXp = useAnimVal(phase === 'done' ? puzzle.xp : 0);

  // Animação sequencial dos nós
  useEffect(() => {
    if (phase !== 'animate') return;
    if (animStep >= puzzle.nodes.length) {
      setTimeout(() => setPhase('explain'), 400);
      return;
    }
    const t = setTimeout(() => setAnimStep(s => s + 1), 360);
    return () => clearTimeout(t);
  }, [phase, animStep]);

  // Verificar se todos os blanks foram preenchidos corretamente
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
    const idx = puzzle.nodes.findIndex(n => n.id === id);
    return phase === 'animate' && idx <= animStep;
  };

  const bankAvailable = optionsCache.filter(o => !usedBank.includes(o));
  const allPlaced = blanks.every(b => placed[b.id]);

  // ── SEM VIDAS ──
  if (lives <= 0) return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center' }}>
      <style>{STYLE}</style>
      <FaHeartBroken size={56} color='#ff4d4d' style={{ marginBottom:16 }} />
      <div style={{ fontFamily:F.display, color:C.red, fontSize:26, fontWeight:800, marginBottom:8 }}>Sem vidas!</div>
      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:14, marginBottom:24 }}>Tente o puzzle novamente.</div>
      <button onClick={() => { setPlaced({}); setUsedBank([]); setSelected(null); setErrors({}); setLives(3); setPhase('build'); setAnimStep(-1); }}
        style={{ background:puzzle.color||C.accent, color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px 32px', fontFamily:F.display, fontWeight:800, fontSize:18, cursor:'pointer', marginBottom:12 }}>
        ↺ TENTAR NOVAMENTE
      </button>
      <button onClick={onBack}
        style={{ background:'transparent', color:C.textDim, border:`1px solid ${C.border}`, borderRadius:14, padding:'13px 32px', fontFamily:F.display, fontWeight:700, fontSize:16, cursor:'pointer' }}>
        ← LISTA
      </button>
    </div>
  );

  // ── EXPLICAÇÃO ──
  if (phase === 'explain') {
    const expls = puzzle.explanation;
    const isLast = explainIdx >= expls.length - 1;
    const exp = expls[explainIdx];
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <style>{STYLE}</style>
        {/* Header */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'13px 18px', display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:22, cursor:'pointer' }}>‹</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:3 }}>M6 · {puzzle.title.toUpperCase()}</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:700 }}>Explicação do Fluxo</div>
          </div>
          <span style={{ fontFamily:F.mono, color:C.textDim, fontSize:14 }}>{explainIdx+1}/{expls.length}</span>
        </div>

        {/* Fluxo horizontal animado */}
        <div style={{ padding:'8px 18px', overflowX:'auto', background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:0, minWidth:'max-content' }}>
            {puzzle.nodes.map((node, i) => {
              const label = placed[node.id] || node.label;
              const isActive = label === exp.node;
              return (
                <div key={node.id} style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ background: isActive ? node.color+'33' : C.surface2, border:`1px solid ${isActive ? node.color : C.border}`, borderRadius:7, padding:'4px 8px', textAlign:'center', minWidth:55, transition:'all .3s' }}>
                    <NodeIcon icon={node.icon} color={node.color} size={16} />
                    <div style={{ fontFamily:F.mono, color: isActive ? node.color : C.textDim, fontSize:10, marginTop:1, whiteSpace:'nowrap' }}>
                      {label.split(' ')[0]}
                    </div>
                  </div>
                  {i < puzzle.nodes.length - 1 && (
                    <div style={{ width:8, height:1, background:C.border, flexShrink:0 }}/>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Explicação */}
        <div style={{ flex:1, padding:'16px 18px 120px', overflowY:'auto' }}>
          <div style={{ background:(puzzle.color||C.accent)+'16', border:`1px solid ${(puzzle.color||C.accent)}44`, borderRadius:14, padding:20 }}>
            <div style={{ fontFamily:F.mono, color:puzzle.color||C.accent, fontSize:11, letterSpacing:2, marginBottom:10 }}><><FaMapMarkerAlt size={11} style={{marginRight:4}} />{exp.node}</></div>
            <div style={{ fontFamily:F.mono, color:C.text, fontSize:14, lineHeight:1.9 }}>{exp.info}</div>
          </div>
        </div>

        {/* Botão */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 18px 32px', background:C.bg, borderTop:`1px solid ${C.border}` }}>
          <button onClick={() => {
            if (isLast) { onComplete(puzzle.xp); setPhase('done'); }
            else setExplainIdx(i => i + 1);
          }} style={{ width:'100%', background: isLast ? C.green : (puzzle.color||C.accent), color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:18, cursor:'pointer', boxShadow:`0 0 24px ${isLast ? C.green : (puzzle.color||C.accent)}44` }}>
            {isLast ? <><FaTrophy size={14} style={{marginRight:6}} /> CONCLUIR PUZZLE</> : 'PRÓXIMA ETAPA →'}
          </button>
        </div>
      </div>
    );
  }

  // ── CONCLUÍDO ──
  if (phase === 'done') return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center' }}>
      <style>{STYLE}</style>
      <FaCrosshairs size={64} color='#22d3a0' style={{ marginBottom:12 }} />
      <div style={{ fontFamily:F.display, fontSize:26, fontWeight:800, color:C.green, marginBottom:6 }}>FLUXO COMPLETO!</div>
      <div style={{ fontFamily:F.display, fontSize:32, color:C.yellow, marginBottom:4 }}>+{animXp} DX</div>
      <div style={{ fontFamily:F.mono, color:puzzle.color||C.accent, fontSize:11, letterSpacing:2, marginBottom:32 }}>{puzzle.tag}</div>
      <div style={{ width:'100%', maxWidth:400 }}>
        <button onClick={() => onBack()}
          style={{ width:'100%', background:C.green, color:'#fff', border:'none',
            borderBottom:`4px solid ${C.btn3d_green}`, borderRadius:14,
            padding:'16px', fontFamily:F.display, fontWeight:900,
            fontSize:18, cursor:'pointer' }}>
          CONCLUÍDO →
        </button>
      </div>
    </div>
  );

  // ── BUILD (puzzle principal) ──
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <style>{STYLE}</style>

      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'13px 18px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:22, cursor:'pointer' }}>‹</button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:3 }}>M6 · {(puzzle.tag||'').toUpperCase()}</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:700 }}>{puzzle.title}</div>
        </div>
        {/* Vidas */}
        <div style={{ display:'flex', gap:3 }}>
          <Lives count={lives} />
        </div>
      </div>

      {/* Story + instrução */}
      <div style={{ padding:'10px 18px', background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.7 }}>{puzzle.story}</div>
        {selected && (
          <div style={{ fontFamily:F.mono, color:puzzle.color||C.accent, fontSize:14, marginTop:6 }}>
            ✦ "{selected}" — toque num slot
          </div>
        )}
      </div>

      {/* Fluxo de nós */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px max(16px, calc((100% - 568px) / 2)) 8px' }}>
        {puzzle.nodes.map((node, i) => {
          const anim = isAnim(node.id);
          const hasPlaced = placed[node.id];
          const isError = errors[node.id];
          return (
            <div key={node.id} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              {/* Seta entre nós */}
              {i > 0 && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'2px 0' }}>
                  <div style={{ width:2, height:14, background: anim ? (puzzle.color||C.accent) : C.border, transition:'background .3s', borderRadius:2 }}/>
                  <div style={{ width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`6px solid ${anim ? (puzzle.color||C.accent) : C.border}`, transition:'border-top-color .3s' }}/>
                </div>
              )}
              {node.blank ? (
                // Slot vazio
                <div onClick={() => { if (hasPlaced) { remove(node.id); return; } if (selected) tap(node.id, node.label); }}
                  style={{
                    background: isError ? 'rgba(255,77,77,.12)' : hasPlaced ? node.color+'20' : selected ? '#0a1520' : C.surface,
                    border: `2px solid ${isError ? C.red : hasPlaced ? node.color : selected ? (puzzle.color||C.accent)+'66' : C.border}`,
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
                        <div style={{ fontFamily:F.display, color:node.color, fontSize:18, fontWeight:700 }}>{hasPlaced}</div>
                        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginTop:1 }}>{node.sub}</div>
                      </div>
                      <FaTimes size={14} color={C.textDim} />
                    </>
                  ) : (
                    <>
                      <div style={{ width:20, height:20, borderRadius:5, border:`2px dashed ${selected ? (puzzle.color||C.accent) : C.textDim}`, flexShrink:0 }}/>
                      <div style={{ fontFamily:F.mono, color: selected ? (puzzle.color||C.accent) : C.textDim, fontSize:14 }}>
                        {selected ? '← toque para colocar' : '← slot vazio'}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Nó fixo
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
                    <div style={{ fontFamily:F.display, color: anim ? node.color : C.text, fontSize:18, fontWeight:700, transition:'color .3s' }}>{node.label}</div>
                    <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginTop:1 }}>{node.sub}</div>
                  </div>
                  {anim && <div style={{ width:7, height:7, borderRadius:'50%', background:node.color, boxShadow:`0 0 7px ${node.color}`, animation:'glow 1s infinite' }}/>}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height:160 }}/>
      </div>

      {/* Banco de peças */}
      {phase === 'build' && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, padding:'12px 18px 28px' }}>
          {bankAvailable.length === 0 && allPlaced ? (
            <button onClick={() => { setPhase('animate'); setAnimStep(0); }}
              style={{ width:'100%', background:puzzle.color||C.accent, color:'#0a0b0c', border:'none', borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:18, cursor:'pointer', boxShadow:`0 0 24px ${puzzle.color||C.accent}44`, marginBottom:8 }}>
              <><FaTrophy size={14} style={{marginRight:6}} /> VER RESULTADO</>
            </button>
          ) : (
            <>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:8 }}>
                BANCO DE PEÇAS · {Object.keys(placed).length}/{blanks.length} colocados
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {bankAvailable.map(opt => (
                  <button key={opt} onClick={() => setSelected(s => s === opt ? null : opt)}
                    style={{
                      background: selected === opt ? (puzzle.color||C.accent)+'22' : C.surface2,
                      border: `2px solid ${selected === opt ? (puzzle.color||C.accent) : C.border}`,
                      borderRadius:9, padding:'7px 13px',
                      fontFamily:F.mono, color: selected === opt ? (puzzle.color||C.accent) : C.textDim,
                      fontSize:13, cursor:'pointer', transition:'all .15s',
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

export default function M6Screen({ progress, onComplete, onBack, lang = 'pt', t = k => k }) {
  const { M6_PUZZLES } = useContent(lang);
  const done = progress?.m6 || [];
  const [puzzleId,  setPuzzleId]  = useState(null);
  const [xpEarned,  setXpEarned]  = useState(0);

  const handleComplete = (xp) => {
    setXpEarned(x => x + xp);
    const newDone = done.includes(puzzleId) ? done : [...done, puzzleId];
    onComplete({ m6: newDone }, xp, newDone.length >= M6_PUZZLES.length);
  };

  const handleBack = (action) => {
    if (action === 'next' && puzzleId + 1 < M6_PUZZLES.length) {
      setPuzzleId(puzzleId + 1);
    } else {
      setPuzzleId(null);
    }
  };

  if (puzzleId !== null) {
    return (
      <PuzzleDetail
        puzzle={M6_PUZZLES[puzzleId]}
        pIdx={puzzleId}
        totalPuzzles={M6_PUZZLES.length}
        nextPuzzle={M6_PUZZLES[puzzleId + 1] || null}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'13px 18px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:22, cursor:'pointer' }}>‹</button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:3 }}>MÓDULO 6</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:700 }}>Fluxos por Fonte de Log</div>
        </div>
        <span style={{ fontFamily:F.mono, color:C.orange, fontSize:12, background:C.orange+'18', border:`1px solid ${C.orange}44`, borderRadius:20, padding:'3px 10px' }}>
          {done.length}/{M6_PUZZLES.length}
        </span>
      </div>

      {/* Intro */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px max(16px, calc((100% - 568px) / 2)) 40px' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.8, marginBottom:16, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 14px' }}>
          Agora que você domina UDM, YARA-L e as missões de detecção, monte os fluxos reais de cada tipo de fonte — com todos os detalhes técnicos.
        </div>
        {M6_PUZZLES.map((puzzle, idx) => {
          const isDone = done.includes(idx);
          return (
            <div key={puzzle.id} onClick={() => setPuzzleId(idx)}
              style={{ background: C.surface, border:`1px solid ${isDone ? (puzzle.color||C.accent)+'55' : C.border}`, borderRadius:14, padding:'14px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <div style={{ width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}><NodeIcon icon={isDone ? '✅' : puzzle.emoji} size={16} /></div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:700 }}>{puzzle.title}</div>
                <div style={{ fontFamily:F.mono, color:puzzle.color||C.accent, fontSize:12, marginTop:2, letterSpacing:1 }}>{puzzle.tag}</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginTop:2 }}>
                  {isDone ? `✓ +${puzzle.xp} DX` : `${puzzle.nodes.filter(n=>n.blank).length} etapas · +${puzzle.xp} DX`}
                </div>
              </div>
              <div style={{ color:C.textDim, fontSize:18 }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
