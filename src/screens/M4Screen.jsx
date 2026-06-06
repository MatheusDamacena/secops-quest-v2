// ─── MÓDULO 4 — MISSÕES DE DETECÇÃO ──────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D, ProgressHeader, FeedbackPanel } from '../components/GameUI';
import NodeIcon from '../components/NodeIcon';
import { FaGamepad } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { MISSIONS } from '../data/content';

function MissionDetail({ mission, onComplete, onBack }) {
  const [stepIdx,   setStepIdx]   = useState(0);
  const [selected,  setSelected]  = useState({});
  const [checked,   setChecked]   = useState(false);
  const [xp,        setXp]        = useState(0);
  const [done,      setDone]      = useState(false);

  const step = mission.steps[stepIdx];
  const totalSteps = mission.steps.length;

  const checkStep = () => {
    let correct = true;
    if (step.multi) {
      const correctIds = step.options.filter(o => o.correct).map(o => o.id);
      const selectedIds = Object.keys(selected).filter(k => selected[k]);
      correct = correctIds.every(id => selectedIds.includes(id)) &&
                selectedIds.every(id => correctIds.includes(id));
    } else {
      correct = selected[step.options.find(o => o.correct)?.id];
    }
    if (correct) setXp(x => x + Math.round(mission.xp / totalSteps));
    setChecked(correct ? 'correct' : 'wrong');
  };

  const nextStep = () => {
    setChecked(false);
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

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <ProgressHeader current={stepIdx} total={totalSteps} onBack={onBack} xpEarned={xp} />
      <div style={{ flex:1, padding:'20px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:8 }}>
          SEÇÃO: {step.label}
        </div>
        <div style={{ background:C.surface, border:`2px solid ${step.color}44`, borderRadius:14, padding:'16px', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <NodeIcon icon={step.icon} color={step.color} size={22} />
            <div style={{ fontFamily:F.display, color:step.color, fontSize:15, fontWeight:800 }}>{step.label}</div>
            {step.multi && <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, background:C.surface2, borderRadius:6, padding:'2px 8px' }}>múltipla escolha</div>}
          </div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12 }}>{step.instruction}</div>
        </div>

        {step.options.map(opt => {
          const isSel = selected[opt.id];
          const isCorr = checked && opt.correct;
          const isWrong = checked && isSel && !opt.correct;
          return (
            <div key={opt.id} onClick={() => !checked && setSelected(s =>
              step.multi ? { ...s, [opt.id]: !s[opt.id] } : { [opt.id]: true }
            )}
              style={{ background: isCorr ? C.correctBg : isWrong ? C.wrongBg : isSel ? C.cyanDim : C.surface,
                border:`2px solid ${isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.accent : C.border}`,
                borderBottom:`4px solid ${isCorr ? C.btn3d_green : isWrong ? C.btn3d_red : isSel ? C.accent : C.cardDepth}`,
                borderRadius:14, padding:'12px 14px', marginBottom:10, cursor: checked ? 'default' : 'pointer',
                fontFamily:F.mono, color: isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.accent : C.text,
                fontSize:12, lineHeight:1.5 }}>
              {opt.text}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
          <button onClick={checkStep}
            disabled={Object.keys(selected).filter(k => selected[k]).length === 0}
            style={{ display:'block', margin:'0 auto', width:'100%', maxWidth:480,
              background: Object.keys(selected).filter(k=>selected[k]).length > 0 ? C.cyan : C.surface2,
              border:'none', borderBottom:`4px solid ${Object.keys(selected).filter(k=>selected[k]).length > 0 ? '#008a91' : C.cardDepth}`,
              borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:16,
              color: Object.keys(selected).filter(k=>selected[k]).length > 0 ? '#fff' : C.textDim,
              cursor: Object.keys(selected).filter(k=>selected[k]).length > 0 ? 'pointer' : 'not-allowed' }}>
            VERIFICAR
          </button>
        </div>
      ) : (
        <FeedbackPanel correct={checked === 'correct'} onNext={nextStep}
          nextLabel={stepIdx + 1 < totalSteps ? 'CONTINUAR' : 'FINALIZAR'} />
      )}
    </div>
  );
}

export default function M4Screen({ progress, onComplete, onBack }) {
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
