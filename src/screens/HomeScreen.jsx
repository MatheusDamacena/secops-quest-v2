import { useState, useEffect } from 'react';
import { FaBrain, FaBook, FaGamepad, FaTrophy, FaUser, FaBolt, FaFire, FaLock, FaCheckCircle } from 'react-icons/fa';
import Avatar from '../components/Avatar';
import ModuleIcon from '../components/ModuleIcon';
import modules from '../data/modules.json';
import { useContent } from '../hooks/useContent';

// ─── Tokens ────────────────────────────────────────────────────────────────────
// Inspirados no Duolingo dark mode — verde escuro profundo, sem preto puro
const BG      = '#131f24';   // fundo geral
const SURFACE = '#1c2b32';   // cards/painéis
const SURFACE2= '#243540';   // hover/active states
const BORDER  = 'rgba(255,255,255,0.06)';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.55)';
const TEXT3   = 'rgba(255,255,255,0.3)';
const ACCENT  = '#ff4b7a';   // rosa SecOps — ação primária
const ACCENT3D= '#c2003e';   // sombra 3D do botão
const GREEN   = '#58cc02';   // concluído — verde Duolingo
const GREEN3D = '#3d8f01';
const AMBER   = '#ffc800';   // streak
const AMBER3D = '#cc9e00';
const MONO    = "'Roboto Mono','Share Tech Mono',monospace";
const SANS    = "'Inter','Nunito',sans-serif";

const NAV = [
  { icon: FaBrain,   label: 'APRENDER',  screen: 'home' },
  { icon: FaBook,    label: 'GLOSSÁRIO', screen: 'glossary' },
  { icon: FaGamepad, label: 'MISSÕES',   screen: 'missions' },
  { icon: FaTrophy,  label: 'RANKING',   screen: 'leaderboard' },
  { icon: FaUser,    label: 'PERFIL',    screen: 'profile' },
];

