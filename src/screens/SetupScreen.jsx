// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { saveUser, saveLeaderboard } from '../firebase/db';
import { C, F } from '../styles/tokens';
import { AVATARS } from '../data/avatars';
import { FaShieldAlt, FaSkull, FaSearch } from 'react-icons/fa';

export default function SetupScreen({ fbUser, onDone, lang = 'pt', setLang, t = k => k }) {
  const CATEGORIES = [
    { label: t('setup_cat_def'), Icon: FaShieldAlt, color: '#00c4cc', ids: ['guardian','analyst','sentinel','protector','eagle','hawk'] },
    { label: t('setup_cat_atk'), Icon: FaSkull,     color: '#ff4d4d', ids: ['phantom','reaper','ninja','dragon','wolf','snake','raven','bughunter','invader'] },
    { label: t('setup_cat_ops'), Icon: FaSearch,    color: '#22d3a0', ids: ['terminal','watcher','spy','bot','chronicle','ghost','malware','identity','soclead'] },
  ];
  const [name,   setName]   = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [saving, setSaving] = useState(false);

  const handleStart = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const profile = {
      name: name.trim().slice(0, 30),
      avatarId: avatar.id,
      avatarColor: avatar.color,
      avatarLabel: avatar.label,
      userId: `u_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    };
    const data = {
      profile,
      progress: { m0:false,m1:[],m2:false,m3:[],m4:[],m5:[],m6:[] },
      totalXp: 0, streak: 1, lastPlayed: new Date().toDateString()
    };
    await saveUser(fbUser.uid, data);
    await saveLeaderboard(fbUser.uid, {
      name: profile.name, avatarId: profile.avatarId,
      avatarColor: profile.avatarColor, dx: 0, streak: 1, userId: profile.userId
    });
    try { localStorage.setItem('secops-quest-v2', JSON.stringify(data)); } catch {}
    onDone(profile);
    setSaving(false);
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', padding:'32px 20px 60px', overflowY:'auto' }}>
      {/* Avatar selecionado */}
      <div style={{ marginBottom:8 }}>
        <avatar.Icon size={72} color={avatar.color} />
      </div>
      <div style={{ fontFamily:F.display, color:avatar.color, fontSize:14, fontWeight:700, marginBottom:24, letterSpacing:1 }}>
        {avatar.label}
      </div>

      <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900, marginBottom:4 }}>Bem-vindo! 👋</div>
      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:13, marginBottom:28 }}>Crie seu perfil para salvar o progresso</div>

      <div style={{ width:'100%', maxWidth:480 }}>
        {/* Nome */}
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:8 }}>SEU NOME</div>
        <input value={name} onChange={e => setName(e.target.value.slice(0, 30))} placeholder="Ex: João Silva" maxLength={30}
          style={{ width:'100%', background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontFamily:F.mono, fontSize:15, color:C.text, outline:'none', marginBottom:28 }} />

        {/* Avatares por categoria */}
        {CATEGORIES.map(cat => (
          <div key={cat.label} style={{ marginBottom:20 }}>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              {cat.Icon && <cat.Icon size={12} color={cat.color} />} {cat.label}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {AVATARS.filter(a => cat.ids.includes(a.id)).map(av => {
                const isSelected = avatar.id === av.id;
                return (
                  <button key={av.id} onClick={() => setAvatar(av)}
                    title={av.label}
                    style={{
                      width:54, height:54, borderRadius:14,
                      background: isSelected ? av.color+'22' : C.surface,
                      border: `2px solid ${isSelected ? av.color : C.border}`,
                      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .12s',
                    }}>
                    <av.Icon size={26} color={isSelected ? av.color : C.textDim} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Botão */}
        <button onClick={handleStart} disabled={!name.trim() || saving}
          style={{ width:'100%', marginTop:8,
            background: name.trim() ? C.accent : C.surface2,
            border:'none', borderBottom:`4px solid ${name.trim() ? C.btn3d_pink : C.cardDepth}`,
            borderRadius:14, padding:14, fontFamily:F.display, fontWeight:900, fontSize:16,
            color: name.trim() ? '#fff' : C.textDim,
            cursor: name.trim() ? 'pointer' : 'not-allowed' }}>
          {saving ? '...' : t('setup_btn')}
        </button>
      </div>
    </div>
  );
}
