// ─── useProgress ──────────────────────────────────────────────────────────────
// Gerencia progresso, XP e streak com persistência automática
// Fonte de verdade: Firestore. localStorage usado como cache local.
import { useState, useEffect, useRef } from 'react';
import { saveUser, saveLeaderboard, loadUser } from '../firebase/db';

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

  // Carregar dados — Firestore tem prioridade, localStorage é fallback
  useEffect(() => {
    if (!fbUser) return;

    const loadData = async () => {
      try {
        // Tentar Firestore primeiro (sincronizado entre dispositivos)
        const remote = await loadUser(fbUser.uid);
        if (remote?.progress) {
          setProgress(remote.progress);
          setTotalXp(remote.totalXp  || 0);
          setStreak(remote.streak    || 0);
          // Atualizar localStorage com dados do servidor
          try { localStorage.setItem(LS_KEY, JSON.stringify(remote)); } catch {}
          setLoaded(true);
          return;
        }
      } catch {}

      // Fallback: localStorage se Firestore falhou ou está vazio
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
    };

    loadData();
  }, [fbUser?.uid]);

  // Auto-save com debounce quando progresso muda
  useEffect(() => {
    if (!loaded || !profile?.name) return;

    const data = { profile, progress, totalXp, streak, lastPlayed: new Date().toDateString() };

    // localStorage imediato (cache local)
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}

    // Firestore com debounce de 500ms
    if (fbUser) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveUser(fbUser.uid, data);
        saveLeaderboard(fbUser.uid, {
          name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
          dx: totalXp, streak, userId: profile.userId,
        });
      }, 500);
    }

    // Cleanup: forçar save ao desmontar
    return () => {
      if (fbUser && saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveUser(fbUser.uid, data);
        saveLeaderboard(fbUser.uid, {
          name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
          dx: totalXp, streak, userId: profile.userId,
        });
      }
    };
  }, [progress, totalXp, streak, loaded, profile, fbUser]);

  return { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded };
}
