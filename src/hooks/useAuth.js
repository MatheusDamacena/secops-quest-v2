// ─── useAuth ──────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

      // Verificar se o usuário existe no Firestore
      // Firestore é a única fonte de verdade — sem fallback de localStorage
      const data = await loadUser(user.uid);

      if (!data || !data?.profile?.name) {
        // Usuário não existe no Firestore — foi deletado ou nunca fez setup
        // Limpar localStorage e deslogar (sem tentar deleteUser — causa erro de auth)
        try { localStorage.removeItem(LS_KEY); } catch {}
        await signOut(auth);
        setFbUser(null);
        setProfile(null);
        setLoadingAuth(false);
        return;
      }

      // Usuário existe — carregar normalmente
      setFbUser(user);
      setProfile(data.profile);

      // Sincronizar localStorage com Firestore
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}

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
