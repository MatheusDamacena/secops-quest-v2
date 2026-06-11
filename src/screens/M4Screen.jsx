// ─── MÓDULO 4 — MISSÕES DE DETECÇÃO ──────────────────────────────────────────
import { useState, useEffect, useMemo } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D, ProgressHeader } from '../components/GameUI';
import NodeIcon from '../components/NodeIcon';
import { FaBolt } from 'react-icons/fa';
import { useContent } from '../hooks/useContent';

// ── Fase 1-4: Steps de seleção ────────────────────────────────────────────────
function StepsPhase({ mission, onDone, onBack }) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [selected, setSelected] = useState({});
  const [xp,       setXp]       = useState(0);

  const step        = mission.steps[stepIdx];
  const totalSteps  = mission.steps.length;

  // Embaralhar opções uma vez por step
  const shuffledOpts = useMemo(() =>
    [...step.options].sort(() => Math.random() - 0.5),
  [stepIdx]);

  const correctIds  = step.options.filter(o => o.correct).map(o => o.id);
  const selectedIds = Object.keys(selected).filter(k => selected[k]);
  const selCorrect  = selectedIds.filter(id => correctIds.includes(id));
  const selWrong    = selectedIds.filter(id => !correctIds.includes(id));
  const minRequired = step.minCorrect || correctIds.length;
  const canProceed  = selCorrect.length >= minRequired && selWrong.length === 0 && selectedIds.length > 0;
  const isLastStep  = stepIdx + 1 === totalSteps;
  const nextLabel   = isLastStep ? '▶ TESTAR REGRA' : `PRÓXIMO: ${mission.steps[stepIdx+1].label} ›`;

  const handleNext = () => {
    if (!canProceed) return;
    const xpEarned = Math.round(mission.xp / (totalSteps + 2));
    setXp(x => x + xpEarned);
    const newAnswers = { ...answers, [step.id]: selectedIds };
    setAnswers(newAnswers);
    setSelected({});
    if (isLastStep) onDone(newAnswers, xp + xpEarned);
    else setStepIdx(i => i + 1);
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <ProgressHeader current={stepIdx} total={totalSteps + 2} onBack={onBack} xpEarned={xp} />
      <div style={{ flex:1, padding:'20px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {/* Story */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 16px', marginBottom:16, fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.7 }}>
          {mission.story}
        </div>
        {/* Header da seção */}
        <div style={{ background:C.surface, border:`2px solid ${step.color}44`, borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
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
        {shuffledOpts.map(opt => {
          const isSel   = !!selected[opt.id];
          const isWrong = isSel && !opt.correct;
          return (
            <div key={opt.id}
              onClick={() => setSelected(s => step.multi ? { ...s, [opt.id]: !s[opt.id] } : { [opt.id]: true })}
              style={{ background: isWrong ? C.wrongBg : isSel ? '#2a1f00' : C.surface,
                border:`2px solid ${isWrong ? C.wrong : isSel ? C.amber : C.border}`,
                borderBottom:`4px solid ${isWrong ? '#a00' : isSel ? '#a06000' : C.cardDepth}`,
                borderRadius:14, padding:'12px 14px', marginBottom:10, cursor:'pointer',
                fontFamily:F.mono, color: isWrong ? C.wrong : isSel ? C.amber : C.text,
                fontSize:12, lineHeight:1.5, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:18, height:18, borderRadius: step.multi ? 4 : 9, flexShrink:0,
                border:`2px solid ${isWrong ? C.wrong : isSel ? C.amber : C.border}`,
                background: isSel ? (isWrong ? C.wrong : C.amber) : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
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
          color: canProceed ? '#fff' : C.textDim, cursor: canProceed ? 'pointer' : 'not-allowed', transition:'all .2s' }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

// ── Fase 5: Revisão da regra ──────────────────────────────────────────────────
function ReviewPhase({ mission, answers, xp, onExecute }) {
  const getTexts = (stepId) => {
    const step = mission.steps.find(s => s.id === stepId);
    if (!step) return [];
    return (answers[stepId] || []).map(id => step.options.find(o => o.id === id)?.text).filter(Boolean);
  };
  const sections = { meta: getTexts('meta'), events: getTexts('events'), match: getTexts('match'), condition: getTexts('condition') };
  const colors   = { meta:'#fbbf24', events:'#00c4cc', match:'#a78bfa', condition:'#22d3a0' };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>REVISÃO</div>
        <div style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:900 }}>· {mission.title}</div>
      </div>
      <div style={{ flex:1, padding:'24px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        <div style={{ background:'#0d1117', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px', fontFamily:'monospace', fontSize:13, lineHeight:2.2 }}>
          <div style={{ color:C.textDim }}>rule detection {'{'}</div>
          {Object.entries(sections).map(([key, lines]) => (
            <div key={key}>
              <div style={{ color:colors[key], paddingLeft:16 }}>{key}:</div>
              {lines.map((l, i) => <div key={i} style={{ color:colors[key], paddingLeft:32 }}>{l}</div>)}
            </div>
          ))}
          <div style={{ color:C.textDim }}>{'}'}</div>
        </div>
      </div>
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
        <div style={{ maxWidth:480, margin:'0 auto', width:'100%' }}>
          <Btn3D color={C.cyan} shadow={C.btn3d_cyan} onClick={onExecute}>⚡ EXECUTAR NOS LOGS</Btn3D>
        </div>
      </div>
    </div>
  );
}

// ── Fase 6: Simulação animada nos logs ────────────────────────────────────────
function SimulatePhase({ mission, onResult }) {
  const [visible, setVisible] = useState(0); // quantos logs apareceram
  const [done,    setDone]    = useState(false); // animação concluída

  // Animar entrada dos logs um por um — 700ms entre cada um
  useEffect(() => {
    if (visible < mission.logs.length) {
      const t = setTimeout(() => setVisible(v => v + 1), 700);
      return () => clearTimeout(t);
    } else {
      // Todos visíveis — aguardar mais 500ms e habilitar botão
      const t = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(t);
    }
  }, [visible, mission.logs.length]);

  const handleResult = () => {
    if (!done) return;
    // Calcular score baseado nas respostas corretas (alert === true/false)
    const correct = mission.logs.filter(l => l.alert !== undefined).length;
    const score   = 100; // todos os logs são mostrados automaticamente
    const xpBonus = Math.round(mission.xp * 0.3);
    onResult(score, xpBonus);
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>SIMULAÇÃO · LOGS UDM</div>
        <div style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:900 }}>Testando sua regra...</div>
      </div>
      <div style={{ flex:1, padding:'16px 16px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {mission.logs.map((log, idx) => {
          const isVisible = idx < visible;
          // Cor automática baseada em log.alert — vermelho=alerta, verde=ok
          const bgColor   = log.alert ? '#1a0000' : '#001a0a';
          const bdColor   = log.alert ? C.red     : C.green;
          const badge     = log.alert ? `× ALERTA` : `○ OK`;
          const badgeClr  = log.alert ? C.red     : C.green;

          return (
            <div key={log.id} style={{
              opacity: isVisible ? 1 : 0.12,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.45s ease, transform 0.45s ease, background 0.3s, border-color 0.3s',
              background: isVisible ? bgColor : C.surface,
              border:`2px solid ${isVisible ? bdColor : C.border}`,
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
              {/* Badge automático aparece junto com o log */}
              {isVisible && (
                <div style={{
                  background: log.alert ? C.red : C.green,
                  border:`2px solid ${log.alert ? C.red : C.green}`,
                  borderRadius:10, padding:'6px 14px', fontFamily:F.display, fontWeight:800, fontSize:12,
                  color:'#fff', whiteSpace:'nowrap', flexShrink:0,
                }}>
                  {badge}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
        <button onClick={handleResult} disabled={!done} style={{
          display:'block', margin:'0 auto', width:'100%', maxWidth:480,
          background: done ? C.green : C.surface2,
          border:'none', borderBottom:`4px solid ${done ? C.btn3d_green : C.cardDepth}`,
          borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:16,
          color: done ? '#fff' : C.textDim, cursor: done ? 'pointer' : 'not-allowed',
          transition:'all .3s' }}>
          VER RESULTADO →
        </button>
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
      <div style={{ fontFamily:F.display, color:C.amber, fontSize:20, fontWeight:900, marginBottom:4 }}>
        +{xpBonus} DX
      </div>
      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginBottom:24 }}>MITRE {mission.mitre}</div>
      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:8 }}>✓ POR QUE FUNCIONA</div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 20px', maxWidth:480, width:'100%', marginBottom:32 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.8 }}>{mission.explanation}</div>
      </div>
      <div style={{ maxWidth:480, width:'100%' }}>
        <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => onComplete(totalXp + xpBonus)}>
          PRÓXIMA MISSÃO →
        </Btn3D>
      </div>
    </div>
  );
}

// ── Orquestrador ──────────────────────────────────────────────────────────────
function MissionDetail({ mission, onComplete, onBack }) {
  const [phase,   setPhase]   = useState('steps');
  const [answers, setAnswers] = useState({});
  const [xp,      setXp]      = useState(0);
  const [score,   setScore]   = useState(0);
  const [xpBonus, setXpBonus] = useState(0);

  if (phase === 'steps') return (
    <StepsPhase mission={mission} onBack={onBack}
      onDone={(ans, earnedXp) => { setAnswers(ans); setXp(earnedXp); setPhase('review'); }} />
  );
  if (phase === 'review') return (
    <ReviewPhase mission={mission} answers={answers} xp={xp} onExecute={() => setPhase('simulate')} />
  );
  if (phase === 'simulate') return (
    <SimulatePhase mission={mission}
      onResult={(s, bonus) => { setScore(s); setXpBonus(bonus); setPhase('result'); }} />
  );
  return (
    <ResultPhase mission={mission} score={score} xpBonus={xpBonus} totalXp={xp} onComplete={onComplete} />
  );
}

const getDifficulty = (xp) => {
  if (xp <= 200) return { label:'INICIANTE',     color:'#22d3a0' };
  if (xp <= 300) return { label:'INTERMEDIÁRIO', color:'#fbbf24' };
  return             { label:'AVANÇADO',         color:'#ff4d4d' };
};

const MITRE_MAP = {
  'T1110':    { tactic:'Credential Access',   tech:'Brute Force' },
  'T1048':    { tactic:'Exfiltration',        tech:'Exfiltration Over Alternative Protocol' },
  'T1071.004':{ tactic:'C2',                 tech:'Application Layer Protocol: DNS' },
  'T1055':    { tactic:'Defense Evasion',     tech:'Process Injection' },
  'T1486':    { tactic:'Impact',              tech:'Data Encrypted for Impact' },
  'T1071':    { tactic:'C2',                 tech:'Application Layer Protocol' },
  'T1078':    { tactic:'Defense Evasion',     tech:'Valid Accounts' },
  'T1059.001':{ tactic:'Execution',           tech:'PowerShell' },
  'T1566':    { tactic:'Initial Access',      tech:'Phishing' },
  'T1562':    { tactic:'Defense Evasion',     tech:'Impair Defenses' },
  'T1098.001':{ tactic:'Persistence',         tech:'Account Manipulation: Additional Cloud Credentials' },
  'T1556':    { tactic:'Persistence',         tech:'Modify Authentication Process' },
  'T1090.003':{ tactic:'C2',                 tech:'Proxy: Multi-hop Proxy' },
  'T1555':    { tactic:'Credential Access',   tech:'Credentials from Password Stores' },
  'T1552':    { tactic:'Credential Access',   tech:'Unsecured Credentials' },
  'T1003.001':{ tactic:'Credential Access',   tech:'OS Credential Dumping: LSASS Memory' },
  'T1070.001':{ tactic:'Defense Evasion',     tech:'Indicator Removal: Clear Windows Event Logs' },
  'T1110.003':{ tactic:'Credential Access',   tech:'Password Spraying' },
  'T1102':    { tactic:'C2',                 tech:'Web Service' },
  'T1114.003':{ tactic:'Collection',         tech:'Email Forwarding Rule' },
  'T1021.001':{ tactic:'Lateral Movement',   tech:'Remote Desktop Protocol' },
  'T1485':    { tactic:'Impact',             tech:'Data Destruction' },
  'T1567':    { tactic:'Exfiltration',       tech:'Exfiltration Over Web Service' },
};

// ── Lista de missões ──────────────────────────────────────────────────────────
export default function M4Screen({ progress, onComplete, onBack, lang = 'pt' }) {
  const { MISSIONS } = useContent(lang);
  const done = progress?.m4 || [];
  const [missionId, setMissionId] = useState(null);
  const [catFilter, setCatFilter] = useState('Todas');
  const [mitreMod,  setMitreMod]  = useState(null);

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
          <FaBolt size={11} color={C.amber} style={{ marginRight:4 }} />{done.length}/{MISSIONS.length}
        </div>
      </div>
      {/* Filtro */}
      <div style={{ display:'flex', gap:6, padding:'8px 16px', background:C.surface, borderBottom:`1px solid ${C.border}`, overflowX:'auto', flexShrink:0 }}>
        {['Todas', ...cats].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            style={{ background: catFilter===c ? C.accent : C.surface2, border:`1px solid ${catFilter===c ? C.accent : C.border}`, borderRadius:20, padding:'5px 12px', fontFamily:F.mono, color: catFilter===c ? '#fff' : C.textDim, fontSize:11, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            {c}{c !== 'Todas' ? ` · ${MISSIONS.filter(m=>m.cat===c).length}` : ''}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {cats.filter(c => catFilter === 'Todas' || c === catFilter).map(cat => (
          <div key={cat} style={{ marginBottom:24 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:12 }}>
              {cat} · {MISSIONS.filter(m => m.cat === cat).length}
            </div>
            {MISSIONS.filter(m => m.cat === cat).map((m) => {
              const idx    = MISSIONS.indexOf(m);
              const isDone = done.includes(idx);
              return (
                <div key={m.id} onClick={() => setMissionId(idx)} title={isDone ? 'Clique para revisar' : 'Clique para jogar'}
                  style={{ background:C.surface,
                    border:`1.5px solid ${isDone ? C.green+'44' : C.border}`,
                    borderLeft:`4px solid ${isDone ? C.green : (m.tagColor || C.accent)}`,
                    borderBottom:`3px solid ${isDone ? C.green+'44' : C.cardDepth}`,
                    borderRadius:16, padding:'16px', marginBottom:10, cursor:'pointer',
                    transition:'transform .15s, box-shadow .15s',
                    boxShadow:`0 2px 8px rgba(0,0,0,0.2)`,
                    display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>{m.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <div style={{ background:m.tagColor+'22', border:`1px solid ${m.tagColor}66`,
                        borderRadius:6, padding:'2px 8px', fontFamily:F.mono, color:m.tagColor, fontSize:10 }}>{m.tag}</div>
                      <div style={{ background:getDifficulty(m.xp).color+'22', borderRadius:6, padding:'2px 8px', fontFamily:F.mono, color:getDifficulty(m.xp).color, fontSize:10 }}>{getDifficulty(m.xp).label}</div>
                      {isDone && <div style={{ fontFamily:F.mono, color:C.green, fontSize:10 }}>✓ COMPLETO</div>}
                    </div>
                    <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{m.title}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2, flexWrap:'wrap' }}>
                      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>+{m.xp} DX</div>
                      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, opacity:0.6 }}>
                        ~{m.xp <= 200 ? '3' : m.xp <= 300 ? '5' : '7'} min
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); const info = MITRE_MAP[m.mitre]; setMitreMod({ code:m.mitre, ...(info || { tactic:'', tech:m.mitre }) }); }}
                        style={{ fontFamily:F.mono, fontSize:10, color:'#fbbf24', background:'#fbbf2422', border:'1px solid #fbbf2444', borderRadius:6, padding:'1px 7px', cursor:'pointer' }}>
                        {m.mitre} ↗
                      </button>
                    </div>
                  </div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:18 }}>›</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Modal MITRE */}
      {mitreMod && (
        <div onClick={() => setMitreMod(null)} style={{ position:'fixed', inset:0, background:'#000b', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid #fbbf2466`, borderRadius:20, padding:24, maxWidth:380, width:'100%' }}>
            <div style={{ fontFamily:F.mono, color:'#fbbf24', fontSize:10, letterSpacing:2, marginBottom:4 }}>MITRE ATT&CK</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:24, fontWeight:900, marginBottom:8 }}>{mitreMod.code}</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.8 }}>
              <div>Tática: <span style={{color:C.text}}>{mitreMod.tactic}</span></div>
              <div>Técnica: <span style={{color:C.text}}>{mitreMod.tech}</span></div>
            </div>
            <button onClick={() => window.open(`https://attack.mitre.org/techniques/${mitreMod.code.replace('.','/')}/`, '_blank')}
              style={{ display:'block', width:'100%', textAlign:'center', background:'#fbbf24', color:'#0a0b0c', border:'none', borderRadius:12, padding:'12px', fontFamily:F.display, fontWeight:800, fontSize:14, cursor:'pointer', marginTop:20 }}>
              Ver no MITRE ATT&CK ↗
            </button>
            <button onClick={() => setMitreMod(null)}
              style={{ marginTop:8, width:'100%', background:'transparent', color:C.textDim, border:`1px solid ${C.border}`, borderRadius:12, padding:'10px', fontFamily:F.mono, fontSize:12, cursor:'pointer' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
