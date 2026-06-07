// ─── MÓDULO 4 — MISSÕES DE DETECÇÃO ──────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D, ProgressHeader } from '../components/GameUI';
import NodeIcon from '../components/NodeIcon';
import { FaGamepad, FaBolt } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { useContent } from '../hooks/useContent';

// ── Fase 1-4: Steps de seleção ────────────────────────────────────────────────
function StepsPhase({ mission, onDone }) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [answers,  setAnswers]  = useState({}); // { stepId: [optId,...] }
  const [selected, setSelected] = useState({});
  const [xp,       setXp]       = useState(0);

  const step = mission.steps[stepIdx];
  const totalSteps = mission.steps.length;
  const correctIds  = step.options.filter(o => o.correct).map(o => o.id);
  const selectedIds = Object.keys(selected).filter(k => selected[k]);
  const selCorrect  = selectedIds.filter(id => correctIds.includes(id));
  const selWrong    = selectedIds.filter(id => !correctIds.includes(id));
  const minRequired = step.minCorrect || correctIds.length;
  const canProceed  = selCorrect.length >= minRequired && selWrong.length === 0;

  const isLastStep = stepIdx + 1 === totalSteps;
  const nextLabel  = isLastStep
    ? '▶ TESTAR REGRA'
    : `PRÓXIMO: ${mission.steps[stepIdx + 1].label} ›`;

  const handleNext = () => {
    if (!canProceed) return;
    const xpEarned = Math.round(mission.xp / (totalSteps + 2));
    setXp(x => x + xpEarned);
    const newAnswers = { ...answers, [step.id]: selectedIds };
    setAnswers(newAnswers);
    setSelected({});
    if (isLastStep) {
      onDone(newAnswers, xp + xpEarned);
    } else {
      setStepIdx(i => i + 1);
    }
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <ProgressHeader current={stepIdx} total={totalSteps + 2} onBack={null} xpEarned={xp} />

      <div style={{ flex:1, padding:'20px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {/* Story */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 16px', marginBottom:16, fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.7 }}>
          {mission.story}
        </div>

        {/* Header da seção */}
        <div style={{ background:C.surface, border:`2px solid ${step.color}44`, borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <NodeIcon icon={step.icon} color={step.color} size={20} />
            <div style={{ fontFamily:F.display, color:step.color, fontSize:15, fontWeight:800 }}>{step.label}</div>
            {step.multi && <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, background:C.surface2, borderRadius:6, padding:'2px 8px' }}>múltipla escolha</div>}
          </div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.6 }}>{step.instruction}</div>
        </div>

        {/* Dica */}
        <div style={{ fontFamily:F.mono, fontSize:11, marginBottom:12, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span style={{ color:C.textDim }}>Mínimo {minRequired} correto(s) · sem erros</span>
          {selCorrect.length > 0 && selWrong.length === 0 && (
            <span style={{ color:C.green }}>✓ {selCorrect.length} certo{selCorrect.length > 1 ? 's' : ''}</span>
          )}
          {selWrong.length > 0 && (
            <span style={{ color:C.red }}>✗ {selWrong.length} errado(s)</span>
          )}
        </div>

        {/* Opções */}
        {step.options.map(opt => {
          const isSel   = selected[opt.id];
          const isWrong = isSel && !opt.correct;
          return (
            <div key={opt.id}
              onClick={() => setSelected(s =>
                step.multi ? { ...s, [opt.id]: !s[opt.id] } : { [opt.id]: true }
              )}
              style={{
                background: isWrong ? C.wrongBg : isSel ? '#2a1f00' : C.surface,
                border:`2px solid ${isWrong ? C.wrong : isSel ? C.amber : C.border}`,
                borderBottom:`4px solid ${isWrong ? C.btn3d_red : isSel ? '#a06000' : C.cardDepth}`,
                borderRadius:14, padding:'12px 14px', marginBottom:10, cursor:'pointer',
                fontFamily:F.mono, color: isWrong ? C.wrong : isSel ? C.amber : C.text,
                fontSize:12, lineHeight:1.5,
                display:'flex', alignItems:'center', gap:10,
              }}>
              <div style={{
                width:18, height:18, borderRadius: step.multi ? 4 : 9,
                border:`2px solid ${isWrong ? C.wrong : isSel ? C.amber : C.border}`,
                background: isSel ? (isWrong ? C.wrong : C.amber) : 'transparent',
                flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {isSel && <div style={{ width:8, height:8, borderRadius: step.multi ? 2 : 4, background:'#fff' }} />}
              </div>
              {opt.text}
            </div>
          );
        })}
      </div>

      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
        <button onClick={handleNext} disabled={!canProceed} style={{
          display:'block', margin:'0 auto', width:'100%', maxWidth:480,
          background: canProceed ? C.amber : C.surface2,
          border:'none', borderBottom:`4px solid ${canProceed ? '#a06000' : C.cardDepth}`,
          borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:16,
          color: canProceed ? '#fff' : C.textDim,
          cursor: canProceed ? 'pointer' : 'not-allowed', transition:'all .2s',
        }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

// ── Fase 5: Revisão da regra ──────────────────────────────────────────────────
function ReviewPhase({ mission, answers, xp, onExecute }) {
  // Montar a regra com as respostas do usuário
  const getAnswerTexts = (stepId) => {
    const step = mission.steps.find(s => s.id === stepId);
    if (!step) return [];
    const ids = answers[stepId] || [];
    return ids.map(id => step.options.find(o => o.id === id)?.text).filter(Boolean);
  };

  const meta      = getAnswerTexts('meta');
  const events    = getAnswerTexts('events');
  const match     = getAnswerTexts('match');
  const condition = getAnswerTexts('condition');

  const ruleLines = [
    'rule detection {',
    '  meta:',
    ...meta.map(l => `    ${l}`),
    '  events:',
    ...events.map(l => `    ${l}`),
    '  match:',
    ...match.map(l => `    ${l}`),
    '  condition:',
    ...condition.map(l => `    ${l}`),
    '}',
  ];

  const colors = { meta:'#fbbf24', events:'#00c4cc', match:'#a78bfa', condition:'#22d3a0' };
  let section = null;

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>REVISÃO</div>
        <div style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:900 }}>· {mission.title}</div>
      </div>

      <div style={{ flex:1, padding:'24px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        <div style={{ background:'#0d1117', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px', fontFamily:'monospace', fontSize:13, lineHeight:2 }}>
          {ruleLines.map((line, i) => {
            const trimmed = line.trim();
            if (['meta:', 'events:', 'match:', 'condition:'].some(s => trimmed === s))
              section = trimmed.replace(':','');
            const color = section && colors[section] ? colors[section] : C.text;
            const indent = line.match(/^(\s*)/)[1].length;
            return (
              <div key={i} style={{ color: trimmed.endsWith('{') || trimmed === '}' ? C.textDim : color, paddingLeft: indent * 4 }}>
                {trimmed}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
        <Btn3D color={C.cyan} shadow={C.btn3d_cyan} onClick={onExecute}>
          ⚡ EXECUTAR NOS LOGS
        </Btn3D>
      </div>
    </div>
  );
}

// ── Fase 6: Simulação nos logs ────────────────────────────────────────────────
function SimulatePhase({ mission, xp, onResult }) {
  const [choices, setChoices] = useState({}); // { logId: true=alerta, false=ok }

  const allAnswered = mission.logs.every(l => choices[l.id] !== undefined);

  const handleResult = () => {
    let correct = 0;
    mission.logs.forEach(l => {
      if (choices[l.id] === l.alert) correct++;
    });
    const score = Math.round((correct / mission.logs.length) * 100);
    const xpBonus = score === 100 ? Math.round(mission.xp * 0.3) : Math.round(mission.xp * 0.15);
    onResult(score, xpBonus);
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>SIMULAÇÃO · LOGS UDM</div>
        <div style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:900 }}>Testando sua regra...</div>
      </div>

      <div style={{ flex:1, padding:'16px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {mission.logs.map(log => {
          const chosen = choices[log.id];
          return (
            <div key={log.id} style={{
              background: chosen === true ? '#1a0000' : chosen === false ? '#001a0a' : C.surface,
              border:`2px solid ${chosen === true ? C.red : chosen === false ? C.green : C.border}`,
              borderRadius:14, padding:'14px 16px', marginBottom:12,
              display:'flex', alignItems:'center', gap:12,
            }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{log.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{log.desc}</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>{log.detail}</div>
                <div style={{ fontFamily:F.mono, fontSize:10, marginTop:4, color: log.alert ? C.red : C.green }}>
                  esperado: {log.alert ? 'ALERTAR' : 'ignorar'}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => setChoices(c => ({ ...c, [log.id]: true }))} style={{
                  background: chosen === true ? C.red : C.surface2,
                  border:`2px solid ${chosen === true ? C.red : C.border}`,
                  borderRadius:10, padding:'6px 14px', fontFamily:F.display, fontWeight:800, fontSize:12,
                  color: chosen === true ? '#fff' : C.textDim, cursor:'pointer',
                }}>× ALERTA</button>
                <button onClick={() => setChoices(c => ({ ...c, [log.id]: false }))} style={{
                  background: chosen === false ? C.green : C.surface2,
                  border:`2px solid ${chosen === false ? C.green : C.border}`,
                  borderRadius:10, padding:'6px 14px', fontFamily:F.display, fontWeight:800, fontSize:12,
                  color: chosen === false ? '#fff' : C.textDim, cursor:'pointer',
                }}>○ OK</button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
        <Btn3D color={allAnswered ? C.green : C.surface2} shadow={allAnswered ? C.btn3d_green : C.cardDepth}
          disabled={!allAnswered} onClick={handleResult}>
          VER RESULTADO →
        </Btn3D>
      </div>
    </div>
  );
}

// ── Fase 7: Resultado ─────────────────────────────────────────────────────────
function ResultPhase({ mission, score, xpBonus, totalXp, onComplete }) {
  const approved = score >= 75;
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>{approved ? '🎯' : '💡'}</div>
      <div style={{ fontFamily:F.display, color: approved ? C.green : C.amber, fontSize:24, fontWeight:900, marginBottom:8, textAlign:'center' }}>
        {approved ? 'REGRA APROVADA!' : 'QUASE LÁ!'}
      </div>
      <div style={{ fontFamily:F.display, color:C.amber, fontSize:20, fontWeight:900, marginBottom:16 }}>
        +{xpBonus} <span style={{ color:C.textDim, fontSize:14 }}>DX bônus</span>
      </div>
      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:8 }}>✓ POR QUE FUNCIONA</div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 20px', maxWidth:480, width:'100%', marginBottom:32 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.8 }}>{mission.explanation}</div>
      </div>
      <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => onComplete(totalXp + xpBonus)}>
        PRÓXIMA MISSÃO →
      </Btn3D>
    </div>
  );
}

// ── Orquestrador da missão ────────────────────────────────────────────────────
function MissionDetail({ mission, onComplete, onBack }) {
  const [phase,   setPhase]   = useState('steps'); // steps | review | simulate | result
  const [answers, setAnswers] = useState({});
  const [xp,      setXp]      = useState(0);
  const [score,   setScore]   = useState(0);
  const [xpBonus, setXpBonus] = useState(0);

  if (phase === 'steps') {
    return (
      <div style={{ position:'relative' }}>
        <button onClick={onBack} style={{ position:'fixed', top:14, left:16, background:'none', border:'none', color:C.textDim, fontSize:24, cursor:'pointer', zIndex:10 }}>×</button>
        <StepsPhase mission={mission} onDone={(ans, earnedXp) => {
          setAnswers(ans); setXp(earnedXp); setPhase('review');
        }} />
      </div>
    );
  }

  if (phase === 'review') {
    return <ReviewPhase mission={mission} answers={answers} xp={xp}
      onExecute={() => setPhase('simulate')} />;
  }

  if (phase === 'simulate') {
    return <SimulatePhase mission={mission} xp={xp}
      onResult={(s, bonus) => { setScore(s); setXpBonus(bonus); setPhase('result'); }} />;
  }

  return <ResultPhase mission={mission} score={score} xpBonus={xpBonus} totalXp={xp}
    onComplete={onComplete} />;
}

// ── Lista de missões ──────────────────────────────────────────────────────────
export default function M4Screen({ progress, onComplete, onBack, lang = 'pt' }) {
  const { MISSIONS } = useContent(lang);
  const done = progress?.m4 || [];
  const [missionId, setMissionId] = useState(null);

  if (missionId !== null) {
    const mission = MISSIONS[missionId];
    return (
      <MissionDetail mission={mission} onBack={() => setMissionId(null)}
        onComplete={(xp) => {
          const newDone = done.includes(missionId) ? done : [...done, missionId];
          onComplete({ m4: newDone }, xp, newDone.length >= MISSIONS.length);
          setMissionId(null);
        }} />
    );
  }

  const cats = [...new Set(MISSIONS.map(m => m.cat))];

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
        <div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>MÓDULO 4</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:900 }}>🎮 Missões de Detecção</div>
        </div>
        <div style={{ marginLeft:'auto', fontFamily:F.mono, color:C.textDim, fontSize:12 }}>
          <FaBolt size={11} color={C.amber} style={{ marginRight:4 }} />
          {done.length}/{MISSIONS.length}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {cats.map(cat => (
          <div key={cat} style={{ marginBottom:24 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:12 }}>
              {cat} · {MISSIONS.filter(m => m.cat === cat).length}
            </div>
            {MISSIONS.filter(m => m.cat === cat).map((m, i) => {
              const isDone = done.includes(MISSIONS.indexOf(m));
              return (
                <div key={m.id} onClick={() => setMissionId(MISSIONS.indexOf(m))}
                  style={{ background:C.surface, border:`1.5px solid ${isDone ? C.green+'44' : C.border}`,
                    borderBottom:`4px solid ${isDone ? C.green+'44' : C.cardDepth}`,
                    borderRadius:16, padding:'16px', marginBottom:10, cursor:'pointer',
                    display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>{m.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <div style={{ background:m.tagColor+'22', border:`1px solid ${m.tagColor}66`,
                        borderRadius:6, padding:'2px 8px', fontFamily:F.mono, color:m.tagColor, fontSize:10 }}>
                        {m.tag}
                      </div>
                      {isDone && <div style={{ fontFamily:F.mono, color:C.green, fontSize:10 }}>✓ COMPLETO</div>}
                    </div>
                    <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{m.title}</div>
                    <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>+{m.xp} DX · MITRE {m.mitre}</div>
                  </div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:18 }}>›</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
