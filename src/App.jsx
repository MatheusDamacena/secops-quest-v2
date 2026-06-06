// ─── APP ROOT ─────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth }     from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';

import LoadingScreen     from './screens/LoadingScreen';
import AuthScreen        from './screens/AuthScreen';
import SetupScreen       from './screens/SetupScreen';
import HomeScreen        from './screens/HomeScreen';
import GlossaryScreen    from './screens/GlossaryScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen     from './screens/ProfileScreen';
import M0Screen          from './screens/M0Screen';
import M1Screen          from './screens/M1Screen';
import M2Screen          from './screens/M2Screen';
import M3Screen          from './screens/M3Screen';
import M4Screen          from './screens/M4Screen';
import M5Screen          from './screens/M5Screen';
import M6Screen          from './screens/M6Screen';

export default function App() {
  const { fbUser, profile, setProfile, loadingAuth } = useAuth();
  const { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded } = useProgress({ fbUser, profile });

  const [screen,    setScreen]    = useState('home');
  const [moduleId,  setModuleId]  = useState(null);
  const [setupDone, setSetupDone] = useState(false);

  if (!loaded || loadingAuth) return <LoadingScreen />;
  if (!fbUser) return <AuthScreen />;
  if (!profile?.name && !setupDone) {
    return <SetupScreen fbUser={fbUser} onDone={(p) => { setProfile(p); setSetupDone(true); setScreen('home'); }} />;
  }

  const goTo = (s, id = null) => { setScreen(s); if (id !== null) setModuleId(id); };

  const handleModuleComplete = (progressUpdate, xpEarned, isModuleDone) => {
    setProgress(p => ({ ...p, ...progressUpdate }));
    setTotalXp(x => x + xpEarned);
    if (isModuleDone) goTo('home');
  };

  const moduleProps = { progress, onBack: () => goTo('home'), onComplete: handleModuleComplete };

  if (screen === 'module') {
    if (moduleId === 0) return <M1Screen {...moduleProps} />;
    if (moduleId === 1) return <M0Screen {...moduleProps} />;
    if (moduleId === 2) return <M2Screen {...moduleProps} />;
    if (moduleId === 3) return <M3Screen {...moduleProps} />;
    if (moduleId === 4) return <M4Screen {...moduleProps} />;
    if (moduleId === 5) return <M5Screen {...moduleProps} />;
    if (moduleId === 6) return <M6Screen {...moduleProps} />;
  }

  const commonProps = { profile, totalXp, streak, progress, onNavigate: goTo };

  return (
    <>
      {screen === 'home'        && <HomeScreen        {...commonProps} />}
      {screen === 'glossary'    && <GlossaryScreen    onBack={() => goTo('home')} />}
      {screen === 'leaderboard' && <LeaderboardScreen currentUserId={profile?.userId} onBack={() => goTo('home')} />}
      {screen === 'profile'     && <ProfileScreen     {...commonProps} fbUser={fbUser} onBack={() => goTo('home')} />}
      {screen === 'missions'    && <M4Screen          {...moduleProps} />}
    </>
  );
}
