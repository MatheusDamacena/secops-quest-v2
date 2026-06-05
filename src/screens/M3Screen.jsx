// ─── MÓDULO 3 — YARA-L BÁSICO ─────────────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import ModuleScreen from './ModuleScreen';
import { Btn3D } from '../components/GameUI';
import { M3_LESSONS, M3_SKIP_CHALLENGE } from '../data/content';

export default function M3Screen({ progress, onComplete, onBack }) {
  const done = progress?.m3 || [];
  const [lessonIdx, setLessonIdx] = useState(null);
  const [showSkip,  setShowSkip]  = useState(false);

  if (lessonIdx === null && !showSkip) {
    const allDone = done.length >= M3_LESSONS.length;
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
          {/* Opção de skip */}
          <div onClick={() => setShowSkip(true)}
            style={{ background:C.amber+'18', border:`2px solid ${C.amber}55`, borderBottom:`4px solid ${C.amber}88`, borderRadius:16, padding:'14px 16px', marginBottom:16, cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:28 }}>⚡</div>
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
                <div style={{ fontSize:32 }}>{isDone ? '✅' : lesson.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{lesson.title}</div>
                  <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>
                    {lesson.cards.length} flashcards · {lesson.challenges.length} exercícios
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

  if (showSkip) {
    return (
      <ModuleScreen
        lesson={{ title:'Nivelamento YARA-L', cards:[], challenges: M3_SKIP_CHALLENGE, icon:'⚡' }}
        onBack={() => setShowSkip(false)}
        onComplete={(xp) => {
          onComplete({ m3: M3_LESSONS.map((_, i) => i) }, xp, true);
          setShowSkip(false);
        }}
      />
    );
  }

  return (
    <ModuleScreen
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
