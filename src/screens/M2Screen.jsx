// ─── MÓDULO 2 — UDM MODELO DE DADOS ──────────────────────────────────────────
import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { FaMicroscope, FaChartBar } from 'react-icons/fa';
import ModuleScreen from './ModuleScreen';
import { useContent } from '../hooks/useContent';

export default function M2Screen({ progress, onComplete, onBack, lang = 'pt', t = k => k }) {
  const { M2_CHALLENGE } = useContent(lang);
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer' }}>‹</button>
          <div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>MÓDULO 2</div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}><FaMicroscope size={18} color={C.green} /> UDM — Modelo de Dados</div>
          </div>
        </div>
        <div style={{ flex:1, padding:'32px 20px', maxWidth:600, width:'100%', margin:'0 auto' }}>
          <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`4px solid ${C.cardDepth}`, borderRadius:16, padding:'20px', marginBottom:24 }}>
            <div style={{ marginBottom:12, textAlign:'center' }}><FaMicroscope size={48} color={C.green} /></div>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:18, fontWeight:800, marginBottom:8, textAlign:'center' }}>Inspecione os campos UDM</div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.7 }}>
              O UDM (Unified Data Model) é o schema padrão do Google SecOps. Neste módulo você vai identificar os campos corretos para cada tipo de evento.
            </div>
          </div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>
            <FaChartBar size={13} /> {M2_CHALLENGE.length} exercícios de identificação de campos UDM
          </div>
          <button onClick={() => setStarted(true)}
            style={{ width:'100%', background:C.green, border:'none', borderBottom:`4px solid ${C.btn3d_green}`, borderRadius:14, padding:14, fontFamily:F.display, fontWeight:900, fontSize:16, color:'#fff', cursor:'pointer' }}>
            ▶ INICIAR MÓDULO
          </button>
        </div>
      </div>
    );
  }

  return (
    <ModuleScreen
      lesson={{ title:'UDM — Modelo de Dados', cards:[], challenges: M2_CHALLENGE, icon:'🔬' }}
      onBack={() => setStarted(false)}
      onComplete={(xp) => onComplete({ m2: true }, xp, true)}
        t={t}
    />
  );
}
