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

    // Calcula streak com base no lastPlayed
    const calcStreak = (data) => {
      if (!data) return 1;
      const today     = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const last      = data.lastPlayed;
      if (last === today)      return data.streak || 1;       // já jogou hoje
      if (last === yesterday)  return (data.streak || 0) + 1; // novo dia! incrementa
      return 1;                                                // quebrou — começa do 1
    };

    const loadData = async () => {
      try {
        // Tentar Firestore primeiro (sincronizado entre dispositivos)
        const remote = await loadUser(fbUser.uid);
        if (remote?.progress) {
          setProgress(remote.progress);
          setTotalXp(remote.totalXp  || 0);
          setStreak(calcStreak(remote));
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
          setStreak(calcStreak(saved));
        }
      } catch {}

      setLoaded(true);
    };

    loadData();
  }, [fbUser?.uid]);

  // Auto-save com debounce quando progresso muda
  useEffect(() => {
    if (!loaded || !profile?.name) return;

    // Calcular novo streak ao salvar (sem chamar setStreak aqui - evita loop)
    const today = new Date().toDateString();
    const savedData = (() => {
      try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; }
    })();
    const prevLastPlayed = savedData?.lastPlayed;
    const currentStreak = (() => {
      if (!prevLastPlayed)                                       return Math.max(streak, 1);
      if (prevLastPlayed === today)                              return streak;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (prevLastPlayed === yesterday)                          return streak; // onLoad já incrementou
      return streak;
    })();
    const data = { profile, progress, totalXp, streak: currentStreak, lastPlayed: today };

    // localStorage imediato (cache local)
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}

    // Firestore com debounce de 500ms
    if (fbUser) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveUser(fbUser.uid, data);
        const gm = (
          (progress?.m0 === true || progress?.m0 === 100) &&
          (progress?.m1||[]).length >= 7 &&
          (progress?.m2 === true || progress?.m2 === 100) &&
          (progress?.m3||[]).length >= 4 &&
          (progress?.m4||[]).length >= 15 &&
          (progress?.m5||[]).length >= 7 &&
          (progress?.m6||[]).length >= 8
        );
        saveLeaderboard(fbUser.uid, {
          name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
          dx: totalXp, streak, userId: profile.userId, grandmaster: gm,
        });
      }, 500);
    }

    // Cleanup: forçar save ao desmontar
    return () => {
      if (fbUser && saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveUser(fbUser.uid, data);
        const gm = (
          (progress?.m0 === true || progress?.m0 === 100) &&
          (progress?.m1||[]).length >= 7 &&
          (progress?.m2 === true || progress?.m2 === 100) &&
          (progress?.m3||[]).length >= 4 &&
          (progress?.m4||[]).length >= 15 &&
          (progress?.m5||[]).length >= 7 &&
          (progress?.m6||[]).length >= 8
        );
        saveLeaderboard(fbUser.uid, {
          name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
          dx: totalXp, streak, userId: profile.userId, grandmaster: gm,
        });
      }
    };
  }, [progress, totalXp, streak, loaded, profile, fbUser]);

  return { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded };
}
