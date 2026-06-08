// ─── useProgress ──────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { saveUser, saveLeaderboard, loadUser } from '../firebase/db';

const LS_KEY = 'secops-quest-v2';
const INITIAL = { m0: false, m1: [], m2: false, m3: [], m4: [], m5: [], m6: [] };

// Soma "quanto progresso" um objeto tem — usado para nunca sobrescrever
// dados ricos com dados vazios (proteção anti-zeragem).
const progressWeight = (p, xp = 0) => {
  if (!p) return 0;
  const arr = (a) => (Array.isArray(a) ? a.length : 0);
  const bool = (b) => (b === true || b === 100 ? 1 : 0);
  return (
    bool(p.m0) + arr(p.m1) + bool(p.m2) + arr(p.m3) +
    arr(p.m4) + arr(p.m5) + arr(p.m6) + (xp > 0 ? 1 : 0)
  );
};

const isGrandmaster = (p) =>
  (p?.m0 === true || p?.m0 === 100) &&
  (p?.m1 || []).length >= 7 &&
  (p?.m2 === true || p?.m2 === 100) &&
  (p?.m3 || []).length >= 4 &&
  (p?.m4||[]).length >= 16 &&
  (p?.m5 || []).length >= 7 &&
  (p?.m6 || []).length >= 8;

export function useProgress({ fbUser, profile }) {
  const [progress, setProgress] = useState(INITIAL);
  const [totalXp,  setTotalXp]  = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [loaded,   setLoaded]   = useState(false);

  const saveTimer = useRef(null);
  // hydrated = o estado já reflete dados carregados de uma fonte (LS/Firestore).
  // Enquanto false, NUNCA salvamos — evita gravar INITIAL por cima de dados reais.
  const hydrated = useRef(false);
  // Maior "peso" de progresso já visto — bloqueia regressões para estado mais pobre.
  const maxWeight = useRef(0);

  // ── LOAD ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Sem usuário: libera a tela mas mantém hydrated=false (não há o que salvar).
    if (!fbUser) {
      setLoaded(true);
      return;
    }

    let lsData = null;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) lsData = JSON.parse(raw);
    } catch {}

    // Aplica localStorage imediatamente (se tiver progresso)
    if (lsData?.progress) {
      setProgress(lsData.progress);
      setTotalXp(lsData.totalXp || 0);
      setStreak(lsData.streak || 0);
      maxWeight.current = progressWeight(lsData.progress, lsData.totalXp || 0);
      hydrated.current = true; // agora o estado reflete dados reais
    }
    setLoaded(true);

    // Firestore em paralelo — só sobrescreve se trouxer MAIS progresso
    loadUser(fbUser.uid)
      .then((remote) => {
        if (!remote?.progress) return;
        const remoteWeight = progressWeight(remote.progress, remote.totalXp || 0);
        if (remoteWeight >= maxWeight.current) {
          setProgress(remote.progress);
          setTotalXp(remote.totalXp || 0);
          setStreak(remote.streak || 0);
          maxWeight.current = remoteWeight;
          hydrated.current = true;
          try { localStorage.setItem(LS_KEY, JSON.stringify(remote)); } catch {}
        }
      })
      .catch(() => {});
  }, [fbUser?.uid]);

  // ── SAVE ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded || !profile?.name || !fbUser) return;

    const currentWeight = progressWeight(progress, totalXp);

    // PROTEÇÃO 1: nunca salvar antes de hidratar a partir de uma fonte real.
    // PROTEÇÃO 2: só permitir salvar estado vazio se ele NUNCA teve progresso
    //             (usuário genuinamente novo). Se já houve progresso (maxWeight>0)
    //             e agora está mais pobre, é uma regressão acidental — bloqueia.
    if (!hydrated.current && currentWeight === 0) return;
    if (currentWeight < maxWeight.current) return;

    maxWeight.current = Math.max(maxWeight.current, currentWeight);
    hydrated.current = true;

    const data = { profile, progress, totalXp, streak, lastPlayed: new Date().toDateString() };
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}

    const persist = () => {
      saveUser(fbUser.uid, data);
      saveLeaderboard(fbUser.uid, {
        name: profile.name, avatarId: profile.avatarId, avatarColor: profile.avatarColor,
        dx: totalXp, streak, userId: profile.userId, grandmaster: isGrandmaster(progress),
      });
    };

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, 500);
    return () => {
      if (saveTimer.current) { clearTimeout(saveTimer.current); persist(); }
    };
  }, [progress, totalXp, streak, loaded, profile, fbUser]);

  return { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded };
}
