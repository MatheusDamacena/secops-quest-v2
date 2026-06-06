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

      // Verificar se o usuário tem dados no Firestore
      const data = await loadUser(user.uid);

      if (!data || !data?.profile?.name) {
        // Usuário autenticado mas sem dados no Firestore:
        // pode ser novo usuário (Google OAuth pela primeira vez) OU
        // usuário que teve os dados deletados.
        // Em ambos os casos: manter fbUser logado e ir para SetupScreen.
        // Limpar localStorage para não restaurar dados antigos.
        try { localStorage.removeItem(LS_KEY); } catch {}
        setFbUser(user);   // mantém logado — App vai mostrar SetupScreen
        setProfile(null);  // sem perfil = SetupScreen
        setLoadingAuth(false);
        return;
      }

      // Usuário existe com perfil completo — carregar normalmente
      setFbUser(user);
      setProfile(data.profile);

      // Sincronizar localStorage
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
