// ─── APP ROOT ─────────────────────────────────────────────────────────────────
// Responsável apenas por roteamento. Lógica em hooks, UI em screens/.
import { useState } from 'react';
import { useAuth }     from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';

// Screens
import LoadingScreen   from './screens/LoadingScreen';
import AuthScreen      from './screens/AuthScreen';
import SetupScreen     from './screens/SetupScreen';
import HomeScreen      from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen   from './screens/ProfileScreen';

export default function App() {
  const { fbUser, profile, setProfile, loadingAuth } = useAuth();
  const { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded } = useProgress({ fbUser, profile });

  const [screen, setScreen] = useState('home');
  const [setupDone, setSetupDone] = useState(false);

  // 1. Aguardar Firebase resolver
  if (!loaded || loadingAuth) return <LoadingScreen />;

  // 2. Sem usuário logado → tela de auth
  if (!fbUser) return <AuthScreen />;

  // 3. Sem perfil criado → tela de setup
  if (!profile?.name && !setupDone) {
    return <SetupScreen fbUser={fbUser} onDone={(p) => { setProfile(p); setSetupDone(true); }} />;
  }

  // 4. App principal
  const goTo = (s) => setScreen(s);

  return (
    <>
      {screen === 'home'        && <HomeScreen      profile={profile} totalXp={totalXp} streak={streak} progress={progress} onNavigate={goTo} />}
      {screen === 'leaderboard' && <LeaderboardScreen currentUserId={profile?.userId} onBack={() => goTo('home')} />}
      {screen === 'profile'     && <ProfileScreen   profile={profile} totalXp={totalXp} streak={streak} progress={progress} onBack={() => goTo('home')} fbUser={fbUser} />}
    </>
  );
}
