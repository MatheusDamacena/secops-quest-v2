import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { LANGS } from '../data/i18n';
import { FaLock, FaKey, FaGoogle } from 'react-icons/fa';
import AppLogo from '../components/AppLogo';
import { C, F } from '../styles/tokens';

export default function AuthScreen({ lang = 'pt', setLang, t = k => k }) {
  const [mode,     setMode]     = useState('login'); // login | register | forgot
  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const errMsg = (code) => {
    const map = {
      'auth/user-not-found':          'Email não encontrado.',
      'auth/wrong-password':          'Senha incorreta.',
      'auth/email-already-in-use':    'Email já cadastrado.',
      'auth/weak-password':           'Senha muito fraca (mín. 6 caracteres).',
      'auth/invalid-email':           'Email inválido.',
      'auth/invalid-credential':      'Credenciais inválidas.',
      'auth/unauthorized-domain':     'Domínio não autorizado.',
      'auth/popup-blocked':           'Popup bloqueado. Permita popups e tente novamente.',
      'auth/popup-closed-by-user':    'Login cancelado.',
      'auth/cancelled-popup-request': 'Login cancelado.',
      'auth/network-request-failed':  'Erro de rede.',
      'auth/too-many-requests':       'Muitas tentativas. Aguarde e tente novamente.',
    };
    return map[code] || ('Erro: ' + (code || 'desconhecido'));
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    }
    catch (e) { setError(errMsg(e.code)); }
    setLoading(false);
  };

  // Valida email: formato + TLD >= 2 chars + sem domínio vazio
  const validateEmail = (em) => {
    const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(em)) return false;
    const domain = em.split('@')[1];
    const parts = domain.split('.');
    return parts.length >= 2 && parts.every(p => p.length > 0) && parts[parts.length-1].length >= 2;
  };

  const handleEmail = async () => {
    if (!email.trim() || !pass.trim()) { setError('Preencha email e senha.'); return; }
    if (!validateEmail(email.trim())) { setError('Email inválido. Use um formato como nome@empresa.com'); return; }
    setLoading(true); setError('');
    try {
      if (mode === 'login') await signInWithEmailAndPassword(auth, email.trim(), pass);
      else await createUserWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e) { setError(errMsg(e.code)); }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email.trim()) { setError('Digite seu email.'); return; }
    if (!validateEmail(email.trim())) { setError('Email inválido. Use um formato como nome@empresa.com'); return; }
    setLoading(true); setError('');
    try { await sendPasswordResetEmail(auth, email.trim()); setError('✅ Email enviado!'); }
    catch (e) { setError(errMsg(e.code)); }
    setLoading(false);
  };

  if (mode === 'forgot') return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px' }}>
      <AppLogo size={72} />
      <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900, marginBottom:8 }}>Recuperar senha</div>
      <div style={{ fontFamily:F.mono, color:C.muted, fontSize:13, marginBottom:32, textAlign:'center' }}>Digite seu email para receber o link de redefinição.</div>
      <div style={{ width:'100%', maxWidth:400 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.com" type="email"
          style={{ width:'100%', background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontFamily:F.mono, fontSize:14, color:C.text, outline:'none', marginBottom:12 }} />
        {error && <div style={{ background: error.startsWith('✅') ? C.correctBg : C.wrongBg, border:`1px solid ${error.startsWith('✅') ? C.correct : C.wrong}`, borderRadius:10, padding:'10px 14px', fontFamily:F.mono, color: error.startsWith('✅') ? C.correct : C.wrong, fontSize:12, marginBottom:12, textAlign:'center' }}>{error}</div>}
        <button onClick={handleForgot} disabled={loading} style={{ width:'100%', background:C.accent, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:14, fontFamily:F.display, fontWeight:900, fontSize:16, color:'#fff', cursor:'pointer', marginBottom:12 }}>
          {loading ? '...' : 'Enviar link'}
        </button>
        <div style={{ textAlign:'center' }}>
          <button onClick={() => { setMode('login'); setError(''); }} style={{ background:'none', border:'none', fontFamily:F.mono, color:'#888', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>← Voltar para o login</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 20px' }}>
      <AppLogo size={90} />
      {/* Seletor de idioma */}
      <div style={{ display:'flex', gap:6, marginBottom:4, marginTop:8 }}>
        {LANGS.map(l => (
          <button key={l.code} onClick={() => setLang?.(l.code)}
            style={{ background: lang === l.code ? 'rgba(0,196,204,0.12)' : 'transparent',
              border:`1px solid ${lang === l.code ? '#00c4cc' : 'rgba(255,255,255,0.1)'}`,
              borderRadius:8, padding:'4px 10px', cursor:'pointer', color: lang === l.code ? '#00c4cc' : '#6b7580',
              fontFamily:'monospace', fontSize:11 }}>
            {l.flag} {l.code.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ fontFamily:F.display, color:C.text, fontSize:26, fontWeight:900, marginBottom:4 }}>SecOps Quest</div>
      <div style={{ fontFamily:F.mono, color:C.muted, fontSize:12, letterSpacing:2, marginBottom:32 }}>GOOGLE SECOPS · YARA-L · UDM</div>
      <div style={{ width:'100%', maxWidth:400 }}>
        <button onClick={handleGoogle} disabled={loading} style={{ width:'100%', background:C.surface, border:`1.5px solid ${C.border}`, borderBottom:'4px solid rgba(0,0,0,.4)', borderRadius:14, padding:'13px 16px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.text, cursor:'pointer', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
<FaGoogle size={18} /> Entrar com Google
        </button>
        <div style={{ textAlign:'center', fontFamily:F.mono, color:C.muted, fontSize:12, marginBottom:16 }}>— ou —</div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.com" type="email"
          style={{ width:'100%', background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontFamily:F.mono, fontSize:14, color:C.text, outline:'none', marginBottom:10 }} />
        <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha (mín. 6 caracteres)" type="password"
          style={{ width:'100%', background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontFamily:F.mono, fontSize:14, color:C.text, outline:'none', marginBottom:12 }} />
        {error && <div style={{ background:C.wrongBg, border:`1px solid ${C.wrong}`, borderRadius:10, padding:'10px 14px', fontFamily:F.mono, color:C.wrong, fontSize:12, marginBottom:12, textAlign:'center' }}>{error}</div>}
        <button onClick={handleEmail} disabled={loading} style={{ width:'100%', background:C.accent, border:'none', borderBottom:'4px solid #008a91', borderRadius:14, padding:14, fontFamily:F.display, fontWeight:900, fontSize:16, color:'#fff', cursor:'pointer', marginBottom:12 }}>
          {loading ? '...' : mode === 'login' ? t('auth_enter') : t('auth_create')}
        </button>
        <div style={{ textAlign:'center', marginBottom:8 }}>
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ background:'none', border:'none', fontFamily:F.mono, color:C.accent, fontSize:12, cursor:'pointer' }}>
            {mode === 'login' ? t('auth_no_account') : 'Já tem conta? Fazer login'}
          </button>
        </div>
        {mode === 'login' && (
          <div style={{ textAlign:'center' }}>
            <button onClick={() => { setMode('forgot'); setError(''); }} style={{ background:'none', border:'none', fontFamily:F.mono, color:'#888', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>Esqueci minha senha</button>
          </div>
        )}
      </div>
    </div>
  );
}
