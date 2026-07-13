export type PresetKey = 'meeting' | 'boss' | 'commute' | 'overtime' | 'custom';

export type TrackId =
  | 'white-noise'
  | 'desk-stretch'
  | 'deep-sleep'
  | 'burnout-recovery'
  | 'meeting-calm'
  | 'afternoon-focus'
  | 'commute-winddown';

export interface JournalEntry {
  date: string;
  text: string;
  createdAt: string;
}

export interface DailyMissions {
  date: string;
  aiCoaching: boolean;
  breathe: boolean;
  journal: boolean;
  bonusClaimed: boolean;
}

export interface UserState {
  streak: number;
  lastCompletedDate: string | null;
  xp: number;
  level: number;
  mindEnergy: number;
  lastJournalDate: string | null;
  gratitudeJournal: JournalEntry[];
  dailyMissions: DailyMissions | null;
  lastPreset: PresetKey | null;
}

export interface RecoveryTask {
  id: string;
  label: string;
  done: boolean;
}

export interface RecoveryPlan {
  date: string;
  tasks: RecoveryTask[];
  score: number;
}

export interface MoodLog {
  date: string;
  mood: 'positive' | 'stress' | 'neutral';
  mindEnergy: number;
  preset?: PresetKey;
}

export interface AiConversation {
  date: string;
  preset: PresetKey;
  summary: string;
}

export interface WeeklyReport {
  weekLabel: string;
  positiveDays: number;
  stressDays: number;
  patterns: string[];
  insights: string[];
  recommendations: string[];
  moodLogs: MoodLog[];
}

export interface CompanionMessage {
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  emoji: string;
  greeting: string;
  suggestion: string;
}

export const LEVEL_TITLES = [
  '새싹 직장인',
  '회복 루키',
  '마음 수호자',
  '밸런스 마스터',
  '칼름 리더',
  '멘탈 멘토',
  '오피스 힐러',
  '평온의 달인',
] as const;

export const LEVEL_XP = [0, 50, 120, 220, 350, 520, 750, 1050] as const;

export const XP_REWARDS = {
  aiScript: 15,
  ritualComplete: 25,
  gratitudeJournal: 20,
  audioPlay: 10,
  missionBonus: 40,
} as const;
