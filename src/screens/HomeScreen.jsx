import { C, F } from '../styles/tokens';
import { FaBrain, FaBook, FaGamepad, FaTrophy, FaUser, FaBolt, FaFire, FaLock } from 'react-icons/fa';
import Avatar from '../components/Avatar';
import ModuleIcon from '../components/ModuleIcon';
import modules from '../data/modules.json';

export default function HomeScreen({ profile, totalXp, streak, progress, onNavigate }) {
  const getModuleProgress = (id) => {
    const p = progress || {};
    switch(id) {
      case 0: return Math.round(((p.m1||[]).length / 7) * 100);
      case 1: return (p.m0 === true || p.m0 === 100) ? 100 : 0;
      case 2: return p.m2 ? 100 : 0;
      case 3: return Math.round(((p.m3||[]).length / 4) * 100);
      case 4: return Math.round(((p.m4||[]).length / 16) * 100);
      case 5: return Math.round(((p.m5||[]).length / 7) * 100);
      case 6: return Math.round(((p.m6||[]).length / 8) * 100);
      default: return 0;
    }
  };

  const completedMods  = modules.filter(m => getModuleProgress(m.id) === 100).length;
  const inProgressMods = modules.filter(m => { const p = getModuleProgress(m.id); return p > 0 && p < 100; });
  const nextMods       = modules.filter(m => getModuleProgress(m.id) === 0);
  const continueModule = inProgressMods[0] || nextMods[0];
  const isGrandmaster  = completedMods === modules.length;

  const NAV = [
    { Icon: FaBrain,   label: 'Aprender',  screen: 'home' },
    { Icon: FaBook,    label: 'Glossário', screen: 'glossary' },
    { Icon: FaGamepad, label: 'Missões',   screen: 'missions' },
    { Icon: FaTrophy,  label: 'Ranking',   screen: 'leaderboard' },
    { Icon: FaUser,    label: 'Perfil',    screen: 'profile' },
  ];

  const ModCard = ({ mod, inProgress }) => {
    const pct = getModuleProgress(mod.id);
    const done = pct === 100;
    return (
      <div onClick={() => onNavigate('module', mod.id)}
        style={{ background: C.surface,
          border: `2px solid ${inProgress ? C.accent : done ? C.green+'55' : C.border}`,
          borderBottom: `4px solid ${inProgress ? C.btn3d_pink : done ? C.btn3d_green : C.cardDepth}`,
          borderRadius: 16, padding: '14px 16px', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          boxShadow: inProgress ? `0 0 16px ${C.accentDim}` : 'none' }}>
        {/* Ícone */}
        <div style={{ width:44, height:44, borderRadius:12,
          background: done ? C.greenDim : inProgress ? C.accentDim : C.surface2,
          border: `2px solid ${done ? C.green+'44' : inProgress ? C.accentBorder : C.border}`,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <ModuleIcon iconId={mod.iconId} size={22} done={done} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.mono, color: inProgress ? C.accent : C.textDim, fontSize: 10, letterSpacing: 2, marginBottom: 2 }}>
            MÓDULO {mod.id}{inProgress ? ' · EM PROGRESSO' : done ? ' · CONCLUÍDO' : ''}
          </div>
          <div style={{ fontFamily: F.display, color: C.text, fontSize: 16, fontWeight: 800, marginBottom: inProgress ? 6 : 2 }}>
            {mod.title}
          </div>
          {!inProgress && <div style={{ fontFamily: F.mono, color: C.textDim, fontSize: 11 }}>{mod.sub}</div>}
          {inProgress && (
            <div style={{ height:5, background: C.border, borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${C.accent},${C.purple})`, borderRadius:99 }}/>
            </div>
          )}
          {inProgress && <div style={{ fontFamily: F.mono, color: C.accent, fontSize: 10, marginTop: 4 }}>{pct}%</div>}
        </div>
        <div style={{ color: inProgress ? C.accent : C.textDim, fontSize: 20 }}>›</div>
      </div>
    );
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#1c1e21 0%,#181a1f 100%)`, borderBottom:`1px solid rgba(255,26,117,0.18)`, padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, boxShadow:'0 2px 16px rgba(0,0,0,0.35)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Avatar profile={profile} size={26} />
          <div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{profile?.name}</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{completedMods}/7 módulos</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:20, padding:'6px 12px', display:'flex', alignItems:'center', gap:5 }}>
            <FaFire size={13} color={C.orange} />
            <span style={{ fontFamily:F.mono, color:C.orange, fontSize:13, fontWeight:700 }}>{streak}</span>
          </div>
          <div style={{ background:C.accentDim, border:`1px solid ${C.accentBorder}`, borderRadius:20, padding:'6px 12px', display:'flex', alignItems:'center', gap:5 }}>
            <FaBolt size={13} color={C.accent} />
            <span style={{ fontFamily:F.mono, color:C.accent, fontSize:13, fontWeight:700 }}>{totalXp} DX</span>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px max(16px, calc((100% - 600px) / 2)) 80px' }}>
        {/* Card Olá */}
        <div style={{ background:`linear-gradient(135deg,#1c1e21 0%,#1a1c22 100%)`, border:`2px solid rgba(255,26,117,0.2)`, borderBottom:`4px solid rgba(255,26,117,0.1)`, borderRadius:20, padding:'20px', marginBottom:20, position:'relative', overflow:'hidden', boxShadow:'0 4px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ position:'absolute', top:0, right:0, width:200, height:200, background:'radial-gradient(circle, rgba(255,26,117,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, marginBottom:4 }}>
                Olá, {profile?.name?.split(' ')[0]}!
              </div>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginBottom:12 }}>
                {completedMods} DE 7 MÓDULOS · {totalXp} DX
              </div>
              <div style={{ height:8, background:C.border, borderRadius:99, overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', width:`${Math.round((completedMods/7)*100)}%`, background:`linear-gradient(90deg,${C.accent},${C.purple})`, borderRadius:99, transition:'width .5s' }}/>
              </div>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{Math.round((completedMods/7)*100)}%</div>
            </div>
            {continueModule && (
              <button onClick={() => onNavigate('module', continueModule.id)}
                style={{ background:C.accent, border:'none', borderBottom:`4px solid ${C.btn3d_pink}`, borderRadius:14, padding:'12px 18px', fontFamily:F.display, fontWeight:900, fontSize:14, color:'#fff', cursor:'pointer', flexShrink:0 }}>
                ▶ Continuar
              </button>
            )}
            {isGrandmaster && (
              <button onClick={() => onNavigate('missions')}
                style={{ background:'linear-gradient(135deg,#FFD700,#fbbf24)', border:'none', borderBottom:'3px solid #a06000', borderRadius:12, padding:'10px 18px', fontFamily:F.display, fontWeight:900, fontSize:13, color:'#0a0b0c', cursor:'pointer', flexShrink:0 }}>
                🔄 Revisar
              </button>
            )}
          </div>
        </div>

        {/* EM PROGRESSO */}
        {inProgressMods.length > 0 && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ color:C.accent, fontSize:12 }}>▶</div>
              <div style={{ fontFamily:F.mono, color:C.accent, fontSize:12, fontWeight:700, letterSpacing:2 }}>EM PROGRESSO</div>
            </div>
            {inProgressMods.map(mod => <ModCard key={mod.id} mod={mod} inProgress />)}
          </>
        )}

        {/* PRÓXIMOS */}
        {nextMods.length > 0 && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, marginTop: inProgressMods.length > 0 ? 8 : 0, opacity:0.7 }}>
              <FaLock size={12} color={C.textDim} />
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, fontWeight:700, letterSpacing:2 }}>PRÓXIMOS</div>
            </div>
            {nextMods.map(mod => <ModCard key={mod.id} mod={mod} inProgress={false} />)}
          </>
        )}

        {/* Concluídos */}
        {modules.filter(m => getModuleProgress(m.id) === 100).map(mod => (
          <ModCard key={mod.id} mod={mod} inProgress={false} />
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-around', padding:'10px 0 20px' }}>
        {NAV.map(({ Icon, label, screen }) => (
          <button key={screen} onClick={() => onNavigate(screen)}
            style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <Icon size={22} color={C.textDim} />
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, letterSpacing:1 }}>{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
