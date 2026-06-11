// ─── MÓDULO 5 — YARA-L AVANÇADO ──────────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import ModuleScreen from './ModuleScreen';
import NodeIcon from '../components/NodeIcon';
import { FaTrophy } from 'react-icons/fa';
import { useContent } from '../hooks/useContent';

export default function M5Screen({ progress, onComplete, onBack, lang = 'pt', t = k => k }) {
  const { M5_LESSONS, M5_FINAL_CHALLENGE } = useContent(lang);
  const done = progress?.m5 || [];
  const [lessonIdx, setLessonIdx] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  if (lessonIdx === null && !showFinal) {
    const allDone = done.length >= M5_LESSONS.length;
    return (
      <div className='sq-module-root' style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column' }}>
        <div className="sq-mobile-only" style={{ background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:'clamp(24px, 5vw, 30px)', cursor:'pointer' }}>‹</button>
          <div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', letterSpacing:2 }}>MÓDULO 5</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:'clamp(18px, 4vw, 22px)', fontWeight:900, display:'flex', alignItems:'center', gap:8 }}><FaTrophy size={18} color={C.yellow} /> YARA-L Avançado</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
          {M5_LESSONS.map((lesson, idx) => {
            const isDone = done.includes(idx);
            return (
              <div key={idx} onClick={() => setLessonIdx(idx)}
                style={{ background:'#1c2b32', border:`2px solid ${isDone ? C.purple+'55' : C.border}`,
                  borderBottom:`4px solid ${isDone ? C.purple : C.cardDepth}`,
                  borderRadius:16, padding:'14px 16px', marginBottom:12,
                  display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
                <div style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>{isDone ? <NodeIcon icon='✅' size={24} /> : <NodeIcon icon={lesson.icon} size={24} />}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:F.display, color:C.text, fontSize:'clamp(15px, 2.8vw, 17px)', fontWeight:800 }}>{lesson.title}</div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', marginTop:2 }}>
                    {lesson.cards.length} flashcards · {lesson.challenges.length} exercícios
                  </div>
                </div>
                <div style={{ color:C.textDim, fontSize:'clamp(18px, 4vw, 22px)' }}>›</div>
              </div>
            );
          })}

          {allDone && (
            <div onClick={() => setShowFinal(true)}
              style={{ background:C.purple+'18', border:`2px solid ${C.purple}55`, borderBottom:`4px solid ${C.purple}`,
                borderRadius:16, padding:'14px 16px', marginTop:8, display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <FaTrophy size={32} color={C.yellow} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:C.purple, fontSize:'clamp(15px, 2.8vw, 17px)', fontWeight:800 }}>Desafio Final</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(15px, 2.8vw, 17px)', marginTop:2 }}>YARA-L Avançado · desbloqueado!</div>
              </div>
              <div style={{ color:C.textDim, fontSize:'clamp(18px, 4vw, 22px)' }}>›</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showFinal) {
    return (
      <ModuleScreen
        lesson={{ title:'Desafio Final — YARA-L Avançado', cards:[], challenges: M5_FINAL_CHALLENGE, icon:'🏆' }}
        onBack={() => setShowFinal(false)}
        onComplete={(xp) => {
          onComplete({ m5: M5_LESSONS.map((_, i) => i) }, xp, true);
          setShowFinal(false);
        }}
        t={t}
      />
    );
  }

  return (
    <ModuleScreen
      lesson={M5_LESSONS[lessonIdx]}
      onBack={() => setLessonIdx(null)}
      onComplete={(xp) => {
        const newDone = done.includes(lessonIdx) ? done : [...done, lessonIdx];
        onComplete({ m5: newDone }, xp, false);
        setLessonIdx(null);
      }}
        t={t}
    />
  );
}
