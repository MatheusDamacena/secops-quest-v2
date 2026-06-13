// ─── MÓDULO 8 — GOOGLE THREAT INTELLIGENCE ────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import ModuleScreen from './ModuleScreen';
import NodeIcon from '../components/NodeIcon';
import { FaTrophy } from 'react-icons/fa';
import { useContent } from '../hooks/useContent';

export default function M8Screen({ progress, onComplete, onBack, lang = 'pt', t = k => k }) {
  const { M8_LESSONS, M8_FINAL_CHALLENGE } = useContent(lang);
  const done = progress?.m8 || [];
  const [lessonIdx, setLessonIdx] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  if (lessonIdx === null && !showFinal) {
    const allDone = done.length >= M8_LESSONS.length;
    return (
      <div className='sq-module-root' style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column' }}>
        <div className="sq-mobile-only" style={{ background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:22, cursor:'pointer' }}>‹</button>
          <div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, letterSpacing:2 }}>MÓDULO 8</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}>SOAR & Automação</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>

          {/* Header desktop */}
          <div style={{ padding:'16px 0 20px', borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, letterSpacing:3, marginBottom:4 }}>MÓDULO 8</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900, letterSpacing:-0.3 }}>SOAR & Automação</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, marginTop:6 }}>
              Playbooks · Integrações · Automação · Cases
            </div>
          </div>

          {M8_LESSONS.map((lesson, idx) => {
            const isDone = done.includes(idx);
            return (
              <div key={idx} onClick={() => setLessonIdx(idx)}
                style={{ background:'#1c2b32', border:`2px solid ${isDone ? '#00c4cc55' : C.border}`,
                  borderBottom:`4px solid ${isDone ? '#ff4b7a' : C.cardDepth}`,
                  borderRadius:16, padding:'14px 16px', marginBottom:12,
                  display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
                <div style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {isDone ? <NodeIcon icon='✅' size={24} /> : <NodeIcon icon={lesson.icon} size={24} />}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:800 }}>{lesson.title}</div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, marginTop:2 }}>
                    {lesson.cards.length} flashcards · {lesson.challenges.length} exercícios
                  </div>
                </div>
                <div style={{ color:C.textDim, fontSize:16 }}>›</div>
              </div>
            );
          })}

          {allDone && (
            <div onClick={() => setShowFinal(true)}
              style={{ background:'#00c4cc18', border:`2px solid #00c4cc55`, borderBottom:`4px solid #00c4cc`,
                borderRadius:16, padding:'14px 16px', marginTop:8, display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <FaTrophy size={32} color={C.yellow} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:'#ff4b7a', fontSize:13, fontWeight:800 }}>Desafio Final</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, marginTop:2 }}>GTI Master · desbloqueado!</div>
              </div>
              <div style={{ color:C.textDim, fontSize:16 }}>›</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleLessonComplete = (xpEarned) => {
    const newDone = done.includes(lessonIdx) ? done : [...done, lessonIdx];
    onComplete({ m8: newDone }, xpEarned, newDone.length >= M8_LESSONS.length);
    setLessonIdx(null);
  };

  const handleFinalComplete = (xpEarned) => {
    onComplete({ m8: done }, xpEarned, true);
    setShowFinal(false);
  };

  return (
    <ModuleScreen
      lesson={showFinal ? M8_FINAL_CHALLENGE : M8_LESSONS[lessonIdx]}
      isFinal={showFinal}
      onBack={() => showFinal ? setShowFinal(false) : setLessonIdx(null)}
      onComplete={showFinal ? handleFinalComplete : handleLessonComplete}
      t={t}
    />
  );
}
