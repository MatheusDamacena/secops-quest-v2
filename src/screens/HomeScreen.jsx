import { C, F } from '../styles/tokens';
import modules from '../data/modules.json';

export default function HomeScreen({ profile, totalXp, streak, progress, onNavigate }) {
  const getModuleProgress = (id) => {
    const p = progress || {};
    switch(id) {
      case 0: return (p.m0 === true || p.m0 === 100) ? 100 : 0;
      case 1: return Math.round(((p.m1||[]).length / 7) * 100);
      case 2: return p.m2 ? 100 : 0;
      case 3: return Math.round(((p.m3||[]).length / 4) * 100);
      case 4: return Math.round(((p.m4||[]).length / 15) * 100);
      case 5: return Math.round(((p.m5||[]).length / 7) * 100);
      case 6: return Math.round(((p.m6||[]).length / 6) * 100);
      default: return 0;
    }
  };

  const completedMods = modules.filter(m => getModuleProgress(m.id) === 100).length;

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:28 }}>{profile?.avatar}</div>
          <div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800 }}>{profile?.name}</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{completedMods}/7 módulos</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:16 }}>
          <div style={{ fontFamily:F.mono, color:C.orange, fontSize:13, fontWeight:700 }}>🔥 {streak}</div>
          <div style={{ fontFamily:F.mono, color:C.accent, fontSize:13, fontWeight:700 }}>⚡ {totalXp} DX</div>
        </div>
      </div>

      {/* Lista de módulos */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px max(16px, calc((100% - 600px) / 2)) 80px' }}>

        {/* Card de início */}
        <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`4px solid ${C.cardDepth}`, borderRadius:16, padding:'16px 18px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:28 }}>🔒</div>
            <div>
              <div style={{ fontFamily:F.display, color:C.text, fontSize:16, fontWeight:900 }}>SecOps Quest</div>
              <div style={{ fontFamily:F.mono, color:C.accent, fontSize:11, letterSpacing:1 }}>GOOGLE SECOPS · YARA-L · UDM · SOAR</div>
            </div>
          </div>
          <button onClick={() => onNavigate('module', 0)} style={{ background:C.accent, border:'none', borderBottom:'4px solid #008a91', borderRadius:12, padding:'10px 20px', fontFamily:F.display, fontWeight:900, fontSize:14, color:'#fff', cursor:'pointer' }}>
            ▶ Começar
          </button>
        </div>

        {/* Módulos */}
        {modules.map((mod, idx) => {
          const pct = getModuleProgress(mod.id);
          const done = pct === 100;
          return (
            <div key={mod.id} onClick={() => onNavigate('module', mod.id)}
              style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`4px solid ${C.cardDepth}`, borderRadius:16, padding:'14px 16px', marginBottom:12, display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'all .12s' }}>
              {/* Ícone */}
              <div style={{ width:44, height:44, borderRadius:12, background:C.surface2, border:`2px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                {done ? '✅' : mod.icon}
              </div>
              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, letterSpacing:2, marginBottom:2 }}>MÓDULO {idx}</div>
                <div style={{ fontFamily:F.display, color:C.text, fontSize:15, fontWeight:800, marginBottom:4 }}>{mod.title}</div>
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{mod.sub}</div>
                {pct > 0 && (
                  <div style={{ height:4, background:C.border, borderRadius:99, overflow:'hidden', marginTop:6 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:done ? C.green : C.accent, borderRadius:99 }}/>
                  </div>
                )}
              </div>
              <div style={{ color:C.textDim, fontSize:20, flexShrink:0 }}>›</div>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-around', padding:'10px 0 20px' }}>
        {[
          { icon:'🧠', label:'Aprender',   screen:'home' },
          { icon:'📖', label:'Glossário',  screen:'glossary' },
          { icon:'🎮', label:'Missões',    screen:'missions' },
          { icon:'🏆', label:'Ranking',    screen:'leaderboard' },
          { icon:'👤', label:'Perfil',     screen:'profile' },
        ].map(item => (
          <button key={item.screen} onClick={() => onNavigate(item.screen)}
            style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ fontSize:22 }}>{item.icon}</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, letterSpacing:1 }}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
