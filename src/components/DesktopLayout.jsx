import { FaBrain, FaBook, FaGamepad, FaTrophy, FaUser, FaBolt, FaFire, FaChevronLeft } from 'react-icons/fa';
import AppLogo from './AppLogo';
import Avatar from './Avatar';

const BG      = '#131f24';
const SURFACE = '#1c2b32';
const BORDER  = 'rgba(255,255,255,0.06)';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.55)';
const TEXT3   = 'rgba(255,255,255,0.3)';
const ACCENT  = '#ff4b7a';
const GREEN   = '#58cc02';
const AMBER   = '#ffc800';
const MONO    = "'Roboto Mono',monospace";
const SANS    = "'Inter','Nunito',sans-serif";

const NAV_ITEMS = [
  { icon: FaBrain,   label: 'Aprender',  screen: 'home' },
  { icon: FaBook,    label: 'Glossário', screen: 'glossary' },
  { icon: FaGamepad, label: 'Missões',   screen: 'missions' },
  { icon: FaTrophy,  label: 'Ranking',   screen: 'leaderboard' },
  { icon: FaUser,    label: 'Perfil',    screen: 'profile' },
];

// Painel direito — streak + DX + missão do dia
function RightPanel({ totalXp, streak, completedMods, totalMods }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Stats */}
      <div style={{ background: SURFACE, borderRadius: 16, padding: '16px', border: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 14, letterSpacing: 2, marginBottom: 14 }}>SEU PROGRESSO</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: 'rgba(255,200,0,0.08)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <FaFire size={20} color={AMBER} style={{ marginBottom: 6 }} />
            <div style={{ fontFamily: MONO, color: AMBER, fontSize: 26, fontWeight: 900 }}>{streak}</div>
            <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 13, letterSpacing: 1, marginTop: 2 }}>SEQUÊNCIA</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,75,122,0.08)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <FaBolt size={20} color={ACCENT} style={{ marginBottom: 6 }} />
            <div style={{ fontFamily: MONO, color: ACCENT, fontSize: 26, fontWeight: 900 }}>{(totalXp||0).toLocaleString()}</div>
            <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 13, letterSpacing: 1, marginTop: 2 }}>DX TOTAL</div>
          </div>
        </div>
      </div>

      {/* Progresso módulos */}
      <div style={{ background: SURFACE, borderRadius: 16, padding: '16px', border: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>MÓDULOS</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
          <div style={{ fontFamily: SANS, color: TEXT, fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
            {completedMods}<span style={{ color: TEXT3, fontSize: 18 }}>/{totalMods}</span>
          </div>
          <div style={{ fontFamily: MONO, color: ACCENT, fontSize: 17, fontWeight: 700 }}>
            {Math.round((completedMods/totalMods)*100)}%
          </div>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${Math.round((completedMods/totalMods)*100)}%`,
            background: `linear-gradient(90deg, ${ACCENT}, #a855f7)`,
            position: 'relative',
          }}>
            <div style={{ position:'absolute', top:1, left:4, right:6, height:3, background:'rgba(255,255,255,0.25)', borderRadius:2 }}/>
          </div>
        </div>
      </div>

      {/* Dica do dia */}
      <div style={{ background: SURFACE, borderRadius: 16, padding: '16px', border: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 14, letterSpacing: 2, marginBottom: 10 }}>DICA DO DIA</div>
        <div style={{ fontFamily: MONO, color: GREEN, fontSize: 14, letterSpacing: 1, marginBottom: 6 }}>YARA-L</div>
        <div style={{ fontFamily: SANS, color: TEXT2, fontSize: 17, lineHeight: 1.6 }}>
          Use <span style={{ color: '#00c4cc', fontFamily: MONO }}>nocase</span> para comparações case-insensitive em strings de log.
        </div>
      </div>

    </div>
  );
}

// Sidebar desktop
function Sidebar({ screen, onNavigate, profile, sidebarTitle }) {
  return (
    <div style={{
      width: 240, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${BORDER}`,
      padding: '20px 12px',
      position: 'sticky', top: 0, height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 24 }}>
        <AppLogo size={32} />
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 19, color: TEXT, letterSpacing: -0.3 }}>SecOps Quest</div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: TEXT3, letterSpacing: 1 }}>GOOGLE SECOPS</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ icon: Icon, label, screen: s }) => {
          const isActive = screen === s || (s === 'home' && screen === 'home');
          return (
            <button key={s} onClick={() => onNavigate(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 14,
                background: isActive ? 'rgba(255,75,122,0.12)' : 'transparent',
                border: `1.5px solid ${isActive ? 'rgba(255,75,122,0.25)' : 'transparent'}`,
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'background .15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={20} color={isActive ? ACCENT : TEXT3} />
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, color: isActive ? ACCENT : TEXT2, letterSpacing: -0.1 }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Avatar no bottom da sidebar */}
      <div style={{ marginTop: 'auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
        <Avatar profile={profile} size={32} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile?.name}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 13, color: TEXT3, letterSpacing: 1 }}>{sidebarTitle || 'SECOPS ANALYST'}</div>
        </div>
      </div>
    </div>
  );
}

// Wrapper principal — detecta desktop vs mobile via CSS
export default function DesktopLayout({ children, screen, onNavigate, profile, totalXp, streak, completedMods, totalMods, sidebarTitle }) {
  return (
    <>
      {/* CSS para controlar visibilidade por breakpoint */}
      <style>{`
        .sq-desktop-only { display: none !important; }
        .sq-mobile-only  { display: flex !important; }
        @media (min-width: 768px) {
          .sq-desktop-only { display: flex !important; }
          .sq-mobile-only  { display: none !important; }
          /* No desktop, módulos fluem dentro da coluna central */
          .sq-module-root {
            min-height: unset !important;
            height: auto !important;
          }
          /* Bottom nav e botões fixed dos módulos ficam dentro da coluna */
          .sq-module-root [style*="position: fixed"],
          .sq-module-root [style*="position:fixed"] {
            position: sticky !important;
            bottom: 0 !important;
          }
        }
      `}</style>

      {/* DESKTOP LAYOUT */}
      <div className="sq-desktop-only" style={{
        minHeight: '100dvh', background: '#131f24',
        flexDirection: 'row', alignItems: 'flex-start',
      }}>
        {screen === 'missions' ? (
          /* Missões — tela cheia, sem sidebar nem gadgets */
          <div style={{ flex: 1, overflowY: 'auto', height: '100vh', background: '#131f24' }}>
            {children}
          </div>
        ) : (
          <>
            {/* Sidebar esquerda — sempre colada no canto */}
            <Sidebar screen={screen} onNavigate={onNavigate} profile={profile} sidebarTitle={sidebarTitle} />

            {/* Wrapper central + gadgets — centralizados no espaço restante */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minWidth: 0 }}>

              {/* Coluna central */}
              <div style={{ width: '100%', maxWidth: 680, overflowY: 'auto', height: '100vh', background: '#131f24' }}>
                {children}
              </div>

              {/* Painel gadgets — junto ao conteúdo, não no canto */}
              <div style={{ width: 300, flexShrink: 0, padding: '24px 20px', position: 'sticky', top: 0, maxHeight: '100vh', overflowY: 'auto' }}>
                <RightPanel totalXp={totalXp} streak={streak} completedMods={completedMods} totalMods={totalMods} />
              </div>

            </div>
          </>
        )}
      </div>

      {/* MOBILE LAYOUT — sem mudança */}
      <div className="sq-mobile-only" style={{ flexDirection: 'column', minHeight: '100dvh' }}>
        {children}
      </div>
    </>
  );
}