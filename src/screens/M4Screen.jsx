// ─── MÓDULO 4 — MISSÕES DE DETECÇÃO ──────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D, ProgressHeader, FeedbackPanel } from '../components/GameUI';
import NodeIcon from '../components/NodeIcon';
import { FaGamepad } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { useContent } from '../hooks/useContent';

function MissionDetail({ mission, onComplete, onBack }) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [selected, setSelected] = useState({});
  const [xp,       setXp]       = useState(0);
  const [done,     setDone]     = useState(false);

  const step = mission.steps[stepIdx];
  const totalSteps = mission.steps.length;

  // Lógica igual ao v1: só avança se corretos corretos E nenhum errado
  const correctIds = step.options.filter(o => o.correct).map(o => o.id);
  const selectedIds = Object.keys(selected).filter(k => selected[k]);
  const selectedCorrect = selectedIds.filter(id => correctIds.includes(id));
  const selectedWrong   = selectedIds.filter(id => !correctIds.includes(id));
  const minRequired     = step.minCorrect || correctIds.length;
  const canProceed      = selectedCorrect.length >= minRequired && selectedWrong.length === 0;

  const handleNext = () => {
    if (!canProceed) return;
    setXp(x => x + Math.round(mission.xp / totalSteps));
    setSelected({});
    if (stepIdx + 1 < totalSteps) setStepIdx(stepIdx + 1);
    else setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
        <GiPartyPopper size={64} color='#22d3a0' style={{ marginBottom:16 }} />
        <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900, marginBottom:8, textAlign:'center' }}>{mission.title}</div>
        <div style={{ fontFamily:F.mono, color:C.accent, fontSize:16, fontWeight:700, marginBottom:8 }}>+{xp} DX</div>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginBottom:32 }}>MITRE {mission.mitre}</div>
        <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => onComplete(xp)}>PRÓXIMA MISSÃO →</Btn3D>
      </div>
    );
  }

  const nextLabel = stepIdx + 1 < totalSteps
    ? `PRÓXIMO: ${mission.steps[stepIdx + 1].label} ›`
    : 'FINALIZAR ›';

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <ProgressHeader current={stepIdx} total={totalSteps} onBack={onBack} xpEarned={xp} />
      <div style={{ flex:1, padding:'20px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>

        {/* Descrição da missão */}
        <div style={{ background:C.surface, border:`2px solid ${step.color}44`, borderRadius:14, padding:'16px', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <NodeIcon icon={step.icon} color={step.color} size={22} />
            <div style={{ fontFamily:F.display, color:step.color, fontSize:15, fontWeight:800 }}>{step.label}</div>
          </div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.7 }}>{step.instruction}</div>
        </div>

        {/* Dica de quantidade — igual ao v1 */}
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
          <span>Mínimo {minRequired} correto(s) · sem erros</span>
          {selectedWrong.length > 0 && (
            <span style={{ color:C.red }}>✗ {selectedWrong.length} errado(s)</span>
          )}
        </div>

        {/* Opções */}
        {step.options.map(opt => {
          const isSel  = selected[opt.id];
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
                fontFamily:F.mono,
                color: isWrong ? C.wrong : isSel ? C.amber : C.text,
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

        {/* Contador de certos — aparece quando tem seleção correta */}
        {selectedCorrect.length > 0 && selectedWrong.length === 0 && (
          <div style={{ fontFamily:F.mono, color:C.green, fontSize:12, textAlign:'center', marginTop:8 }}>
            ✓ {selectedCorrect.length} certo{selectedCorrect.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Botão PRÓXIMO — igual ao v1: só habilita quando canProceed */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
        <button onClick={handleNext}
          disabled={!canProceed}
          style={{
            display:'block', margin:'0 auto', width:'100%', maxWidth:480,
            background: canProceed ? C.amber : C.surface2,
            border:'none', borderBottom:`4px solid ${canProceed ? '#a06000' : C.cardDepth}`,
            borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:16,
            color: canProceed ? '#fff' : C.textDim,
            cursor: canProceed ? 'pointer' : 'not-allowed',
            transition:'all .2s',
          }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

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
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}><FaGamepad size={18} color={C.accent} /> Missões de Detecção</div>
        </div>
        <div style={{ marginLeft:'auto', fontFamily:F.mono, color:C.accent, fontSize:12 }}>{done.length}/{MISSIONS.length}</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {cats.map(cat => (
          <div key={cat}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, padding:'12px 0 8px' }}>{cat}</div>
            {MISSIONS.filter(m => m.cat === cat).map((mission, idx) => {
              const globalIdx = MISSIONS.indexOf(mission);
              const isDone = done.includes(globalIdx);
              return (
                <div key={mission.id} onClick={() => setMissionId(globalIdx)}
                  style={{ background:C.surface, border:`2px solid ${isDone ? C.green+'55' : C.border}`,
                    borderBottom:`4px solid ${isDone ? C.btn3d_green : C.cardDepth}`,
                    borderRadius:16, padding:'14px 16px', marginBottom:10,
                    display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                  <div style={{ width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center' }}><NodeIcon icon={isDone ? '✅' : mission.emoji} size={22} /></div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:F.display, color:C.text, fontSize:14, fontWeight:800 }}>{mission.title}</div>
                    <div style={{ display:'flex', gap:8, marginTop:4 }}>
                      <span style={{ fontFamily:F.mono, color:C.accent, fontSize:10, background:C.cyanDim, borderRadius:6, padding:'2px 7px' }}>{mission.tag}</span>
                      <span style={{ fontFamily:F.mono, color:C.textDim, fontSize:10 }}>MITRE {mission.mitre} · +{mission.xp} DX</span>
                    </div>
                  </div>
                  <div style={{ color:C.textDim, fontSize:20 }}>›</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
