// ─── useProgress ──────────────────────────────────────────────────────────────
// Gerencia progresso, XP e streak com persistência automática
import { useState, useEffect, useRef } from 'react';
import { saveUser, saveLeaderboard } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';

const INITIAL_PROGRESS = {
  m0: false, m1: [], m2: false, m3: [], m4: [], m5: [], m6: [],
};

export function useProgress({ fbUser, profile }) {
  const [progress,  setProgress]  = useState(INITIAL_PROGRESS);
  const [totalXp,   setTotalXp]   = useState(0);
  const [streak,    setStreak]    = useState(0);
  const [loaded,    setLoaded]    = useState(false);
  const saveTimer = useRef(null);

  // Carregar do localStorage na montagem
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.progress) setProgress(saved.progress);
        if (saved.totalXp)  setTotalXp(saved.totalXp);
        if (saved.streak)   setStreak(saved.streak);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Auto-save com debounce quando progresso muda
  useEffect(() => {
    if (!loaded || !profile?.name) return;

    const data = { profile, progress, totalXp, streak, lastPlayed: new Date().toDateString() };

    // localStorage imediato
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}

    // Firestore com debounce de 2s
    if (fbUser) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveUser(fbUser.uid, data);
        saveLeaderboard(fbUser.uid, {
          name: profile.name, avatar: profile.avatar,
          dx: totalXp, streak, userId: profile.userId,
        });
      }, 2000);
    }
  }, [progress, totalXp, streak, loaded, profile, fbUser]);

  return { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded };
}
