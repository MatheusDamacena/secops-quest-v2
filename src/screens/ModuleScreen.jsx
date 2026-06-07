// ─── MODULE SCREEN ─────────────────────────────────────────────────────────────
// Flashcards com flip + challenges com verificação
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { ProgressHeader, FeedbackPanel, Lives } from '../components/GameUI';
import { FaSkull, FaSyncAlt, FaHandPointer } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';

export default function ModuleScreen({ lesson, onComplete, onBack, xpPerChallenge = 10, t = k => k }) {
  const cards      = lesson.cards      || [];
  const challenges = lesson.challenges || [];
  const totalSteps = cards.length + challenges.length;

  const [phase,    setPhase]    = useState(cards.length > 0 ? 'cards' : 'challenges');
  const [cardIdx,  setCardIdx]  = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [chalIdx,  setChalIdx]  = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [tfAnswer, setTfAnswer] = useState(null);
  const [xp,       setXp]       = useState(0);
  const [lives,    setLives]    = useState(3);
  const [failed,   setFailed]   = useState(false);

  const chal   = challenges[chalIdx];
  const card   = cards[cardIdx];
  const isLast = cardIdx === cards.length - 1;

  // ── FLASHCARDS ──
  if (phase === 'cards') {
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <ProgressHeader current={cardIdx} total={totalSteps} onBack={onBack} xpEarned={xp} />

        {/* Conteúdo centralizado */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', gap:20 }}>

          {/* Label da lição */}
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:3, textAlign:'center' }}>
            {lesson.title?.toUpperCase()}
          </div>

          {/* Card clicável */}
          <div onClick={() => setFlipped(f => !f)}
            style={{ background: flipped ? C.surface2 : C.surface,
              border:`2px solid ${flipped ? C.cyan+'66' : C.border}`,
              borderRadius:20, padding:'28px 24px', width:'100%', maxWidth:440, minHeight:200,
              display:'flex', flexDirection:'column', justifyContent:'center',
              cursor:'pointer', transition:'all .3s' }}>
            <div style={{ fontFamily:F.mono, color: flipped ? C.cyan : C.textDim, fontSize:9, letterSpacing:3, marginBottom:12 }}>
              {flipped ? t('card_answer') : <><FaHandPointer size={13} style={{marginRight:6}} /> {t('card_tap')}</>}
            </div>
            <div style={{ fontFamily:F.mono, color: flipped ? C.text : C.textMid, fontSize:14, lineHeight:1.9, whiteSpace:'pre-wrap' }}>
              {flipped ? card.a : card.q}
            </div>
          </div>

          {/* Dots de navegação */}
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            {cards.map((_, i) => (
              <div key={i} style={{ width: i === cardIdx ? 20 : 8, height:8, borderRadius:4,
                background: i < cardIdx ? C.green : i === cardIdx ? C.cyan : C.border,
                transition:'all .3s', cursor:'pointer' }}
                onClick={() => { setCardIdx(i); setFlipped(false); }} />
            ))}
          </div>
        </div>

        {/* Botões fixados no fundo */}
        <div style={{ padding:'12px 20px 32px', display:'flex', gap:10, maxWidth:460, width:'100%', margin:'0 auto' }}>
          {isLast ? (
            <button onClick={() => { setChalIdx(0); setLives(3); setPhase('challenges'); }}
              style={{ flex:1, background:C.cyan, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:15, color:'#fff', cursor:'pointer' }}>
              {t('card_challenges')}
            </button>
          ) : (
            <>
              {cardIdx > 0 && (
                <button onClick={() => { setCardIdx(i => i-1); setFlipped(false); }}
                  style={{ background:C.surface, color:C.textMid, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 20px', fontFamily:F.display, fontWeight:700, fontSize:15, cursor:'pointer' }}>
                  ‹
                </button>
              )}
              <button onClick={() => { setCardIdx(i => i+1); setFlipped(false); }}
                style={{ flex:1, background:C.cyan, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:15, color:'#fff', cursor:'pointer' }}>
                {t('card_next')}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── FALHA ──
  if (failed) return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
      <FaSkull size={64} color='#ff4d4d' style={{ marginBottom:16 }} />
      <div style={{ fontFamily:F.display, color:C.red, fontSize:22, fontWeight:900, marginBottom:8, textAlign:'center' }}>{t('chal_no_lives')}</div>
      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:14, marginBottom:32, textAlign:'center' }}>Tente os exercícios novamente.</div>
      <button onClick={() => { setFailed(false); setChalIdx(0); setAnswered(false); setSelected(null); setTfAnswer(null); setLives(3); }}
        style={{ background:C.cyan, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:'14px 32px', fontFamily:F.display, fontWeight:900, fontSize:16, color:'#fff', cursor:'pointer' }}>
        <><FaSyncAlt size={14} style={{marginRight:6}} /> TENTAR NOVAMENTE</>
      </button>
    </div>
  );

  // ── DESAFIOS ──
  if (phase === 'challenges' && chal) {
    const isCorrect = () => {
      if (chal.type === 'truefalse') return tfAnswer === chal.answer;
      return selected === chal.blank;
    };

    const handleAnswer = () => {
      if (!answered) {
        setAnswered(true);
        if (isCorrect()) {
          setXp(x => x + xpPerChallenge);
        } else {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) { setFailed(true); return; }
        }
      } else {
        setAnswered(false);
        setSelected(null);
        setTfAnswer(null);
        if (chalIdx + 1 < challenges.length) setChalIdx(chalIdx + 1);
        else setPhase('done');
      }
    };

    const currentStep = cards.length + chalIdx;

    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <ProgressHeader current={currentStep} total={totalSteps} onBack={cards.length > 0 ? () => { setCardIdx(cards.length-1); setFlipped(false); setPhase('cards'); } : onBack} xpEarned={xp}
          right={<Lives count={lives} />}
        />
        <div style={{ flex:1, padding:'20px 20px 120px', maxWidth:600, width:'100%', margin:'0 auto' }}>

          {/* Tipo de exercício */}
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:16 }}>
            {chal.type === 'truefalse' ? t('chal_truefalse') : t('chal_complete')}
          </div>

          {/* Complete */}
          {chal.type === 'complete' && (
            <>
              <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderRadius:14, padding:'18px 16px', marginBottom:24 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:700, lineHeight:1.6 }}>
                  {chal.sentence.replace(chal.blank, '').split('____').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span style={{ background: answered ? (isCorrect() ? C.correctBg : C.wrongBg) : C.cyanDim,
                          border:`2px solid ${answered ? (isCorrect() ? C.correct : C.wrong) : C.cyan}`,
                          borderRadius:8, padding:'2px 10px', color: answered ? (isCorrect() ? C.correct : C.wrong) : C.cyan,
                          fontWeight:900 }}>
                          {selected || '______'}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              {chal.options.map(opt => (
                <div key={opt} onClick={() => !answered && setSelected(opt)}
                  style={{ background: answered && opt === chal.blank ? C.correctBg : answered && selected === opt && opt !== chal.blank ? C.wrongBg : !answered && selected === opt ? C.cyanDim : C.surface,
                    border:`2px solid ${answered && opt === chal.blank ? C.correct : answered && selected === opt && opt !== chal.blank ? C.wrong : !answered && selected === opt ? C.cyan : C.border}`,
                    borderBottom:`4px solid ${answered && opt === chal.blank ? C.btn3d_green : answered && selected === opt && opt !== chal.blank ? C.btn3d_red : !answered && selected === opt ? '#008a91' : C.cardDepth}`,
                    borderRadius:14, padding:'14px 16px', marginBottom:10,
                    cursor: answered ? 'default' : 'pointer',
                    fontFamily:F.display, color: answered && opt === chal.blank ? C.correct : answered && selected === opt && opt !== chal.blank ? C.wrong : !answered && selected === opt ? C.cyan : C.text,
                    fontSize:15, fontWeight:700 }}>
                  {opt}
                </div>
              ))}
            </>
          )}

          {/* True/False */}
          {chal.type === 'truefalse' && (
            <>
              <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderRadius:14, padding:'20px 16px', marginBottom:24 }}>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:700, lineHeight:1.5 }}>
                  {chal.statement}
                </div>
              </div>
              <div style={{ display:'flex', gap:12, marginBottom:80 }}>
                {[
                  { val:true,  label:t('chal_true'), icon:'✓', iconBg:'#22d3a0', iconColor:'#0a0b0c' },
                  { val:false, label:t('chal_false'),       icon:'✗', iconBg:'#ff4d4d', iconColor:'#fff' },
                ].map(opt => {
                  const isSel   = !answered && tfAnswer === opt.val;
                  const isCorr  = answered && opt.val === chal.answer;
                  const isWrong = answered && tfAnswer === opt.val && opt.val !== chal.answer;
                  return (
                    <button key={String(opt.val)} onClick={() => !answered && setTfAnswer(opt.val)}
                      style={{ flex:1, padding:'18px 12px', borderRadius:16, cursor: answered ? 'default' : 'pointer',
                        background: isCorr ? C.correctBg : isWrong ? C.wrongBg : isSel ? C.cyanDim : C.surface,
                        border:`2px solid ${isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.cyan : C.border}`,
                        borderBottom:`4px solid ${isCorr ? C.btn3d_green : isWrong ? C.btn3d_red : isSel ? '#008a91' : C.cardDepth}`,
                        display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                      <div style={{ width:52, height:52, borderRadius:'50%',
                        background: isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.cyan : opt.iconBg,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:26, fontWeight:900, color: opt.iconColor }}>
                        {opt.icon}
                      </div>
                      <div style={{ fontFamily:F.display, fontWeight:800, fontSize:16,
                        color: isCorr ? C.correct : isWrong ? C.wrong : isSel ? C.cyan : C.text }}>
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Botão verificar */}
        {!answered && (
          <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'12px 20px 32px', background:C.bg }}>
            <button onClick={handleAnswer} disabled={selected === null && tfAnswer === null}
              style={{ width:'100%', maxWidth:520, display:'block', margin:'0 auto',
                background: (selected !== null || tfAnswer !== null) ? C.cyan : C.surface2,
                border:'none', borderBottom:`4px solid ${(selected !== null || tfAnswer !== null) ? '#008a91' : C.cardDepth}`,
                borderRadius:14, padding:'16px', fontFamily:F.display, fontWeight:800, fontSize:16,
                color: (selected !== null || tfAnswer !== null) ? '#fff' : C.textDim,
                cursor: (selected !== null || tfAnswer !== null) ? 'pointer' : 'not-allowed' }}>
              {t('chal_verify')}
            </button>
          </div>
        )}

        {/* Feedback */}
        {answered && (
          <FeedbackPanel correct={isCorrect()} explanation={chal.hint || null} onNext={handleAnswer}
            nextLabel={chalIdx + 1 < challenges.length ? t('chal_continue') : t('chal_finish')} />
        )}
      </div>
    );
  }

  // ── CONCLUSÃO ──
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
      <GiPartyPopper size={64} color='#22d3a0' style={{ marginBottom:16 }} />
      <div style={{ fontFamily:F.display, color:C.text, fontSize:24, fontWeight:900, marginBottom:8, textAlign:'center' }}>
        {lesson.title} {t('completed')}
      </div>
      <div style={{ fontFamily:F.mono, color:C.cyan, fontSize:18, fontWeight:700, marginBottom:32 }}>
        +{xp} {t('dx_earned')}
      </div>
      <button onClick={() => onComplete(xp)}
        style={{ background:C.cyan, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:'16px 40px', fontFamily:F.display, fontWeight:900, fontSize:16, color:'#fff', cursor:'pointer' }}>
        {t('btn_continue')}
      </button>
    </div>
  );
}
