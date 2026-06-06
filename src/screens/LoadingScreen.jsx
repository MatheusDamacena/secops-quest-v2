import { FaLock } from 'react-icons/fa';
import { C, F } from '../styles/tokens';
export default function LoadingScreen() {
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <FaLock size={48} color={C.cyan} />
      <div style={{ fontFamily:F.mono, color:C.accent, fontSize:14, letterSpacing:2 }}>CARREGANDO...</div>
    </div>
  );
}
