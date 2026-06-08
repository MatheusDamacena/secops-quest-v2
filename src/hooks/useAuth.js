import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loadUser } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';

export function useAuth() {
  const [fbUser,      setFbUser]      = useState(null);
  const [profile,     setProfile]     = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Timeout de segurança — nunca travar mais de 8 segundos
    const safetyTimeout = setTimeout(() => {
      setLoadingAuth(false);
    }, 8000);

    const unsub = onAuthStateChanged(auth, async (user) => {
      clearTimeout(safetyTimeout);

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
        setFbUser(user);
        setProfile(null);
      }

      setLoadingAuth(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsub();
    };
  }, []);

  return { fbUser, profile, setProfile, loadingAuth };
}
