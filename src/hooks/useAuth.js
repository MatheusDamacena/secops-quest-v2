// ─── useAuth ──────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loadUser, saveLeaderboard } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';

export function useAuth() {
  const [fbUser,      setFbUser]      = useState(null);
  const [profile,     setProfile]     = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFbUser(null);
        setProfile(null);
        setLoadingAuth(false);
        return;
      }

      // 1. Verificar se o usuário existe no Firestore
      const data = await loadUser(user.uid);

      if (!data) {
        // Usuário foi deletado do Firestore — limpar tudo e deslogar
        // Também limpar localStorage para não restaurar sessão antiga
        try { localStorage.removeItem(LS_KEY); } catch {}

        // Se foi recriado pelo Google OAuth, deletar da Auth também
        try { await deleteUser(user); } catch {}

        // Deslogar do Firebase Auth
        await signOut(auth);

        setFbUser(null);
        setProfile(null);
        setLoadingAuth(false);
        return;
      }

      // 2. Usuário existe — carregar normalmente
      setFbUser(user);

      if (data?.profile?.name) {
        setProfile(data.profile);
        saveLeaderboard(user.uid, {
          name:   data.profile.name,
          avatar: data.profile.avatar,
          dx:     data.totalXp || 0,
          streak: data.streak  || 0,
          userId: data.profile.userId,
        });
      }

      setLoadingAuth(false);
    });
    return unsub;
  }, []);

  return { fbUser, profile, setProfile, loadingAuth };
}
