// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaBolt, FaFire, FaSignOutAlt, FaTrash, FaLandmark, FaGamepad, FaDoorOpen } from 'react-icons/fa';
import { C, F } from '../styles/tokens';
import Avatar from '../components/Avatar';
import modules from '../data/modules.json';

export default function ProfileScreen({ profile, totalXp, streak, progress, onBack }) {
  const [confirmLogout, setConfirmLogout] = useState(null);

  const getModuleProgress = (id) => {
    const p = progress || {};
    switch(id) {
      case 0: return Math.round(((p.m1||[]).length / 7) * 100);
      case 1: return (p.m0 === true || p.m0 === 100) ? 100 : 0;
      case 2: return p.m2 ? 100 : 0;
      case 3: return Math.round(((p.m3||[]).length / 4) * 100);
      case 4: return Math.round(((p.m4||[]).length / 15) * 100);
      case 5: return Math.round(((p.m5||[]).length / 7) * 100);
      case 6: return Math.round(((p.m6||[]).length / 8) * 100);
      default: return 0;
    }
  };

  const doneMods = modules.filter(m => getModuleProgress(m.id) === 100).length;
  const missionsDone = (progress?.m4 || []).length;

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:24, cursor:'pointer', padding:'4px 8px', marginLeft:-8 }}>‹</button>
        <span style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:800 }}>Perfil</span>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'24px max(20px, calc((100% - 568px) / 2)) 80px' }}>

        {/* Avatar card */}
        <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`5px solid ${C.border}`, borderRadius:20, padding:'28px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:16, backgroundImage:'repeating-linear-gradient(-45deg,rgba(255,255,255,.02) 0px,rgba(255,255,255,.02) 1px,transparent 1px,transparent 10px)' }}>
          <div style={{ lineHeight:1 }}><Avatar profile={profile} size={64} /></div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900 }}>{profile?.name || 'Analista'}</div>
          <div style={{ fontFamily:F.mono, color:C.accent, fontSize:10, letterSpacing:3 }}>GOOGLE SECOPS ANALYST</div>
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          {[
            { label:'DX Total',  value:totalXp,          Icon:FaBolt,     color:C.purple },
            { label:'Sequência', value:`${streak} dias`,  Icon:FaFire,     color:C.amber },
            { label:'Módulos',   value:`${doneMods}/7`,   Icon:FaLandmark, color:C.cyan },
            { label:'Missões',   value:missionsDone,      Icon:FaGamepad,  color:C.green },
          ].map(s => (
            <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:'16px', textAlign:'center' }}>
              <s.Icon size={28} color={s.color} />
              <div style={{ fontFamily:F.display, color:s.color, fontSize:24, fontWeight:900, marginTop:4 }}>{s.value}</div>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, letterSpacing:1, marginTop:2 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={() => setConfirmLogout('logout')}
            style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:14, padding:'14px 20px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.textMid, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <FaSignOutAlt size={16} /> Sair do jogo
          </button>
          <button onClick={() => setConfirmLogout('reset')}
            style={{ background:'none', border:`1.5px solid rgba(255,77,77,.3)`, borderRadius:14, padding:'14px 20px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.red, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <FaTrash size={16} /> Resetar progresso
          </button>
        </div>
      </div>

      {/* Modal Sair */}
      {confirmLogout === 'logout' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'20px 20px 0 0', padding:'28px 20px 44px', width:'100%', maxWidth:600 }}>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, textAlign:'center', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><FaSignOutAlt /> Sair do jogo?</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, textAlign:'center', lineHeight:1.8, marginBottom:24 }}>
              Você será levado de volta à tela inicial.<br/>Seu progresso e DX continuam salvos.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setConfirmLogout(null)}
                style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:'13px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.textDim, cursor:'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => signOut(auth)}
                style={{ flex:1, background:C.accent, border:'none', borderBottom:'4px solid rgba(0,0,0,.4)', borderRadius:14, padding:'13px', fontFamily:F.display, fontWeight:900, fontSize:15, color:'#fff', cursor:'pointer' }}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Resetar */}
      {confirmLogout === 'reset' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'20px 20px 0 0', padding:'28px 20px 44px', width:'100%', maxWidth:600 }}>
            <div style={{ fontFamily:F.display, color:C.red, fontSize:20, fontWeight:900, textAlign:'center', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><FaTrash /> Resetar tudo?</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, textAlign:'center', lineHeight:1.8, marginBottom:24 }}>
              Todo o progresso, DX e missões serão apagados.<br/>Esta ação não pode ser desfeita.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setConfirmLogout(null)}
                style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:14, padding:'13px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.textDim, cursor:'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => { localStorage.removeItem('secops-quest-v2'); signOut(auth); }}
                style={{ flex:1, background:C.red, border:'none', borderBottom:'4px solid rgba(0,0,0,.4)', borderRadius:14, padding:'13px', fontFamily:F.display, fontWeight:900, fontSize:15, color:'#fff', cursor:'pointer' }}>
                Resetar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
