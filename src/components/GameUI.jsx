// ─── COMPONENTES DE UI DO JOGO ────────────────────────────────────────────────
import { C, F } from '../styles/tokens';

export function Btn3D({ onClick, color, shadow, disabled, children, style = {} }) {
  const bg     = disabled ? C.surface2 : (color || C.accent);
  const bot    = disabled ? C.cardDepth : (shadow || '#008a91');
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

export function OptionCard({ text, onClick, selected, correct, wrong, disabled, icon }) {
  let bg = C.surface, borderSide = C.cardDepth, borderBot = C.cardDepth, color = C.text;
  if (selected) { bg = C.cyanDim;    borderSide = C.cyan;    borderBot = C.cyan;         color = C.cyan; }
  if (correct)  { bg = C.correctBg;  borderSide = C.correct; borderBot = C.btn3d_green;  color = C.correct; }
  if (wrong)    { bg = C.wrongBg;    borderSide = C.wrong;   borderBot = C.btn3d_red;    color = C.wrong; }
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ width:'100%', background:bg,
        border:`2px solid ${borderSide}`, borderBottom:`4px solid ${borderBot}`,
        borderRadius:16, padding:'14px 16px', marginBottom:12,
        display:'flex', alignItems:'center', gap:14,
        cursor: disabled ? 'default' : 'pointer',
        textAlign:'left', transition:'all .12s', minHeight:58 }}>
      {icon && (
        <div style={{ width:38, height:38, borderRadius:10,
          border:`2px solid ${color}44`, background:color+'18',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0, fontFamily:F.mono, color, fontSize:19, fontWeight:700 }}>
          {icon}
        </div>
      )}
      <div style={{ fontFamily:F.display, color, fontSize:15, fontWeight:700, flex:1 }}>
        {text}
      </div>
    </button>
  );
}

export function ProgressHeader({ current, total, onBack, xpEarned = 0 }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 16px', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:24, cursor:'pointer', padding:'4px 8px' }}>✕</button>
        <div style={{ flex:1, height:10, background:C.border, borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:C.accent, borderRadius:99, transition:'width .4s ease' }}/>
        </div>
        {xpEarned > 0 && <div style={{ fontFamily:F.mono, color:C.accent, fontSize:12, fontWeight:700 }}>+{xpEarned} DX</div>}
      </div>
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
        <div style={{ fontSize:28 }}>{correct ? '✅' : '❌'}</div>
        <div style={{ fontFamily:F.display, color: correct ? C.correct : C.wrong, fontSize:17, fontWeight:900 }}>
          {correct ? 'Correto!' : 'Incorreto'}
        </div>
      </div>
      {explanation && (
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, lineHeight:1.6, marginBottom:16 }}>
          {explanation}
        </div>
      )}
      <Btn3D color={correct ? C.green : C.red} shadow={correct ? C.btn3d_green : C.btn3d_red} onClick={onNext}>
        {nextLabel}
      </Btn3D>
    </div>
  );
}
