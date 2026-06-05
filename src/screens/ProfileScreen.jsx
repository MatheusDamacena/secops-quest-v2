import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { C, F } from '../styles/tokens';

export default function ProfileScreen({ profile, totalXp, streak, onBack }) {
  return (
    <div style={{ minHeight:'100dvh', background:C.bg }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
        <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900 }}>Perfil</div>
      </div>
      <div style={{ padding:'40px 20px', maxWidth:480, margin:'0 auto', textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:12 }}>{profile?.avatar}</div>
        <div style={{ fontFamily:F.display, color:C.text, fontSize:24, fontWeight:900, marginBottom:4 }}>{profile?.name}</div>
        <div style={{ display:'flex', gap:24, justifyContent:'center', margin:'24px 0' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:F.display, color:C.accent, fontSize:28, fontWeight:900 }}>{totalXp}</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>DX TOTAL</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:F.display, color:C.orange, fontSize:28, fontWeight:900 }}>{streak}</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>STREAK</div>
          </div>
        </div>
        <button onClick={() => signOut(auth)} style={{ background:'none', border:`1.5px solid ${C.wrong}`, borderRadius:12, padding:'12px 32px', fontFamily:F.mono, color:C.wrong, fontSize:13, cursor:'pointer', marginTop:24 }}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
