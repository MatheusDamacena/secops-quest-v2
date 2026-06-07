// ─── useAuth ──────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loadUser } from '../firebase/db';

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

      try {
        const data = await loadUser(user.uid);

        if (!data || !data?.profile?.name) {
          try { localStorage.removeItem(LS_KEY); } catch {}
          setFbUser(user);
          setProfile(null);
          setLoadingAuth(false);
          return;
        }

        setFbUser(user);
        setProfile(data.profile);
        try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
      } catch {
        // Erro de rede/Firestore — manter usuário logado sem perfil
        setFbUser(user);
        setProfile(null);
        setLoadingAuth(false);
      }
    });
    return unsub;
  }, []);

  return { fbUser, profile, setProfile, loadingAuth };
}
