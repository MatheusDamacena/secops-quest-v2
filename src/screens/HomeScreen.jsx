import { C, F } from '../styles/tokens';
export default function HomeScreen({ profile, totalXp, streak, progress, onNavigate }) {
  return (
    <div style={{ minHeight:'100dvh', background:C.bg }}>
      <div style={{ background:C.surface, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:F.display, color:C.text, fontWeight:800 }}>{profile?.avatar} {profile?.name}</div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>0/7 módulos</div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ fontFamily:F.mono, color:C.orange, fontSize:13 }}>🔥 {streak}</div>
          <div style={{ fontFamily:F.mono, color:C.accent, fontSize:13 }}>⚡ {totalXp} DX</div>
        </div>
      </div>
      <div style={{ padding:20, textAlign:'center', fontFamily:F.mono, color:C.textDim, fontSize:14, marginTop:40 }}>
        🚧 Módulos em migração para v2...<br/>
        <button onClick={() => onNavigate('leaderboard')} style={{ marginTop:20, background:C.accent, color:'#fff', border:'none', borderRadius:12, padding:'12px 24px', fontFamily:F.display, fontWeight:800, fontSize:15, cursor:'pointer' }}>
          🏆 Ver Leaderboard
        </button>
      </div>
    </div>
  );
}
