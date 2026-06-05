// ─── MÓDULO 6 — FLUXOS E ONBOARDING ──────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D } from '../components/GameUI';
import { M6_PUZZLES } from '../data/content';

function PuzzleDetail({ puzzle, onComplete, onBack }) {
  const blanks  = puzzle.nodes.filter(n => n.blank);
  const options = [...blanks.map(n => n.label), ...puzzle.distractors]
    .sort(() => Math.random() - 0.5);

  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [xp,      setXp]      = useState(0);

  const allFilled  = blanks.every(b => answers[b.id]);
  const isCorrect  = (id) => answers[id] === blanks.find(b => b.id === id)?.label;

  const handleCheck = () => {
    let earned = 0;
    blanks.forEach(b => { if (answers[b.id] === b.label) earned += Math.round(puzzle.xp / blanks.length); });
    setXp(earned);
    setChecked(true);
  };

  if (showExp) {
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setShowExp(false)} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:900 }}>Explicações</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 40px', maxWidth:600, width:'100%', margin:'0 auto' }}>
          {puzzle.explanation.map((exp, i) => (
            <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px', marginBottom:12 }}>
              <div style={{ fontFamily:F.display, color:C.accent, fontSize:14, fontWeight:800, marginBottom:8 }}>{exp.node}</div>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.7 }}>{exp.info}</div>
            </div>
          ))}
          <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => onComplete(xp)}>
            CONCLUIR →
          </Btn3D>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
        <div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>{puzzle.tag}</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:900 }}>{puzzle.emoji} {puzzle.title}</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 140px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 14px', marginBottom:20 }}>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.6 }}>{puzzle.story}</div>
        </div>

        {puzzle.nodes.map((node, idx) => (
          <div key={node.id}>
            {idx > 0 && <div style={{ textAlign:'center', color:C.textDim, fontSize:20, margin:'2px 0' }}>↓</div>}
            {node.blank ? (
              <div style={{ background: checked ? (isCorrect(node.id) ? C.correctBg : C.wrongBg) : C.surface2,
                border:`2px dashed ${checked ? (isCorrect(node.id) ? C.correct : C.wrong) : answers[node.id] ? C.accent : C.border}`,
                borderRadius:14, padding:'12px 14px', minHeight:56, display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ fontSize:20 }}>{answers[node.id] ? (checked ? (isCorrect(node.id) ? '✅' : '❌') : '📍') : '❓'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:F.display, color: answers[node.id] ? (checked ? (isCorrect(node.id) ? C.correct : C.wrong) : C.accent) : C.textDim, fontSize:13, fontWeight:800 }}>
                    {answers[node.id] || '— selecione —'}
                  </div>
                  {checked && !isCorrect(node.id) && (
                    <div style={{ fontFamily:F.mono, color:C.correct, fontSize:11 }}>✓ {node.label}</div>
                  )}
                </div>
                {answers[node.id] && !checked && (
                  <button onClick={() => setAnswers(a => { const n={...a}; delete n[node.id]; return n; })}
                    style={{ background:'none', border:'none', color:C.textDim, fontSize:16, cursor:'pointer' }}>✕</button>
                )}
              </div>
            ) : (
              <div style={{ background:C.surface, border:`2px solid ${node.color}44`, borderBottom:`4px solid ${node.color}66`,
                borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ fontSize:20 }}>{node.icon}</div>
                <div>
                  <div style={{ fontFamily:F.display, color:node.color, fontSize:13, fontWeight:800 }}>{node.label}</div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{node.sub}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {!checked && (
          <div style={{ marginTop:20 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:10 }}>COMPONENTES</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {options.filter(opt => !Object.values(answers).includes(opt)).map(opt => (
                <button key={opt} onClick={() => {
                  const nextBlank = blanks.find(b => !answers[b.id]);
                  if (nextBlank) setAnswers(a => ({ ...a, [nextBlank.id]: opt }));
                }}
                  style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:10,
                    padding:'7px 12px', fontFamily:F.mono, color:C.text, fontSize:11, cursor:'pointer' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'14px 20px 28px', background:C.bg, borderTop:`1px solid ${C.border}` }}>
        {!checked ? (
          <Btn3D disabled={!allFilled} onClick={handleCheck}>VERIFICAR</Btn3D>
        ) : (
          <div>
            <div style={{ fontFamily:F.display, color:C.accent, fontSize:15, fontWeight:800, textAlign:'center', marginBottom:10 }}>
              🎉 +{xp} DX!
            </div>
            <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => setShowExp(true)}>
              VER EXPLICAÇÕES →
            </Btn3D>
          </div>
        )}
      </div>
    </div>
  );
}

export default function M6Screen({ progress, onComplete, onBack }) {
  const done = progress?.m6 || [];
  const [puzzleId, setPuzzleId] = useState(null);

  if (puzzleId !== null) {
    return (
      <PuzzleDetail puzzle={M6_PUZZLES[puzzleId]} onBack={() => setPuzzleId(null)}
        onComplete={(xp) => {
          const newDone = done.includes(puzzleId) ? done : [...done, puzzleId];
          onComplete({ m6: newDone }, xp, newDone.length >= M6_PUZZLES.length);
          setPuzzleId(null);
        }} />
    );
  }

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
        <div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>MÓDULO 6</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900 }}>🔌 Fluxos e Onboarding</div>
        </div>
        <div style={{ marginLeft:'auto', fontFamily:F.mono, color:C.accent, fontSize:12 }}>{done.length}/{M6_PUZZLES.length}</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {M6_PUZZLES.map((puzzle, idx) => {
          const isDone = done.includes(idx);
          return (
            <div key={puzzle.id} onClick={() => setPuzzleId(idx)}
              style={{ background:C.surface, border:`2px solid ${isDone ? C.green+'55' : C.border}`,
                borderBottom:`4px solid ${isDone ? C.btn3d_green : C.cardDepth}`,
                borderRadius:16, padding:'14px 16px', marginBottom:12,
                display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <div style={{ fontSize:32 }}>{isDone ? '✅' : puzzle.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{puzzle.title}</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>{puzzle.tag} · +{puzzle.xp} DX</div>
              </div>
              <div style={{ color:C.textDim, fontSize:20 }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
