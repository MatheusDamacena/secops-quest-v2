// ─── ONBOARDING — Apresentação interativa na primeira vez ─────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { FaBolt, FaFire, FaTrophy, FaGamepad, FaBook, FaChevronRight } from 'react-icons/fa';

const SLIDES = [
  {
    emoji: '🛡️',
    title: 'Bem-vindo ao SecOps Quest',
    subtitle: 'Aprenda Google SecOps jogando',
    body: 'Domine YARA-L, UDM e detecção de ameaças reais através de flashcards, puzzles e missões práticas — no seu ritmo, no seu celular.',
    color: C.cyan,
    items: [
      { icon: <FaBook size={14} />,    label: '7 módulos completos de Google SecOps' },
      { icon: <FaGamepad size={14} />, label: '15 missões de detecção com casos reais' },
      { icon: <FaTrophy size={14} />,  label: 'Certificado Grandmaster ao concluir tudo' },
    ],
  },
  {
    emoji: '⚡',
    title: 'Ganhe DX a cada lição',
    subtitle: 'Seu progresso, seu ritmo',
    body: 'DX (Detection XP) é a sua moeda de aprendizado. Cada flashcard, exercício e missão concluída te dá DX e sobe no ranking global.',
    color: C.purple,
    items: [
      { icon: <FaBolt size={14} color={C.purple} />, label: 'Resposta correta = +10 DX' },
      { icon: <FaBolt size={14} color={C.amber}  />, label: 'Missão completa = +100~400 DX' },
      { icon: <FaTrophy size={14} color='#FFD700' />, label: 'Grandmaster = troféu no leaderboard' },
    ],
  },
  {
    emoji: '🔥',
    title: 'Mantenha sua sequência',
    subtitle: 'Jogue todo dia para não perder o fogo',
    body: 'Cada dia que você joga incrementa sua sequência. Jogadores com sequências longas têm vantagem no ranking — não quebre a corrente!',
    color: C.amber,
    items: [
      { icon: <FaFire size={14} color={C.amber} />, label: 'Jogue diariamente para manter o streak' },
      { icon: <FaFire size={14} color={C.red}   />, label: 'Faltou um dia? Streak volta a zero' },
      { icon: <FaBolt size={14} color={C.amber} />, label: 'Streak aparece no ranking global' },
    ],
  },
];

export default function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const s = SLIDES[slide];

  return (
    <div style={{
      minHeight: '100dvh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '48px 24px 40px',
    }}>

      {/* Skip */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDone} style={{
          background: 'none', border: 'none',
          fontFamily: F.mono, color: C.textDim, fontSize: 13, cursor: 'pointer',
        }}>
          Pular →
        </button>
      </div>

      {/* Conteúdo central */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Emoji grande */}
        <div style={{ fontSize: 80, marginBottom: 24, filter: `drop-shadow(0 0 24px ${s.color}66)` }}>
          {s.emoji}
        </div>

        <div style={{ fontFamily: F.mono, color: s.color, fontSize: 11, letterSpacing: 3, marginBottom: 8, textTransform: 'uppercase' }}>
          {s.subtitle}
        </div>
        <div style={{ fontFamily: F.display, color: C.text, fontSize: 26, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
          {s.title}
        </div>
        <div style={{ fontFamily: F.mono, color: C.textDim, fontSize: 13, lineHeight: 1.9, marginBottom: 32 }}>
          {s.body}
        </div>

        {/* Items */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {s.items.map((item, i) => (
            <div key={i} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${s.color}`,
              borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            }}>
              <div style={{ color: s.color, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ fontFamily: F.mono, color: C.text, fontSize: 13 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 24 : 8, height: 8,
              borderRadius: 4, cursor: 'pointer',
              background: i === slide ? s.color : C.border,
              transition: 'all .3s',
            }} />
          ))}
        </div>

        {/* Botão */}
        <button onClick={() => isLast ? onDone() : setSlide(s => s + 1)} style={{
          width: '100%',
          background: isLast ? C.green : s.color,
          border: 'none',
          borderBottom: `4px solid ${isLast ? C.btn3d_green : '#00888f'}`,
          borderRadius: 16, padding: '16px',
          fontFamily: F.display, fontWeight: 900, fontSize: 18,
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background .3s',
        }}>
          {isLast ? '🚀 COMEÇAR AGORA' : <>PRÓXIMO <FaChevronRight size={14} /></>}
        </button>
      </div>
    </div>
  );
}
