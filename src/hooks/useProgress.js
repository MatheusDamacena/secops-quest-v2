// ─── useProgress ──────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { saveUser, saveLeaderboard, loadUser } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';

const INITIAL = { m0: false, m1: [], m2: false, m3: [], m4: [], m5: [], m6: [] };

const calcStreak = (data) => {
  if (!data?.lastPlayed) return 1;
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (data.lastPlayed === today)      return data.streak || 1;
  if (data.lastPlayed === yesterday)  return (data.streak || 0) + 1;
  return 1;
};

const isGrandmaster = (p) =>
  (p?.m0 === true || p?.m0 === 100) &&
  (p?.m1||[]).length >= 7 &&
  (p?.m2 === true || p?.m2 === 100) &&
  (p?.m3||[]).length >= 4 &&
  (p?.m4||[]).length >= 15 &&
  (p?.m5||[]).length >= 7 &&
  (p?.m6||[]).length >= 8;

export function useProgress({ fbUser, profile }) {
  const [progress, setProgress] = useState(INITIAL);
  const [totalXp,  setTotalXp]  = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [loaded,   setLoaded]   = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!fbUser) return;

    // 1. Carregar localStorage IMEDIATAMENTE como ponto de partida
    let lsData = null;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) lsData = JSON.parse(raw);
    } catch {}

    if (lsData?.progress) {
      setProgress(lsData.progress);
      setTotalXp(lsData.totalXp || 0);
      setStreak(calcStreak(lsData));
      setLoaded(true); // Já carregado do localStorage — não trava mais
    }

    // 2. Tentar Firestore em paralelo (sobrescreve se tiver dados mais recentes)
    loadUser(fbUser.uid).then(remote => {
      if (!remote?.progress) return;
      // Usar dados mais recentes: comparar totalXp
      const remoteBetter = (remote.totalXp || 0) >= (lsData?.totalXp || 0);
      if (remoteBetter) {
        setProgress(remote.progress);
        setTotalXp(remote.totalXp || 0);
        setStreak(calcStreak(remote));
        try { localStorage.setItem(LS_KEY, JSON.stringify(remote)); } catch {}
      }
      setLoaded(true);
    }).catch(() => {
      setLoaded(true); // Firestore falhou — localStorage já foi aplicado
    });

    // 3. Timeout de segurança — nunca travar na tela de loading
    const timeout = setTimeout(() => setLoaded(true), 5000);
    return () => clearTimeout(timeout);
  }, [fbUser?.uid]);

  // Auto-save
  useEffect(() => {
    if (!loaded || !profile?.name) return;
    const today = new Date().toDateString();
    const data  = { profile, progress, totalXp, streak, lastPlayed: today };
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
    if (!fbUser) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveUser(fbUser.uid, data);
      saveLeaderboard(fbUser.uid, {
        name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
        dx: totalXp, streak, userId: profile.userId, grandmaster: isGrandmaster(progress),
      });
    }, 500);
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveUser(fbUser.uid, data);
        saveLeaderboard(fbUser.uid, {
          name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
          dx: totalXp, streak, userId: profile.userId, grandmaster: isGrandmaster(progress),
        });
      }
    };
  }, [progress, totalXp, streak, loaded, profile, fbUser]);

  return { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded };
}
