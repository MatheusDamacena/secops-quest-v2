// ─── useAuth ──────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loadUser, saveLeaderboard, deleteUserData } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';

function clearLocalSession() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

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

      // Verificar se o usuário existe no Firestore
      // NUNCA usar localStorage como fallback de identidade —
      // só o Firestore é a fonte de verdade
      const data = await loadUser(user.uid);

      if (!data || !data?.profile?.name) {
        // Usuário não existe no Firestore — foi deletado ou nunca completou o setup
        // Limpar localStorage para não restaurar dados de outro usuário
        clearLocalSession();

        // Tentar deletar da Auth também (caso tenha sido recriado pelo OAuth)
        try { await deleteUser(user); } catch {}

        // Deslogar
        await signOut(auth);

        setFbUser(null);
        setProfile(null);
        setLoadingAuth(false);
        return;
      }

      // Usuário existe e tem perfil — carregar normalmente
      setFbUser(user);
      setProfile(data.profile);

      // Sincronizar localStorage com dados do Firestore
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
      } catch {}

      saveLeaderboard(user.uid, {
        name:   data.profile.name,
        avatar: data.profile.avatar,
        dx:     data.totalXp || 0,
        streak: data.streak  || 0,
        userId: data.profile.userId,
      });

      setLoadingAuth(false);
    });
    return unsub;
  }, []);

  return { fbUser, profile, setProfile, loadingAuth };
}
