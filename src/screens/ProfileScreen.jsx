// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
import { useState } from 'react';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import { saveUser, deleteUserData } from '../firebase/db';
import { FaBolt, FaFire, FaSignOutAlt, FaTrash, FaLandmark, FaGamepad,
         FaPencilAlt, FaCheck, FaTimes, FaLock, FaEye, FaEyeSlash, FaUserTimes } from 'react-icons/fa';
import { C, F } from '../styles/tokens';
import Avatar from '../components/Avatar';
import modules from '../data/modules.json';

export default function ProfileScreen({ profile, setProfile, totalXp, streak, progress, onBack, fbUser }) {

  const [modal,        setModal]        = useState(null); // 'logout' | 'reset' | 'delete' | 'password'
  const [editingName,  setEditingName]  = useState(false);
  const [newName,      setNewName]      = useState(profile?.name || '');
  const [nameSaving,   setNameSaving]   = useState(false);
  const [nameError,    setNameError]    = useState('');

  // Troca de senha
  const [oldPass,      setOldPass]      = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [showOld,      setShowOld]      = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [passError,    setPassError]    = useState('');
  const [passOk,       setPassOk]       = useState(false);
  const [passSaving,   setPassSaving]   = useState(false);

  // Exclusão de conta — confirmação com email digitado
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const isGoogleUser = fbUser?.providerData?.some(p => p.providerId === 'google.com');

  const getModuleProgress = (id) => {
    const p = progress || {};
    switch(id) {
      case 0: return Math.round(((p.m1||[]).length / 7) * 100);
      case 1: return (p.m0 === true || p.m0 === 100) ? 100 : 0;
      case 2: return p.m2 ? 100 : 0;
      case 3: return Math.round(((p.m3||[]).length / 4) * 100);
      case 4: return Math.round(((p.m4||[]).length / 15) * 100);
      case 5: return Math.round(((p.m5||[]).length / 7) * 100);
      case 6: return Math.round(((p.m6||[]).length / 8) * 100);
      default: return 0;
    }
  };

  const doneMods     = modules.filter(m => getModuleProgress(m.id) === 100).length;
  const missionsDone = (progress?.m4 || []).length;

  // ── Salvar nome ──────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    const name = newName.trim().slice(0, 30);
    if (!name) { setNameError('Nome não pode ser vazio.'); return; }
    setNameSaving(true); setNameError('');
    const updated = { ...profile, name };
    try {
      await saveUser(fbUser.uid, { profile: updated, progress, totalXp, streak });
      setProfile(updated);
      setEditingName(false);
    } catch { setNameError('Erro ao salvar. Tente novamente.'); }
    setNameSaving(false);
  };

  // ── Trocar senha ─────────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPassError(''); setPassOk(false);
    if (newPass.length < 6)        { setPassError('Nova senha deve ter mín. 6 caracteres.'); return; }
    if (newPass !== confirmPass)   { setPassError('As senhas não coincidem.'); return; }
    setPassSaving(true);
    try {
      const credential = EmailAuthProvider.credential(fbUser.email, oldPass);
      await reauthenticateWithCredential(fbUser, credential);
      await updatePassword(fbUser, newPass);
      setPassOk(true);
      setOldPass(''); setNewPass(''); setConfirmPass('');
      setTimeout(() => setModal(null), 2000);
    } catch (e) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential')
        setPassError('Senha atual incorreta.');
      else
        setPassError('Erro ao alterar senha. Tente novamente.');
    }
    setPassSaving(false);
  };

  // ── Resetar progresso ────────────────────────────────────────────────────────
  const handleReset = () => {
    localStorage.removeItem('secops-quest-v2');
    deleteUserData(auth.currentUser?.uid).then(() => signOut(auth));
  };

  // ── Excluir conta ────────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    try {
      await deleteUserData(fbUser.uid);
      localStorage.removeItem('secops-quest-v2');
      await deleteUser(fbUser);
    } catch (e) {
      // Se precisar de reautenticação, fazer signOut e deixar o usuário logar de novo
      if (e.code === 'auth/requires-recent-login') {
        await deleteUserData(fbUser.uid);
        localStorage.removeItem('secops-quest-v2');
        await signOut(auth);
      }
    }
  };

  // ── UI helpers ───────────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', background: C.surface2, border: `1.5px solid ${C.border}`,
    borderRadius: 10, padding: '11px 14px', fontFamily: F.mono, fontSize: 14,
    color: C.text, outline: 'none', boxSizing: 'border-box',
  };

  const btnPrimary = (color = C.accent) => ({
    flex: 1, background: color, border: 'none',
    borderBottom: '4px solid rgba(0,0,0,.4)', borderRadius: 14,
    padding: '13px', fontFamily: F.display, fontWeight: 900,
    fontSize: 15, color: '#fff', cursor: 'pointer',
  });

  const btnSecondary = {
    flex: 1, background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: '13px', fontFamily: F.display,
    fontWeight: 800, fontSize: 15, color: C.textDim, cursor: 'pointer',
  };

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'12px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C.textDim, fontSize:24, cursor:'pointer', padding:'4px 8px', marginLeft:-8 }}>‹</button>
        <span style={{ fontFamily:F.display, color:C.text, fontSize:17, fontWeight:800 }}>Perfil</span>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'24px max(20px, calc((100% - 568px) / 2)) 80px' }}>

        {/* Avatar card */}
        <div style={{ background:C.surface, border:`2px solid ${C.border}`, borderBottom:`5px solid ${C.border}`, borderRadius:20, padding:'28px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:16, backgroundImage:'repeating-linear-gradient(-45deg,rgba(255,255,255,.02) 0px,rgba(255,255,255,.02) 1px,transparent 1px,transparent 10px)' }}>
          <Avatar profile={profile} size={64} />

          {/* Nome editável */}
          {editingName ? (
            <div style={{ width:'100%', maxWidth:280 }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value.slice(0, 30))}
                maxLength={30}
                autoFocus
                style={{ ...inputStyle, textAlign:'center', fontSize:18, fontFamily:F.display, fontWeight:800 }}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
              />
              {nameError && <div style={{ fontFamily:F.mono, color:C.red, fontSize:11, marginTop:6, textAlign:'center' }}>{nameError}</div>}
              <div style={{ display:'flex', gap:8, marginTop:10 }}>
                <button onClick={() => { setEditingName(false); setNameError(''); }} style={{ ...btnSecondary, padding:'9px' }}>
                  <FaTimes size={14} />
                </button>
                <button onClick={handleSaveName} disabled={nameSaving} style={{ ...btnPrimary(), padding:'9px' }}>
                  {nameSaving ? '...' : <FaCheck size={14} />}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ fontFamily:F.display, color:C.text, fontSize:22, fontWeight:900 }}>{profile?.name || 'Analista'}</div>
              <button onClick={() => { setNewName(profile?.name || ''); setEditingName(true); }}
                style={{ background:'none', border:'none', color:C.textDim, cursor:'pointer', padding:4 }}>
                <FaPencilAlt size={13} />
              </button>
            </div>
          )}

          <div style={{ fontFamily:F.mono, color:C.accent, fontSize:10, letterSpacing:3 }}>GOOGLE SECOPS ANALYST</div>
          {fbUser?.email && (
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11 }}>{fbUser.email}</div>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          {[
            { label:'DX TOTAL',  value:totalXp,          Icon:FaBolt,     color:C.purple },
            { label:'SEQUÊNCIA', value:`${streak} dias`,  Icon:FaFire,     color:C.amber  },
            { label:'MÓDULOS',   value:`${doneMods}/7`,   Icon:FaLandmark, color:C.cyan   },
            { label:'MISSÕES',   value:missionsDone,      Icon:FaGamepad,  color:C.green  },
          ].map(s => (
            <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:'16px', textAlign:'center' }}>
              <s.Icon size={28} color={s.color} />
              <div style={{ fontFamily:F.display, color:s.color, fontSize:24, fontWeight:900, marginTop:4 }}>{s.value}</div>
              <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:10, letterSpacing:1, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

          {/* Trocar senha — só para email/senha */}
          {!isGoogleUser && (
            <button onClick={() => { setModal('password'); setPassError(''); setPassOk(false); }}
              style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:14, padding:'14px 20px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.textMid, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
              <FaLock size={15} /> Alterar senha
            </button>
          )}

          <button onClick={() => setModal('logout')}
            style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:14, padding:'14px 20px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.textMid, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <FaSignOutAlt size={16} /> Sair do jogo
          </button>

          <button onClick={() => setModal('reset')}
            style={{ background:'none', border:`1.5px solid rgba(255,165,0,.3)`, borderRadius:14, padding:'14px 20px', fontFamily:F.display, fontWeight:800, fontSize:15, color:'#ffa500', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <FaTrash size={15} /> Resetar progresso
          </button>

          <button onClick={() => { setModal('delete'); setDeleteConfirm(''); }}
            style={{ background:'none', border:`1.5px solid rgba(255,77,77,.3)`, borderRadius:14, padding:'14px 20px', fontFamily:F.display, fontWeight:800, fontSize:15, color:C.red, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <FaUserTimes size={16} /> Excluir minha conta
          </button>
        </div>
      </div>

      {/* ── Modal Sair ── */}
      {modal === 'logout' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'20px 20px 0 0', padding:'28px 20px 44px', width:'100%', maxWidth:600 }}>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, textAlign:'center', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <FaSignOutAlt /> Sair do jogo?
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, textAlign:'center', lineHeight:1.8, marginBottom:24 }}>
              Seu progresso e DX continuam salvos.<br/>Você pode entrar de volta a qualquer momento.
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
              <button onClick={() => signOut(auth)} style={btnPrimary()}>Sair</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Resetar progresso ── */}
      {modal === 'reset' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'20px 20px 0 0', padding:'28px 20px 44px', width:'100%', maxWidth:600 }}>
            <div style={{ fontFamily:F.display, color:'#ffa500', fontSize:20, fontWeight:900, textAlign:'center', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <FaTrash /> Resetar progresso?
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, textAlign:'center', lineHeight:1.8, marginBottom:24 }}>
              Todo progresso, DX e missões serão apagados.<br/>Seu login permanece — você poderá jogar do zero.<br/><br/>
              <span style={{ color:C.red }}>Esta ação não pode ser desfeita.</span>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
              <button onClick={handleReset} style={btnPrimary('#ffa500')}>Resetar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Excluir conta ── */}
      {modal === 'delete' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'20px 20px 0 0', padding:'28px 20px 44px', width:'100%', maxWidth:600 }}>
            <div style={{ fontFamily:F.display, color:C.red, fontSize:20, fontWeight:900, textAlign:'center', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <FaUserTimes /> Excluir conta permanentemente?
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, textAlign:'center', lineHeight:1.8, marginBottom:20 }}>
              Todos os seus dados, progresso e DX serão<br/>apagados permanentemente do servidor.<br/><br/>
              <span style={{ color:C.red }}>Esta ação é irreversível.</span>
            </div>
            <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginBottom:6 }}>
              Digite seu email para confirmar:
            </div>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={fbUser?.email || 'seu@email.com'}
              style={{ ...inputStyle, marginBottom:16 }}
            />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm.trim().toLowerCase() !== (fbUser?.email || '').toLowerCase()}
                style={{
                  ...btnPrimary(C.red),
                  opacity: deleteConfirm.trim().toLowerCase() !== (fbUser?.email || '').toLowerCase() ? 0.4 : 1,
                  cursor: deleteConfirm.trim().toLowerCase() !== (fbUser?.email || '').toLowerCase() ? 'not-allowed' : 'pointer',
                }}>
                Excluir conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Alterar senha ── */}
      {modal === 'password' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'20px 20px 0 0', padding:'28px 20px 44px', width:'100%', maxWidth:600 }}>
            <div style={{ fontFamily:F.display, color:C.text, fontSize:20, fontWeight:900, textAlign:'center', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <FaLock /> Alterar senha
            </div>

            {passOk ? (
              <div style={{ fontFamily:F.display, color:C.green, fontSize:16, textAlign:'center', padding:'20px 0' }}>
                ✓ Senha alterada com sucesso!
              </div>
            ) : (
              <>
                {/* Senha atual */}
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginBottom:6 }}>SENHA ATUAL</div>
                <div style={{ position:'relative', marginBottom:14 }}>
                  <input type={showOld ? 'text' : 'password'} value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight:40 }} />
                  <button onClick={() => setShowOld(v => !v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:C.textDim, cursor:'pointer' }}>
                    {showOld ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>

                {/* Nova senha */}
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginBottom:6 }}>NOVA SENHA</div>
                <div style={{ position:'relative', marginBottom:14 }}>
                  <input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="mín. 6 caracteres" style={{ ...inputStyle, paddingRight:40 }} />
                  <button onClick={() => setShowNew(v => !v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:C.textDim, cursor:'pointer' }}>
                    {showNew ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>

                {/* Confirmar senha */}
                <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:11, marginBottom:6 }}>CONFIRMAR NOVA SENHA</div>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="repita a nova senha" style={{ ...inputStyle, marginBottom:16 }}
                  onKeyDown={e => e.key === 'Enter' && handleChangePassword()} />

                {/* Indicador de força */}
                {newPass.length > 0 && (
                  <div style={{ display:'flex', gap:4, marginBottom:12 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex:1, height:3, borderRadius:2, background:
                        newPass.length >= i * 3 ? (i <= 2 ? '#ffa500' : i === 3 ? C.cyan : C.green) : C.border }} />
                    ))}
                    <div style={{ fontFamily:F.mono, fontSize:10, color:C.textDim, marginLeft:6, alignSelf:'center' }}>
                      {newPass.length < 6 ? 'Fraca' : newPass.length < 9 ? 'Média' : newPass.length < 12 ? 'Boa' : 'Forte'}
                    </div>
                  </div>
                )}

                {passError && <div style={{ fontFamily:F.mono, color:C.red, fontSize:11, marginBottom:12 }}>{passError}</div>}

                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => setModal(null)} style={btnSecondary}>Cancelar</button>
                  <button onClick={handleChangePassword} disabled={passSaving || !oldPass || !newPass || !confirmPass}
                    style={{ ...btnPrimary(), opacity: (!oldPass || !newPass || !confirmPass) ? 0.5 : 1 }}>
                    {passSaving ? 'Salvando...' : 'Alterar senha'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
