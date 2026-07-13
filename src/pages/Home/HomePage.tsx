import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanionCard } from '@/components/CompanionCard';
import {
  AppLayout,
  LevelUpModal,
  OnboardingModal,
  SettingsLink,
  StatBar,
  XpToast,
} from '@/components/layout/AppLayout';
import { RecoveryCard } from '@/components/RecoveryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VersionBadge } from '@/components/VersionBadge';
import { usePwaContext } from '@/context/PwaContext';
import { getCompanionMessage } from '@/services/companionService';
import { useMindlyStore } from '@/store/useMindlyStore';
import { assetUrl, getTimeGreeting } from '@/utils';
import { DAILY_MESSAGES } from '@/utils/progress';
import { ensureMissions, getLevelTitle, getXpProgress } from '@/utils/progress';
import { calculateMindEnergy } from '@/utils/progress';

export function HomePage() {
  const navigate = useNavigate();
  const {
    nickname,
    userState,
    recoveryPlan,
    xpToast,
    levelUpTitle,
    setNickname,
    toggleRecoveryTask,
    hydrateRecovery,
    dismissLevelUp,
    musicEnabled,
    toggleMusic,
  } = useMindlyStore();

  const { isStandalone } = usePwaContext();

  useEffect(() => {
    hydrateRecovery();
  }, [hydrateRecovery]);

  const greeting = getTimeGreeting();
  const missions = ensureMissions(userState);
  const mindEnergy = calculateMindEnergy(userState);
  const companion = getCompanionMessage(
    nickname,
    userState.lastJournalDate === new Date().toISOString().slice(0, 10),
    userState.lastPreset,
  );
  const dailyMessage = DAILY_MESSAGES[new Date().getDay() % DAILY_MESSAGES.length];

  return (
    <AppLayout>
      {!nickname && <OnboardingModal onSubmit={setNickname} />}
      {xpToast && <XpToast message={xpToast} />}
      {levelUpTitle && <LevelUpModal title={levelUpTitle} onClose={dismissLevelUp} />}

      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={assetUrl('assets/images/care.png')} alt="" className="h-14 w-14 rounded-2xl" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Mindly</h1>
            <p className="text-xs text-slate-500">Your AI Mind Coach</p>
            <VersionBadge standalone={isStandalone} className="mt-1.5" />
          </div>
        </div>
        <SettingsLink />
      </header>

      <div className="mb-4 grid gap-2">
        <StatBar
          label={`Lv.${userState.level} ${getLevelTitle(userState.level)}`}
          value={`${userState.xp} XP`}
          percent={getXpProgress(userState.xp, userState.level)}
        />
        <StatBar label="Mind Energy" value={`${mindEnergy}%`} percent={mindEnergy} />
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-sm font-medium text-amber-800">
          🔥 {userState.streak}일 연속
        </div>
      </div>

      <Card className="mb-4 bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
        <CardHeader>
          <CardTitle className="text-white">
            {greeting.emoji} {greeting.text}
          </CardTitle>
          <p className="text-sky-100">{nickname ? `${nickname}님` : '회원님'}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-sky-50">오늘의 미션</p>
          <ul className="space-y-1 text-sm">
            <li>{missions.aiCoaching ? '☑' : '□'} AI 코칭</li>
            <li>{missions.breathe ? '☑' : '□'} 호흡</li>
            <li>{missions.journal ? '☑' : '□'} 감사일기</li>
          </ul>
          <Button
            className="w-full bg-white text-sky-600 hover:bg-sky-50"
            onClick={() => navigate('/coach')}
          >
            오늘 시작하기
          </Button>
        </CardContent>
      </Card>

      <div className="mb-4 space-y-4">
        <CompanionCard message={companion} />
        <RecoveryCard plan={recoveryPlan} onToggle={(id) => void toggleRecoveryTask(id)} />
      </div>

      <Card className="mb-4">
        <CardContent className="py-4 text-center text-sm text-slate-600">{dailyMessage}</CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <span className="text-sm font-medium">배경음악</span>
          <Button variant={musicEnabled ? 'default' : 'outline'} size="sm" onClick={toggleMusic}>
            {musicEnabled ? 'ON' : 'OFF'}
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
