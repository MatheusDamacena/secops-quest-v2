// ─── APP ROOT ─────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth }     from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { useLanguage } from './hooks/useLanguage';

import LoadingScreen     from './screens/LoadingScreen';
import IOSInstallBanner  from './components/IOSInstallBanner';
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
import CelebrationScreen  from './screens/CelebrationScreen';
import OnboardingScreen   from './screens/OnboardingScreen';

export default function App() {
  const { fbUser, profile, setProfile, loadingAuth } = useAuth();
  const { progress, setProgress, totalXp, setTotalXp, streak, setStreak, loaded } = useProgress({ fbUser, profile });
  const { lang, setLang, t } = useLanguage();

  const [screen,    setScreen]    = useState('home');
  const [moduleId,  setModuleId]  = useState(null);
  const [setupDone, setSetupDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('secops-quest-onboarding-done'); }
    catch { return true; }
  });

  if (!loaded || loadingAuth) return <LoadingScreen t={t} />;
  if (!fbUser) return <AuthScreen lang={lang} setLang={setLang} t={t} />;
  if (!profile?.name && !setupDone) {
    return <SetupScreen fbUser={fbUser} onDone={(p) => { setProfile(p); setSetupDone(true); setScreen('home'); }} lang={lang} setLang={setLang} t={t} />;
  }
  if (showOnboarding) {
    return <OnboardingScreen onDone={() => {
      try { localStorage.setItem('secops-quest-onboarding-done', '1'); } catch {}
      setShowOnboarding(false);
    }} />;
  }

  const goTo = (s, id = null) => { setScreen(s); if (id !== null) setModuleId(id); };

  const isGrandmaster = (p) => {
    return (p?.m0 === true || p?.m0 === 100) &&
           (p?.m1||[]).length >= 7 &&
           (p?.m2 === true || p?.m2 === 100) &&
           (p?.m3||[]).length >= 4 &&
           (p?.m4||[]).length >= 16 &&
           (p?.m5||[]).length >= 7 &&
           (p?.m6||[]).length >= 8;
  };

  const handleModuleComplete = (progressUpdate, xpEarned, isModuleDone) => {
    setProgress(p => {
      const next = { ...p, ...progressUpdate };
      if (isModuleDone && isGrandmaster(next)) goTo('celebration');
      else if (isModuleDone) goTo('home');
      return next;
    });
    setTotalXp(x => x + xpEarned);
  };

  const moduleProps = { progress, onBack: () => goTo('home'), onComplete: handleModuleComplete, lang, t };

  if (screen === 'module') {
    if (moduleId === 0) return <M1Screen {...moduleProps} />;
    if (moduleId === 1) return <M0Screen {...moduleProps} />;
    if (moduleId === 2) return <M2Screen {...moduleProps} />;
    if (moduleId === 3) return <M3Screen {...moduleProps} />;
    if (moduleId === 4) return <M4Screen {...moduleProps} />;
    if (moduleId === 5) return <M5Screen {...moduleProps} />;
    if (moduleId === 6) return <M6Screen {...moduleProps} />;
  }

  const commonProps = { profile, totalXp, streak, progress, onNavigate: goTo, lang, setLang, t };

  return (
    <>
      <style>{`@keyframes sqFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      <div key={screen} style={{ animation:'sqFade .18s ease-out' }}>
        {screen === 'home'        && <HomeScreen        {...commonProps} />}
        {screen === 'celebration'  && <CelebrationScreen profile={profile} totalXp={totalXp} streak={streak} onContinue={() => goTo('profile')} />}
        {screen === 'glossary'    && <GlossaryScreen    onBack={() => goTo('home')} t={t} />}
        {screen === 'leaderboard' && <LeaderboardScreen currentUserId={profile?.userId} onBack={() => goTo('home')} />}
        {screen === 'profile'     && <ProfileScreen     {...commonProps} setProfile={setProfile} fbUser={fbUser} onBack={() => goTo('home')} />}
        {screen === 'missions'    && <M4Screen          {...moduleProps} />}
      </div>
      <IOSInstallBanner />
    </>
  );
}
