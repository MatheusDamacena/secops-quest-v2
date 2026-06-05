import { useState } from 'react';
import { saveUser, saveLeaderboard } from '../firebase/db';
import { C, F } from '../styles/tokens';

const AVATARS = ['🦊','🐴','🐼','🦁','🦏','🐻','💀','🦄','🐉','🦸','🦋','👾','🤖','🕷','🎮','🛡','⚔','🔒','☠','🧙','🥷','🕵','👨‍💻','👩‍💻'];

export default function SetupScreen({ fbUser, onDone }) {
  const [name,   setName]   = useState('');
  const [avatar, setAvatar] = useState('🛡');
  const [saving, setSaving] = useState(false);

  const handleStart = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const profile = {
      name: name.trim(), avatar,
      userId: `u_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    };
    const data = { profile, progress: { m0:false,m1:[],m2:false,m3:[],m4:[],m5:[],m6:[] }, totalXp:0, streak:1, lastPlayed: new Date().toDateString() };
    await saveUser(fbUser.uid, data);
    await saveLeaderboard(fbUser.uid, { name:profile.name, avatar:profile.avatar, dx:0, streak:1, userId:profile.userId });
    try { localStorage.setItem('secops-quest-v2', JSON.stringify(data)); } catch {}
    onDone(profile);
    setSaving(false);
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px' }}>
      <div style={{ fontSize:56, marginBottom:8 }}>🔒</div>
      <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900, marginBottom:4 }}>Bem-vindo! 👋</div>
      <div style={{ fontFamily:F.mono, color:C.muted, fontSize:13, marginBottom:32 }}>Crie seu perfil para salvar o progresso</div>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:8 }}>SEU NOME</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João Silva"
          style={{ width:'100%', background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontFamily:F.mono, fontSize:15, color:C.text, outline:'none', marginBottom:24 }} />
        <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, letterSpacing:2, marginBottom:12 }}>SEU AVATAR</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:32, justifyContent:'center' }}>
          {AVATARS.map(a => (
            <button key={a} onClick={() => setAvatar(a)}
              style={{ width:52, height:52, fontSize:26, background: avatar===a ? C.cyanDim : C.surface, border:`2px solid ${avatar===a ? C.accent : C.border}`, borderRadius:14, cursor:'pointer', transition:'all .12s' }}>
              {a}
            </button>
          ))}
        </div>
        <button onClick={handleStart} disabled={!name.trim() || saving}
          style={{ width:'100%', background: name.trim() ? C.accent : C.surface2, border:'none', borderBottom:`4px solid ${name.trim() ? '#008a91' : C.cardDepth}`, borderRadius:14, padding:14, fontFamily:F.display, fontWeight:900, fontSize:16, color: name.trim() ? '#fff' : C.textDim, cursor: name.trim() ? 'pointer' : 'not-allowed' }}>
          {saving ? 'Salvando...' : '▶ ENTRAR NO JOGO'}
        </button>
      </div>
    </div>
  );
}
