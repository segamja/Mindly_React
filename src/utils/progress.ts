import {
  LEVEL_TITLES,
  LEVEL_XP,
  XP_REWARDS,
  type DailyMissions,
  type UserState,
} from '@/types';
import { getTodayString } from '@/utils';

export function getLevelFromXp(xp: number): number {
  let level = 1;
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, LEVEL_TITLES.length);
}

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] ?? LEVEL_TITLES[0];
}

export function getXpProgress(xp: number, level: number): number {
  const currentBase = LEVEL_XP[level - 1] ?? 0;
  const next = LEVEL_XP[level] ?? LEVEL_XP[LEVEL_XP.length - 1];
  if (next <= currentBase) return 100;
  return Math.min(100, Math.round(((xp - currentBase) / (next - currentBase)) * 100));
}

export function calculateMindEnergy(state: UserState): number {
  const today = getTodayString();
  let score = 35;
  score += Math.min(state.streak * 4, 24);
  if (state.lastCompletedDate === today) score += 18;
  if (state.lastJournalDate === today) score += 15;
  score += Math.min(state.level * 3, 18);
  score += Math.min(Math.floor(state.xp / 40), 10);
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getDefaultMissions(today: string): DailyMissions {
  return {
    date: today,
    aiCoaching: false,
    breathe: false,
    journal: false,
    bonusClaimed: false,
  };
}

export function ensureMissions(state: UserState): DailyMissions {
  const today = getTodayString();
  if (!state.dailyMissions || state.dailyMissions.date !== today) {
    return getDefaultMissions(today);
  }
  return state.dailyMissions;
}

export function allMissionsComplete(missions: DailyMissions): boolean {
  return missions.aiCoaching && missions.breathe && missions.journal;
}

export const BREATHE_RECOMMENDATIONS: Record<string, string> = {
  meeting: '오늘은 회의가 많았습니다. 4-2-4 호흡을 추천합니다.',
  boss: '긴장이 남아 있다면 어깨를 내리고 4-2-4 호흡을 추천합니다.',
  commute: '무기력할 때는 천천히 호흡하며 몸의 감각을 느껴 보세요.',
  overtime: '야근 후에는 짧은 4-2-4 호흡으로 신경을 안정시켜 보세요.',
  custom: '지금 이 순간, 4-2-4 호흡으로 마음을 가볍게 돌봐 주세요.',
  default: '오늘은 잠시 멈추고 4-2-4 호흡을 추천합니다.',
};

export const DAILY_MESSAGES = [
  '오늘도 충분히 잘하고 있습니다.',
  '회복은 작은 휴식에서 시작됩니다.',
  '잠깐 쉬어도 괜찮습니다.',
  '오늘도 함께 성장해 봐요.',
  '오늘도 여기까지 온 나, 정말 잘하고 있어요.',
  '완벽하지 않아도 괜찮아요. 지금 이 순간만큼은 충분합니다.',
  '쉬어가는 것도 업무의 일부예요. 잠시 멈춰도 괜찮습니다.',
  '내 마음을 돌보는 시간, 절대 낭비가 아니에요.',
];

export { XP_REWARDS };
