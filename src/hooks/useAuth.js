// ─── useAuth ──────────────────────────────────────────────────────────────────
// Gerencia autenticação + carregamento do perfil do Firestore
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loadUser, saveLeaderboard } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';

export function useAuth() {
  const [fbUser,      setFbUser]      = useState(null);
  const [profile,     setProfile]     = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (!user) { setLoadingAuth(false); return; }

      // 1. Tentar Firestore
      let data = await loadUser(user.uid);

      // 2. Fallback localStorage
      if (!data) {
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) data = JSON.parse(raw);
        } catch {}
      }

      if (data?.profile?.name) {
        setProfile(data.profile);
        // Sincronizar leaderboard ao logar
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
