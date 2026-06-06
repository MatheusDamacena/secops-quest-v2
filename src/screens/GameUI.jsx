// ─── COMPONENTES DE UI DO JOGO ────────────────────────────────────────────────
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { C, F } from '../styles/tokens';

export function Btn3D({ onClick, color, shadow, disabled, children, style = {} }) {
  const bg  = disabled ? C.surface2 : (color || C.cyan);
  const bot = disabled ? C.cardDepth : (shadow || '#008a91');
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ width:'100%', background:bg, border:'none',
        borderBottom:`4px solid ${bot}`, borderRadius:14, padding:'14px',
        fontFamily:F.display, fontWeight:900, fontSize:16,
        color: disabled ? C.textDim : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition:'all .1s', ...style }}>
      {children}
    </button>
  );
}

export function ProgressHeader({ current, total, onBack, xpEarned = 0, right }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 16px', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:24, cursor:'pointer', padding:'4px 8px' }}><FaTimes size={16} /></button>
        <div style={{ flex:1, height:10, background:C.border, borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:C.cyan, borderRadius:99, transition:'width .4s ease' }}/>
        </div>
        {xpEarned > 0 && <div style={{ fontFamily:F.mono, color:C.cyan, fontSize:12, fontWeight:700 }}>+{xpEarned} DX</div>}
        {right && right}
      </div>
    </div>
  );
}

export function Lives({ count = 3 }) {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[0,1,2].map(i => (
        <FaShieldAlt key={i} size={18} color={i < count ? C.cyan : C.border} style={{ opacity: i < count ? 1 : 0.3 }} />
      ))}
    </div>
  );
}

export function FeedbackPanel({ correct, explanation, onNext, nextLabel = 'CONTINUAR' }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0,
      background: correct ? C.correctBg : C.wrongBg,
      border:`2px solid ${correct ? C.correct : C.wrong}`,
      borderBottom:'none', borderRadius:'16px 16px 0 0',
      padding:'20px 20px 36px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: explanation ? 10 : 0 }}>
        {correct
          ? <FaCheckCircle size={28} color={C.correct} />
          : <FaTimesCircle size={28} color={C.wrong} />}
        <div style={{ fontFamily:F.display, color: correct ? C.correct : C.wrong, fontSize:17, fontWeight:900 }}>
          {correct ? 'Correto!' : 'Incorreto'}
        </div>
      </div>
      {explanation && (
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.6, marginBottom:16 }}>
          {explanation}
        </div>
      )}
      <button onClick={onNext}
        style={{ width:'100%', background: correct ? C.green : C.red, border:'none',
          borderBottom:`4px solid ${correct ? C.btn3d_green : C.btn3d_red}`,
          borderRadius:14, padding:14, fontFamily:F.display, fontWeight:900,
          fontSize:16, color:'#fff', cursor:'pointer' }}>
        {nextLabel}
      </button>
    </div>
  );
}
