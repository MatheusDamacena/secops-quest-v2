import { useState } from 'react';
import { C, F } from '../styles/tokens';
import glossary from '../data/glossary.json';

const CATS = ['Todos', 'Arquitetura', 'UDM', 'YARA-L', 'Ingestão', 'Operações', 'Admin'];

export default function GlossaryScreen({ onBack }) {
  const [search, setSearch] = useState('');
  const [cat,    setCat]    = useState('Todos');

  const filtered = glossary.filter(g =>
    (cat === 'Todos' || g.cat === cat) &&
    (search === '' || g.term.toLowerCase().includes(search.toLowerCase()) || g.def.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:29, cursor:'pointer', minWidth:44 }}>‹</button>
        <div>
          <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2 }}>REFERÊNCIA</div>
          <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900 }}>📖 Glossário</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding:'12px 16px 0', background:C.surface, flexShrink:0 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar termo..."
          style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', fontFamily:F.mono, fontSize:13, color:C.text, outline:'none' }} />
      </div>

      {/* Categorias */}
      <div style={{ display:'flex', gap:6, padding:'10px 16px', background:C.surface, borderBottom:`1px solid ${C.border}`, overflowX:'auto', flexShrink:0 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ background: cat===c ? C.accent : C.surface2, border:`1px solid ${cat===c ? C.accent : C.border}`, borderRadius:20, padding:'5px 12px', fontFamily:F.mono, color: cat===c ? '#fff' : C.textDim, fontSize:11, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px 40px', maxWidth:640, width:'100%', margin:'0 auto' }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginBottom:10 }}>{filtered.length} termos</div>
        {filtered.map(g => (
          <div key={g.term} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'13px 15px', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ fontFamily:F.display, color:C.text, fontSize:14, fontWeight:800 }}>{g.term}</div>
              <div style={{ fontFamily:F.mono, color:C.accent, fontSize:10, background:C.cyanDim, borderRadius:6, padding:'2px 7px' }}>{g.cat}</div>
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, lineHeight:1.6 }}>{g.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