export default function HomeScreen({ profile, totalXp, streak, progress, onNavigate, lang = 'pt' }) {
  const { MISSIONS } = useContent(lang);
  const [activeNav, setActiveNav] = useState('home');
  // Sem hook de resize — usar clamp() CSS para responsividade pura

  const getModuleProgress = (id) => {
    const p = progress || {};
    switch(id) {
      case 0: return Math.round(((p.m1||[]).length / 7) * 100);
      case 1: return (p.m0 === true || p.m0 === 100) ? 100 : 0;
      case 2: return p.m2 ? 100 : 0;
      case 3: return Math.round(((p.m3||[]).length / 4) * 100);
      case 4: return Math.round(((p.m4||[]).length / MISSIONS.length) * 100);
      case 5: return Math.round(((p.m5||[]).length / 7) * 100);
      case 6: return Math.round(((p.m6||[]).length / 8) * 100);
      case 7: return Math.round(((p.m7||[]).length / 7) * 100);
      case 8: return Math.round(((p.m8||[]).length / 7) * 100);
      default: return 0;
    }
  };

  const completedMods  = modules.filter(m => getModuleProgress(m.id) === 100).length;
  const inProgressMods = modules.filter(m => { const p = getModuleProgress(m.id); return p > 0 && p < 100; });
  const nextMods       = modules.filter(m => getModuleProgress(m.id) === 0);
  const doneMods       = modules.filter(m => getModuleProgress(m.id) === 100);
  const continueModule = inProgressMods[0] || nextMods[0];
  const isGrandmaster  = completedMods === modules.length;
  const overallPct     = Math.round((completedMods / modules.length) * 100);

  const handleNav = (screen) => { setActiveNav(screen); onNavigate(screen); };

  // ─── Card de módulo ──────────────────────────────────────────────────────────
  const ModCard = ({ mod }) => {
    const pct    = getModuleProgress(mod.id);
    const done   = pct === 100;
    const active = pct > 0 && pct < 100;
    const locked = pct === 0;

    return (
      <div onClick={() => onNavigate('module', mod.id)}
        style={{
          background: done ? '#172b1e' : active ? '#28141f' : SURFACE,
          border: `1.5px solid ${done ? 'rgba(88,204,2,0.2)' : active ? 'rgba(255,75,122,0.25)' : BORDER}`,
          borderRadius: 16, padding: '16px 18px', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 16,
          cursor: 'pointer', opacity: locked ? 0.45 : 1,
          transition: 'opacity .2s, transform .15s',
          position: 'relative', overflow: 'hidden',
        }}
        onMouseEnter={e => { if (!locked) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
      >
        {/* Barra lateral de status */}
        {!locked && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
            background: done ? GREEN : ACCENT,
            borderRadius: '4px 0 0 4px',
          }} />
        )}

        {/* Ícone */}
        <div style={{
          width: 46, height: 46, borderRadius: 13, flexShrink: 0,
          background: done ? 'rgba(88,204,2,0.1)' : active ? 'rgba(255,75,122,0.1)' : 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ModuleIcon iconId={mod.iconId} size={22} done={done} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label de status */}
          <div style={{
            fontFamily: MONO, fontSize: 18, fontWeight: 700, letterSpacing: 2,
            color: done ? GREEN : active ? ACCENT : TEXT3,
            marginBottom: 3,
          }}>
            {done ? 'CONCLUÍDO' : active ? `MÓDULO ${mod.id} · EM PROGRESSO` : `MÓDULO ${mod.id}`}
          </div>

          {/* Título */}
          <div style={{
            fontFamily: SANS, fontSize: 18, fontWeight: 800,
            color: locked ? TEXT3 : TEXT,
            marginBottom: active ? 8 : 2,
            letterSpacing: -0.2,
          }}>
            {mod.title}
          </div>

          {/* Sub — só em locked/done */}
          {!active && (
            <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 13 }}>{mod.sub}</div>
          )}

          {/* Barra de progresso — só em active */}
          {active && (
            <div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: `linear-gradient(90deg, ${ACCENT}, #a855f7)`,
                  borderRadius: 99, transition: 'width .5s',
                  position: 'relative',
                }}>
                  <div style={{ position:'absolute', top:1, left:4, right:8, height:3, background:'rgba(255,255,255,0.3)', borderRadius:2 }} />
                </div>
              </div>
              <div style={{ fontFamily: MONO, color: ACCENT, fontSize: 13, marginTop: 4, fontWeight: 700 }}>{pct}%</div>
            </div>
          )}
        </div>

        {/* Direita */}
        {done
          ? <FaCheckCircle size={20} color={GREEN} style={{ flexShrink: 0 }} />
          : locked
            ? <FaLock size={14} color={TEXT3} style={{ flexShrink: 0 }} />
            : <div style={{ color: active ? ACCENT : TEXT3, fontSize: 27, flexShrink: 0 }}>›</div>
        }
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER — só no mobile (desktop usa sidebar) ─────────────────────── */}
      <div className="sq-mobile-only" style={{
        background: BG, borderBottom: `1px solid ${BORDER}`,
        padding: '12px 20px',
        justifyContent: 'space-between',
        flexShrink: 0,
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <Avatar profile={profile} size={26} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: SANS, color: TEXT, fontSize: 18, fontWeight: 800, letterSpacing: -0.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {profile?.name}
            </div>
            <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 13, letterSpacing: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              SECOPS ANALYST
            </div>
          </div>
        </div>

        {/* Stats — sem borda, só fundo */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <div style={{ background: 'rgba(255,200,0,0.1)', borderRadius: 10, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaFire size={13} color={AMBER} />
            <span style={{ fontFamily: MONO, color: AMBER, fontSize: 13, fontWeight: 800 }}>{streak}</span>
          </div>
          <div style={{ background: 'rgba(255,75,122,0.1)', borderRadius: 10, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaBolt size={13} color={ACCENT} />
            <span style={{ fontFamily: MONO, color: ACCENT, fontSize: 13, fontWeight: 800 }}>{totalXp}</span>
          </div>
        </div>
      </div>

      {/* ── CONTEÚDO ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px max(16px, calc((100% - 600px) / 2)) clamp(80px, 12vh, 90px)' }}>

        {/* ── Progresso geral — bloco limpo sem borda ────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 900, color: TEXT, letterSpacing: -0.5 }}>
                Olá, {profile?.name?.split(' ')[0]}!
              </div>
              <div style={{ fontFamily: MONO, color: TEXT2, fontSize: 18, marginTop: 2 }}>
                {completedMods} de {modules.length} módulos completos
              </div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 27, fontWeight: 900, color: TEXT, lineHeight: 1 }}>
              {overallPct}<span style={{ fontSize: 13, color: TEXT3 }}>%</span>
            </div>
          </div>

          {/* Barra de progresso grossa — estilo Duolingo */}
          <div style={{ height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%', width: `${overallPct}%`,
              background: `linear-gradient(90deg, ${ACCENT} 0%, #a855f7 100%)`,
              borderRadius: 99, transition: 'width .6s ease',
              position: 'relative',
            }}>
              {overallPct > 8 && (
                <div style={{ position:'absolute', top:3, left:6, right:10, height:4, background:'rgba(255,255,255,0.25)', borderRadius:2 }} />
              )}
            </div>
          </div>
        </div>

        {/* ── CTA Continuar ─────────────────────────────────────────────────── */}
        {continueModule && (
          <button onClick={() => onNavigate('module', continueModule.id)}
            style={{
              width: '100%', background: ACCENT,
              border: 'none',
              borderBottom: `4px solid ${ACCENT3D}`,
              borderRadius: 16, padding: '16px 20px',
              fontFamily: SANS, fontWeight: 900, fontSize: 18,
              color: '#fff', cursor: 'pointer', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              letterSpacing: 0.2,
              transition: 'transform .1s, box-shadow .1s',
              boxShadow: `0 6px 24px rgba(255,75,122,0.3)`,
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.borderBottomWidth = '2px'; }}
            onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderBottomWidth = '4px'; }}
          >
            ▶ Continuar — {continueModule.title}
          </button>
        )}

        {/* Botão Revisar — Grandmaster */}
        {isGrandmaster && (
          <button onClick={() => onNavigate('missions')}
            style={{
              width: '100%', background: AMBER,
              border: 'none', borderBottom: `4px solid ${AMBER3D}`,
              borderRadius: 16, padding: '14px 20px',
              fontFamily: SANS, fontWeight: 900, fontSize: 18,
              color: '#131f24', cursor: 'pointer', marginBottom: 24,
            }}>
            Revisar modo Grandmaster
          </button>
        )}

        {/* ── Em progresso ───────────────────────────────────────────────────── */}
        {inProgressMods.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: TEXT3, letterSpacing: 2.5, marginBottom: 12 }}>
              EM PROGRESSO
            </div>
            {inProgressMods.map(mod => <ModCard key={mod.id} mod={mod} />)}
          </div>
        )}

        {/* ── Concluídos ─────────────────────────────────────────────────────── */}
        {doneMods.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: TEXT3, letterSpacing: 2.5, marginBottom: 12 }}>
              CONCLUÍDOS
            </div>
            {doneMods.map(mod => <ModCard key={mod.id} mod={mod} />)}
          </div>
        )}

        {/* ── Próximos ───────────────────────────────────────────────────────── */}
        {nextMods.length > 0 && (
          <div>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: TEXT3, letterSpacing: 2.5, marginBottom: 12 }}>
              PRÓXIMOS
            </div>
            {nextMods.map(mod => <ModCard key={mod.id} mod={mod} />)}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────────────── */}
      <div className="sq-mobile-only" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: SURFACE,
        borderTop: `1px solid ${BORDER}`,
        justifyContent: 'space-around',
        padding: '6px 0 max(10px, env(safe-area-inset-bottom))',
        zIndex: 50,
      }}>
        {NAV.map(({ icon: Icon, label, screen }) => {
          const isActive = screen === 'home' ? activeNav === screen : false;
          return (
            <button key={screen}
              onClick={() => handleNav(screen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                flex: 1, padding: '4px 0', minWidth: 0,
              }}>
              {/* Pill de fundo para item ativo */}
              <div style={{
                width: 36, height: 28, borderRadius: 8,
                background: screen === 'home' ? 'rgba(255,75,122,0.12)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .2s',
              }}>
                <Icon size={18} color={screen === 'home' ? ACCENT : TEXT3} />
              </div>
              <div style={{
                fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: 0,
                color: screen === 'home' ? ACCENT : TEXT3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
