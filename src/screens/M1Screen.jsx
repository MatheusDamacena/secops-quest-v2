// ─── MÓDULO 1 — CONCEITOS FUNDAMENTAIS ───────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D } from '../components/GameUI';
import ModuleScreen from './ModuleScreen';
import { M1_LESSONS, M1_FINAL_CHALLENGE } from '../data/content';

export default function M1Screen({ progress, onComplete, onBack }) {
  const done = progress?.m1 || [];
  const [lessonIdx, setLessonIdx] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [totalXp, setTotalXp] = useState(0);

  // Tela de seleção de lições
  if (lessonIdx === null && !showFinal) {
    const allDone = done.length >= M1_LESSONS.length;
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
          <div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>MÓDULO 1</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900 }}>🏛 Conceitos Fundamentais</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 80px', maxWidth:600, width:'100%', margin:'0 auto' }}>
          {M1_LESSONS.map((lesson, idx) => {
            const isDone = done.includes(idx);
            return (
              <div key={lesson.id} onClick={() => setLessonIdx(idx)}
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

          {/* Desafio final */}
          {allDone && (
            <div onClick={() => setShowFinal(true)}
              style={{ background:C.purple+'18', border:`2px solid ${C.purple}55`, borderBottom:`4px solid ${C.purple}`,
                borderRadius:16, padding:'14px 16px', marginTop:8, display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <div style={{ fontSize:32 }}>🏆</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:F.display, color:C.purple, fontSize:15, fontWeight:800 }}>Desafio Final</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginTop:2 }}>10 questões · desbloqueado!</div>
              </div>
              <div style={{ color:C.textDim, fontSize:20 }}>›</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Lição individual
  if (lessonIdx !== null) {
    return (
      <ModuleScreen
        lesson={M1_LESSONS[lessonIdx]}
        onBack={() => setLessonIdx(null)}
        onComplete={(xp) => {
          setTotalXp(t => t + xp);
          const newDone = done.includes(lessonIdx) ? done : [...done, lessonIdx];
          onComplete({ m1: newDone }, xp, false);
          setLessonIdx(null);
        }}
      />
    );
  }

  // Desafio final
  if (showFinal) {
    return (
      <ModuleScreen
        lesson={{ title:'Desafio Final — Módulo 1', cards:[], challenges: M1_FINAL_CHALLENGE, icon:'🏆' }}
        onBack={() => setShowFinal(false)}
        onComplete={(xp) => {
          setTotalXp(t => t + xp);
          onComplete({ m1: M1_LESSONS.map((_, i) => i) }, xp, true);
          setShowFinal(false);
        }}
      />
    );
  }
}
