// ─── MODULE SCREEN ─────────────────────────────────────────────────────────────
// Tela genérica de módulo: flashcards + challenges
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { Btn3D, OptionCard, ProgressHeader, FeedbackPanel } from '../components/GameUI';

export default function ModuleScreen({ lesson, onComplete, onBack, xpPerChallenge = 10 }) {
  const [phase,    setPhase]    = useState((lesson.cards||[]).length > 0 ? 'cards' : 'challenges');   // cards | challenges | done
  const [cardIdx,  setCardIdx]  = useState(0);
  const [chalIdx,  setChalIdx]  = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xp,       setXp]       = useState(0);
  const [tfAnswer, setTfAnswer] = useState(null);

  const cards      = lesson.cards      || [];
  const challenges = lesson.challenges || [];
  const totalSteps = cards.length + challenges.length;
  const currentStep = phase === 'cards' ? cardIdx : cards.length + chalIdx;

  const chal = challenges[chalIdx];

  // ── FLASHCARDS ──
  if (phase === 'cards') {
    const card = cards[cardIdx];
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <ProgressHeader current={currentStep} total={totalSteps} onBack={onBack} xpEarned={xp} />
        <div style={{ flex:1, padding:'24px 20px', maxWidth:600, width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontFamily:F.mono, color:C.accent, fontSize:12, letterSpacing:2, marginBottom:16 }}>
            {cardIdx + 1} / {cards.length}
          </div>
          <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`4px solid ${C.cardDepth}`, borderRadius:18, padding:'24px 20px', marginBottom:24 }}>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:800, marginBottom:16, lineHeight:1.4 }}>
              {card.q}
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.7, whiteSpace:'pre-line' }}>
              {card.a}
            </div>
          </div>
          <Btn3D color={C.accent} shadow="#008a91" onClick={() => {
            if (cardIdx + 1 < cards.length) setCardIdx(cardIdx + 1);
            else { setPhase('challenges'); }
          }}>
            {cardIdx + 1 < cards.length ? 'PRÓXIMO →' : 'INICIAR EXERCÍCIOS →'}
          </Btn3D>
        </div>
      </div>
    );
  }

  // ── DESAFIOS ──
  if (phase === 'challenges' && chal) {
    const isCorrect = () => {
      if (chal.type === 'truefalse') return tfAnswer === chal.answer;
      return selected === chal.blank;
    };

    const handleAnswer = () => {
      if (!answered) {
        setAnswered(true);
        if (isCorrect()) setXp(x => x + xpPerChallenge);
      } else {
        // Próximo
        setAnswered(false);
        setSelected(null);
        setTfAnswer(null);
        if (chalIdx + 1 < challenges.length) setChalIdx(chalIdx + 1);
        else setPhase('done');
      }
    };

    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <ProgressHeader current={currentStep} total={totalSteps} onBack={onBack} xpEarned={xp} />
        <div style={{ flex:1, padding:'24px 20px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>

          {/* Complete */}
          {chal.type === 'complete' && (
            <>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:16 }}>COMPLETE A FRASE</div>
              <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderRadius:14, padding:'18px 16px', marginBottom:24 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:700, lineHeight:1.6 }}>
                  {chal.sentence.replace(chal.blank, '').split('____').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span style={{ background: answered ? (isCorrect() ? C.correctBg : C.wrongBg) : C.cyanDim,
                          border:`2px solid ${answered ? (isCorrect() ? C.correct : C.wrong) : C.accent}`,
                          borderRadius:8, padding:'2px 10px', color: answered ? (isCorrect() ? C.correct : C.wrong) : C.accent,
                          fontWeight:900 }}>
                          {selected || '______'}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:80 }}>
                {chal.options.map(opt => (
                  <OptionCard key={opt} text={opt}
                    selected={!answered && selected === opt}
                    correct={answered && opt === chal.blank}
                    wrong={answered && selected === opt && opt !== chal.blank}
                    disabled={answered}
                    onClick={() => !answered && setSelected(opt)} />
                ))}
              </div>
            </>
          )}

          {/* True/False */}
          {chal.type === 'truefalse' && (
            <>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:16 }}>VERDADEIRO OU FALSO?</div>
              <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderRadius:14, padding:'20px 16px', marginBottom:24 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:700, lineHeight:1.5 }}>
                  {chal.statement}
                </div>
              </div>
              <div style={{ display:'flex', gap:12, marginBottom:80 }}>
                {[true, false].map(val => (
                  <button key={String(val)}
                    onClick={() => !answered && setTfAnswer(val)}
                    style={{ flex:1, padding:'16px', borderRadius:14, fontSize:28,
                      background: !answered && tfAnswer === val ? C.cyanDim :
                        answered && val === chal.answer ? C.correctBg :
                        answered && tfAnswer === val && val !== chal.answer ? C.wrongBg : C.surface,
                      border: `2px solid ${!answered && tfAnswer === val ? C.accent :
                        answered && val === chal.answer ? C.correct :
                        answered && tfAnswer === val ? C.wrong : C.border}`,
                      borderBottom: `4px solid ${!answered && tfAnswer === val ? C.accent :
                        answered && val === chal.answer ? C.btn3d_green :
                        answered && tfAnswer === val ? C.btn3d_red : C.cardDepth}`,
                      cursor: answered ? 'default' : 'pointer' }}>
                    {val ? '✅ Verdadeiro' : '❌ Falso'}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Botão responder */}
          {!answered && (
            <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:C.bg }}>
              <Btn3D disabled={selected === null && tfAnswer === null} onClick={handleAnswer}>
                VERIFICAR
              </Btn3D>
            </div>
          )}

          {/* Feedback */}
          {answered && (
            <FeedbackPanel
              correct={isCorrect()}
              explanation={chal.hint || null}
              onNext={handleAnswer}
              nextLabel={chalIdx + 1 < challenges.length ? 'CONTINUAR' : 'FINALIZAR'}
            />
          )}
        </div>
      </div>
    );
  }

  // ── CONCLUSÃO ──
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <div style={{ fontFamily:F.display, color:C.text, fontSize:24, fontWeight:900, marginBottom:8, textAlign:'center' }}>
        {lesson.title} concluída!
      </div>
      <div style={{ fontFamily:F.mono, color:C.accent, fontSize:18, fontWeight:700, marginBottom:32 }}>
        +{xp} DX conquistados
      </div>
      <Btn3D color={C.green} shadow={C.btn3d_green} onClick={() => onComplete(xp)}>
        CONTINUAR →
      </Btn3D>
    </div>
  );
}
