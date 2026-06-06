// ─── MÓDULO 3 — YARA-L BÁSICO ─────────────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D, ProgressHeader, FeedbackPanel, Lives } from '../components/GameUI';
import NodeIcon from '../components/NodeIcon';
import { FaSkull, FaSyncAlt, FaBolt } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { M3_LESSONS, M3_SKIP_CHALLENGE } from '../data/content';
import ModuleScreen from './ModuleScreen';

// Sub-tela para lição com content + quiz
function M3LessonScreen({ lesson, onComplete, onBack }) {
  const [phase,    setPhase]    = useState('content'); // content | quiz | done
  const [quizIdx,  setQuizIdx]  = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked,  setChecked]  = useState(false);
  const [xp,       setXp]       = useState(0);
  const [lives,    setLives]    = useState(3);
  const [failed,   setFailed]   = useState(false);

  const quiz = lesson.quiz || [];
  const q    = quiz[quizIdx];
  const totalSteps = 1 + quiz.length; // 1 tela de conteúdo + questões

  // Tela de conteúdo
  if (phase === 'content') {
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <ProgressHeader current={0} total={totalSteps} onBack={onBack} xpEarned={xp} />
        <div style={{ flex:1, padding:'20px 20px 40px', maxWidth:660, width:'100%', margin:'0 auto', overflowY:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ fontSize:36 }}>{lesson.icon}</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900 }}>{lesson.title}</div>
          </div>
          <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`4px solid ${C.cardDepth}`,
            borderRadius:16, padding:'20px', marginBottom:24 }}>
            <pre style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.8, whiteSpace:'pre-wrap', margin:0 }}>
              {lesson.content}
            </pre>
          </div>
          <Btn3D color={C.accent} shadow="#008a91" onClick={() => setPhase('quiz')}>
            {quiz.length > 0 ? 'INICIAR QUIZ →' : 'CONCLUÍDO →'}
          </Btn3D>
        </div>
      </div>
    );
  }

  // Quiz
  if (phase === 'quiz' && q) {
    const isCorrect = selected === q.correct;

    const handleVerify = () => {
      if (!checked) {
        setChecked(true);
        if (isCorrect) {
          setXp(x => x + 10);
        } else {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) { setFailed(true); return; }
        }
      } else {
        setChecked(false);
        setSelected(null);
        if (quizIdx + 1 < quiz.length) setQuizIdx(quizIdx + 1);
        else setPhase('done');
      }
    };

    if (failed) return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
        <FaSkull size={64} color='#ff4d4d' style={{ marginBottom:16 }} />
        <div style={{ fontFamily:F.display, color:C.red, fontSize:22, fontWeight:900, marginBottom:8, textAlign:'center' }}>Sem vidas!</div>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:14, marginBottom:32, textAlign:'center' }}>Você perdeu todas as tentativas.<br/>Tente o quiz novamente.</div>
        <button onClick={() => { setFailed(false); setQuizIdx(0); setChecked(false); setSelected(null); setLives(3); }}
          style={{ background:C.accent, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:'14px 32px', fontFamily:F.display, fontWeight:900, fontSize:16, color:'#fff', cursor:'pointer' }}>
          <><FaSyncAlt size={14} style={{marginRight:6}} /> TENTAR NOVAMENTE</>
        </button>
      </div>
    );

    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <ProgressHeader current={1 + quizIdx} total={totalSteps} onBack={() => { setPhase('content'); setQuizIdx(0); setSelected(null); setChecked(false); }} xpEarned={xp} />
        <div style={{ flex:1, padding:'20px 16px 120px', maxWidth:660, width:'100%', margin:'0 auto' }}>
          <div style={{ display:'flex', gap:6, marginBottom:12 }}>
            <Lives count={lives} />
          </div>
          <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderRadius:14, padding:'18px 16px', marginBottom:24 }}>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:800, lineHeight:1.5 }}>{q.q}</div>
          </div>
          {q.opts.map((opt, i) => {
            const isSel   = selected === i;
            const isCorr  = checked && i === q.correct;
            const isWrong = checked && isSel && i !== q.correct;
            return (
              <div key={i} onClick={() => !checked && setSelected(i)}
                style={{ background: isCorr ? C.correctBg : isWrong ? C.wrongBg : isSel ? C.cyanDim : C.surface,
                  border:`2px solid ${isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.accent : C.border}`,
                  borderBottom:`4px solid ${isCorr ? C.btn3d_green : isWrong ? C.btn3d_red : isSel ? C.accent : C.cardDepth}`,
                  borderRadius:14, padding:'14px 16px', marginBottom:10, cursor: checked ? 'default' : 'pointer',
                  fontFamily:F.display, color: isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.accent : C.text,
                  fontSize:15, fontWeight:700 }}>
                {opt}
              </div>
            );
          })}
        </div>

        {!checked ? (
          <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
            <Btn3D color={C.cyan} shadow={C.btn3d_cyan} disabled={selected === null} onClick={handleVerify}>VERIFICAR</Btn3D>
          </div>
        ) : (
          <FeedbackPanel correct={isCorrect} onNext={handleVerify}
            nextLabel={quizIdx + 1 < quiz.length ? 'CONTINUAR' : 'FINALIZAR'} />
        )}
      </div>
    );
  }

  // Concluído
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
      <GiPartyPopper size={64} color='#22d3a0' style={{ marginBottom:16 }} />
      <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900, marginBottom:8, textAlign:'center' }}>{lesson.title} concluída!</div>
      <div style={{ fontFamily:F.mono, color:C.accent, fontSize:16, fontWeight:700, marginBottom:32 }}>+{xp} DX conquistados</div>
      <Btn3D color={C.cyan} shadow={C.btn3d_cyan} onClick={() => onComplete(xp)}>CONTINUAR →</Btn3D>
    </div>
  );
}

