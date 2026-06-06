import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './config';

export async function saveUser(uid, data) {
  try { await setDoc(doc(db, 'users', uid), data, { merge: true }); }
  catch (e) { console.warn('[db] saveUser failed:', e.message); }
}

export async function loadUser(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) { console.warn('[db] loadUser failed:', e.message); return null; }
}

export async function saveLeaderboard(uid, entry) {
  try { await setDoc(doc(db, 'leaderboard', uid), { ...entry, updatedAt: Date.now() }, { merge: true }); }
  catch (e) { console.warn('[db] saveLeaderboard failed:', e.message); }
}

export async function getLeaderboard() {
  try {
    const snap = await getDocs(collection(db, 'leaderboard'));
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const valid = await Promise.all(entries.map(async e => {
      try {
        const u = await getDoc(doc(db, 'users', e.id));
        if (!u.exists()) { await deleteDoc(doc(db, 'leaderboard', e.id)); return null; }
        return e;
      } catch { return e; }
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
