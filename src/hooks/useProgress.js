import { useState, useEffect, useRef } from 'react';
import { saveUser, saveLeaderboard, loadUser } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';
const INITIAL = { m0: false, m1: [], m2: false, m3: [], m4: [], m5: [], m6: [] };

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

    // Carregar localStorage imediatamente
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.progress) setProgress(d.progress);
        if (d.totalXp)  setTotalXp(d.totalXp);
        if (d.streak)   setStreak(d.streak);
      }
    } catch {}
    setLoaded(true);

    // Firestore em background
    loadUser(fbUser.uid).then(remote => {
      if (!remote?.progress) return;
      setProgress(remote.progress);
      setTotalXp(remote.totalXp || 0);
      setStreak(remote.streak   || 0);
      try { localStorage.setItem(LS_KEY, JSON.stringify(remote)); } catch {}
    }).catch(() => {});

  }, [fbUser?.uid]);

  useEffect(() => {
    if (!loaded || !profile?.name) return;
    const data = { profile, progress, totalXp, streak, lastPlayed: new Date().toDateString() };
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