export default function M3Screen({ progress, onComplete, onBack }) {
  const done = progress?.m3 || [];
  const [lessonIdx, setLessonIdx] = useState(null);
  const [showSkip,  setShowSkip]  = useState(false);

  if (showSkip) {
    return (
      <ModuleScreen
        lesson={{ title:'Nivelamento YARA-L', cards:[], challenges: M3_SKIP_CHALLENGE, icon:'⚡' }}
        onBack={() => setShowSkip(false)}
        onComplete={(xp) => { onComplete({ m3: M3_LESSONS.map((_, i) => i) }, xp, true); setShowSkip(false); }}
      />
    );
  }

  if (lessonIdx !== null) {
    return (
      <M3LessonScreen
        lesson={M3_LESSONS[lessonIdx]}
        onBack={() => setLessonIdx(null)}
        onComplete={(xp) => {
          const newDone = done.includes(lessonIdx) ? done : [...done, lessonIdx];
          onComplete({ m3: newDone }, xp, newDone.length >= M3_LESSONS.length);
          setLessonIdx(null);
        }}
      />
    );
  }

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
        <div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>MÓDULO 3</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900 }}>📐 YARA-L Básico</div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
        {/* Opção skip */}
        <div onClick={() => setShowSkip(true)}
          style={{ background:C.amber+'18', border:`2px solid ${C.amber}55`, borderBottom:`4px solid ${C.amber}88`,
            borderRadius:16, padding:'14px 16px', marginBottom:16, cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
          <FaBolt size={28} color={C.amber} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:F.display, color:C.amber, fontSize:14, fontWeight:800 }}>Já conheço YARA-L?</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>Faça o teste de nivelamento e pule as lições</div>
          </div>
          <div style={{ color:C.textDim, fontSize:20 }}>›</div>
        </div>

        {M3_LESSONS.map((lesson, idx) => {
          const isDone = done.includes(idx);
          return (
            <div key={idx} onClick={() => setLessonIdx(idx)}
              style={{ background:C.surface, border:`2px solid ${isDone ? C.green+'55' : C.border}`,
                borderBottom:`4px solid ${isDone ? C.btn3d_green : C.cardDepth}`,
                borderRadius:16, padding:'14px 16px', marginBottom:12,
                display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <div style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>{isDone ? <NodeIcon icon='✅' size={24} /> : <NodeIcon icon={lesson.icon} size={24} />}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{lesson.title}</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>
                  Conteúdo + {lesson.quiz?.length || 0} questões
                </div>
              </div>
              <div style={{ color:C.textDim, fontSize:20 }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
