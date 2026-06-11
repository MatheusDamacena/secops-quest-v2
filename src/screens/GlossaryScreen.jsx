import { useState } from 'react';
import { C, F } from '../styles/tokens';
import { FaBook } from 'react-icons/fa';
import glossary from '../data/glossary.json';

const CATS = ['Todos', 'Arquitetura', 'UDM', 'YARA-L', 'Ingestão', 'Cloud', 'Endpoint', 'Operações', 'Admin'];

export default function GlossaryScreen({ onBack }) {
  const [search, setSearch] = useState('');
  const [cat,    setCat]    = useState('Todos');

  const filtered = glossary.filter(g =>
    (cat === 'Todos' || g.cat === cat) &&
    (search === '' || g.term.toLowerCase().includes(search.toLowerCase()) || g.def.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className='sq-module-root' style={{ minHeight:'100dvh', background:'#131f24', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div className='sq-mobile-only' style={{ background:'#1c2b32', borderBottom:"1px solid rgba(255,255,255,0.06)", padding:'14px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer', minWidth:44 }}>‹</button>
        <div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(13px,2.5vw,15px)', letterSpacing:2 }}>REFERÊNCIA</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:'clamp(18px,4vw,22px)', fontWeight:900, display:'flex', alignItems:'center', gap:8 }}><FaBook size={18} color={C.cyan} /> Glossário</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding:'16px 16px 8px', background:'transparent' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar termo..."
          style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:'10px 14px', fontFamily:F.mono, fontSize:'clamp(15px,2.8vw,17px)', color:C.text, outline:'none' }} />
      </div>

      {/* Categorias */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', padding:'12px 16px 4px', background:'transparent', overflowX:'visible' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ background: cat===c ? C.accent : C.surface2, border:`1px solid ${cat===c ? C.accent : C.border}`, borderRadius:20, padding:'5px 12px', fontFamily:F.mono, color: cat===c ? '#fff' : C.textDim, fontSize:'clamp(13px,2.5vw,15px)', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px 40px', maxWidth:640, width:'100%', margin:'0 auto' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(13px,2.5vw,15px)', marginBottom:10 }}>{filtered.length} termos</div>
        {filtered.map(g => (
          <div key={g.term} style={{ background:'#1c2b32', border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:'13px 15px', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ fontFamily:F.display, color:C.text, fontSize:'clamp(14px,2.5vw,16px)', fontWeight:800 }}>{g.term}</div>
              <div style={{ fontFamily:F.mono, color:C.accent, fontSize:'clamp(12px,2.2vw,14px)', background:C.cyanDim, borderRadius:6, padding:'2px 7px' }}>{g.cat}</div>
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:'clamp(14px,2.5vw,16px)', lineHeight:1.6 }}>{g.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
