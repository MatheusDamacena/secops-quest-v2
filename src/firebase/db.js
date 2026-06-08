import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './config';

// ── Peso de progresso ─────────────────────────────────────────────────────────
// Mede "quanto progresso" um objeto tem. Usado para nunca sobrescrever um
// documento rico no Firestore com um estado mais pobre (proteção anti-zeragem).
// DEVE permanecer consistente com a mesma função em hooks/useProgress.js
function progressWeight(progress, totalXp = 0) {
  if (!progress) return 0;
  const arr  = (a) => (Array.isArray(a) ? a.length : 0);
  const bool = (b) => (b === true || b === 100 ? 1 : 0);
  return (
    bool(progress.m0) + arr(progress.m1) + bool(progress.m2) + arr(progress.m3) +
    arr(progress.m4) + arr(progress.m5) + arr(progress.m6) + (totalXp > 0 ? 1 : 0)
  );
}

export async function saveUser(uid, data) {
  try {
    // GUARDA ANTI-REGRESSÃO: ler o documento remoto antes de gravar.
    // Se o remoto tiver MAIS progresso que os dados que estão chegando,
    // recusar a escrita — protege contra o caso "dispositivo novo +
    // Firestore intermitente" onde o app começaria do zero e gravaria
    // por cima de um progresso real já existente no servidor.
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const remote = snap.data();
        const remoteWeight  = progressWeight(remote?.progress, remote?.totalXp || 0);
        const incomingWeight = progressWeight(data?.progress,   data?.totalXp   || 0);
        if (remoteWeight > incomingWeight) {
          console.warn(
            `[db] saveUser BLOQUEADO: remoto (peso ${remoteWeight}) > novo (peso ${incomingWeight}). ` +
            `Escrita recusada para evitar perda de progresso.`
          );
          return { blocked: true, remoteWeight, incomingWeight };
        }
      }
    } catch (e) {
      // Se a leitura de guarda falhar (rede/permissão), seguir com a gravação
      // normal — não queremos travar o save legítimo por causa de uma leitura.
      console.warn('[db] saveUser guard read failed (prosseguindo):', e.message);
    }

    await setDoc(doc(db, 'users', uid), data, { merge: true });
    return { blocked: false };
  } catch (e) {
    console.warn('[db] saveUser failed:', e.message);
    return { blocked: false, error: e.message };
  }
}

export async function loadUser(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.warn('[db] loadUser failed:', e.message); return null; }
}

export async function saveLeaderboard(uid, entry) {
  try {
    // GUARDA ANTI-REGRESSÃO no leaderboard: não rebaixar o DX gravado.
    // Se o DX remoto for maior que o que está chegando, recusar — evita
    // que um estado zerado derrube a pontuação real no ranking.
    try {
      const snap = await getDoc(doc(db, 'leaderboard', uid));
      if (snap.exists()) {
        const remoteDx   = snap.data()?.dx || 0;
        const incomingDx = entry?.dx || 0;
        if (remoteDx > incomingDx) {
          console.warn(`[db] saveLeaderboard BLOQUEADO: dx remoto ${remoteDx} > novo ${incomingDx}.`);
          return { blocked: true };
        }
      }
    } catch (e) {
      console.warn('[db] saveLeaderboard guard read failed (prosseguindo):', e.message);
    }

    // Filtrar campos undefined para evitar erro no Firestore
    const clean = Object.fromEntries(
      Object.entries({ ...entry, updatedAt: Date.now() })
        .filter(([_, v]) => v !== undefined && v !== null)
    );
    await setDoc(doc(db, 'leaderboard', uid), clean, { merge: true });
    return { blocked: false };
  }
  catch (e) { console.warn('[db] saveLeaderboard failed:', e.message); return { blocked: false, error: e.message }; }
}

export async function getLeaderboard() {
  try {
    const snap = await getDocs(collection(db, 'leaderboard'));
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Validar cada entrada: verificar se users/{uid} existe no Firestore
    // Se não existir, o usuário foi deletado — remover do leaderboard silenciosamente
    const valid = await Promise.all(entries.map(async e => {
      if (!e.name || !e.name.trim()) return null; // sem nome = lixo
      try {
        const userDoc = await getDoc(doc(db, 'users', e.id));
        if (!userDoc.exists() || !userDoc.data()?.profile?.name) {
          // Usuário deletado ou sem perfil — limpar leaderboard silenciosamente
          try { await deleteDoc(doc(db, 'leaderboard', e.id)); } catch {}
          return null;
        }
        return e;
      } catch {
        // Erro de permissão ou rede — manter a entrada por precaução
        return e;
      }
    }));

    return valid.filter(Boolean).sort((a, b) => (b.dx || 0) - (a.dx || 0));
  } catch (e) { console.warn('[db] getLeaderboard failed:', e.message); return []; }
}

// Deleta todos os dados do usuário (users + leaderboard)
// Chamada quando o usuário deleta sua conta pelo app
export async function deleteUserData(uid) {
  try { await deleteDoc(doc(db, 'users', uid)); } catch (e) { console.warn('[db] deleteUserData users:', e.message); }
  try { await deleteDoc(doc(db, 'leaderboard', uid)); } catch (e) { console.warn('[db] deleteUserData leaderboard:', e.message); }
}
