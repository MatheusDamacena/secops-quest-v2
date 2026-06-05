// ─── MÓDULO 0 — PUZZLE DE ARQUITETURA ─────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D } from '../components/GameUI';
import { M0_PUZZLE } from '../data/content';

export default function M0Screen({ onComplete, onBack }) {
  const blanks  = M0_PUZZLE.nodes.filter(n => n.blank);
  const options = [...blanks.map(n => n.label), ...M0_PUZZLE.distractors]
    .sort(() => Math.random() - 0.5);

  const [answers,   setAnswers]   = useState({});
  const [checked,   setChecked]   = useState(false);
  const [showExp,   setShowExp]   = useState(false);
  const [xp,        setXp]        = useState(0);

  const allFilled = blanks.every(b => answers[b.id]);

  const handleCheck = () => {
    let earned = 0;
    blanks.forEach(b => { if (answers[b.id] === b.label) earned += 20; });
    setXp(earned);
    setChecked(true);
  };

  const isCorrect = (id) => answers[id] === blanks.find(b => b.id === id)?.label;

  if (showExp) {
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setShowExp(false)} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:900 }}>Explicações</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 40px', maxWidth:600, width:'100%', margin:'0 auto' }}>
          {M0_PUZZLE.explanation.map((exp, i) => (
            <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px', marginBottom:12 }}>
              <div style={{ fontFamily:F.display, color:C.accent, fontSize:14, fontWeight:800, marginBottom:8 }}>{exp.node}</div>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.7 }}>{exp.info}</div>
            </div>
          ))}
          <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => onComplete({ m0: true }, xp, true)}>
            CONCLUIR MÓDULO →
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
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>MÓDULO 0</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:900 }}>🏛 Arquitetura SecOps</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginBottom:20, lineHeight:1.6 }}>
          Monte o fluxo completo do Google SecOps arrastando os componentes corretos para os espaços em branco.
        </div>

        {/* Fluxo de nós */}
        {M0_PUZZLE.nodes.map((node, idx) => (
          <div key={node.id}>
            {idx > 0 && (
              <div style={{ textAlign:'center', color:C.textDim, fontSize:20, margin:'4px 0' }}>↓</div>
            )}
            {node.blank ? (
              // Espaço para preencher
              <div style={{ background: checked ? (isCorrect(node.id) ? C.correctBg : C.wrongBg) : C.surface2,
                border:`2px dashed ${checked ? (isCorrect(node.id) ? C.correct : C.wrong) : answers[node.id] ? C.accent : C.border}`,
                borderRadius:14, padding:'14px 16px', minHeight:64,
                display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ fontSize:24 }}>{answers[node.id] ? '✅' : '❓'}</div>
                <div>
                  <div style={{ fontFamily:F.display, color: answers[node.id] ? (checked ? (isCorrect(node.id) ? C.correct : C.wrong) : C.accent) : C.textDim,
                    fontSize:14, fontWeight:800 }}>
                    {answers[node.id] || '— selecione abaixo —'}
                  </div>
                  {checked && !isCorrect(node.id) && (
                    <div style={{ fontFamily:F.mono, color:C.correct, fontSize:11, marginTop:4 }}>
                      ✓ Correto: {node.label}
                    </div>
                  )}
                </div>
                {answers[node.id] && !checked && (
                  <button onClick={() => setAnswers(a => { const n = {...a}; delete n[node.id]; return n; })}
                    style={{ marginLeft:'auto', background:'none', border:'none', color:C.textDim, fontSize:18, cursor:'pointer' }}>✕</button>
                )}
              </div>
            ) : (
              // Nó fixo
              <div style={{ background:C.surface, border:`2px solid ${node.color}44`,
                borderBottom:`4px solid ${node.color}66`, borderRadius:14, padding:'14px 16px',
                display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ fontSize:24 }}>{node.icon}</div>
                <div>
                  <div style={{ fontFamily:F.display, color:node.color, fontSize:14, fontWeight:800 }}>{node.label}</div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{node.sub}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Opções */}
        {!checked && (
          <div style={{ marginTop:24 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:12 }}>COMPONENTES DISPONÍVEIS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {options.filter(opt => !Object.values(answers).includes(opt)).map(opt => (
                <button key={opt} onClick={() => {
                  const nextBlank = blanks.find(b => !answers[b.id]);
                  if (nextBlank) setAnswers(a => ({ ...a, [nextBlank.id]: opt }));
                }}
                  style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:10,
                    padding:'8px 14px', fontFamily:F.mono, color:C.text, fontSize:12, cursor:'pointer' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botão */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg, borderTop:`1px solid ${C.border}` }}>
        {!checked ? (
          <Btn3D disabled={!allFilled} onClick={handleCheck}>VERIFICAR</Btn3D>
        ) : (
          <div>
            <div style={{ fontFamily:F.display, color:C.accent, fontSize:16, fontWeight:800, textAlign:'center', marginBottom:12 }}>
              🎉 +{xp} DX conquistados!
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
