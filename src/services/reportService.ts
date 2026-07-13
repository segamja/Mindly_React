import type { AiConversation, MoodLog, UserState, WeeklyReport } from '@/types';
import { getTodayString } from '@/utils';
import { getSupabase, isSupabaseConfigured } from './supabase/client';

const MOOD_KEY = 'mindly_mood_logs';
const AI_KEY = 'mindly_ai_conversations';

function loadMoodLogs(): MoodLog[] {
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? (JSON.parse(raw) as MoodLog[]) : [];
  } catch {
    return [];
  }
}

function loadAiConversations(): AiConversation[] {
  try {
    const raw = localStorage.getItem(AI_KEY);
    return raw ? (JSON.parse(raw) as AiConversation[]) : [];
  } catch {
    return [];
  }
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function inferMoodFromState(state: UserState, date: string): MoodLog['mood'] {
  const journal = state.gratitudeJournal.some((e) => e.date === date);
  const missions = state.dailyMissions?.date === date ? state.dailyMissions : null;
  const completed = missions?.aiCoaching && missions?.breathe;

  if (journal && completed) return 'positive';
  if (state.lastPreset === 'overtime' || state.lastPreset === 'boss') return 'stress';
  return 'neutral';
}

function buildMoodLogsFromState(state: UserState): MoodLog[] {
  const weekDates = getWeekDates();
  const stored = loadMoodLogs();

  return weekDates.map((date) => {
    const existing = stored.find((m) => m.date === date);
    if (existing) return existing;

    const journal = state.gratitudeJournal.some((e) => e.date === date);
    const mood = inferMoodFromState(state, date);
    const energy = journal ? Math.min(100, state.mindEnergy + 16) : state.mindEnergy;

    return { date, mood, mindEnergy: energy, preset: state.lastPreset ?? undefined };
  });
}

function analyzePatterns(logs: MoodLog[], state: UserState): string[] {
  const patterns: string[] = [];
  const stressDays = logs.filter((l) => l.mood === 'stress');
  const journalDates = new Set(state.gratitudeJournal.map((e) => e.date));

  if (stressDays.length >= 2) {
    patterns.push('퇴근 이후 스트레스가 증가하는 패턴이 있습니다.');
  }
  if (state.streak >= 3) {
    patterns.push(`${state.streak}일 연속 사용으로 회복 루틴이 자리 잡고 있습니다.`);
  }
  if (logs.filter((l) => journalDates.has(l.date)).length >= 3) {
    patterns.push('감사일기를 꾸준히 작성하고 있습니다.');
  }
  if (state.dailyMissions?.aiCoaching) {
    patterns.push('AI 코칭을 활용해 스트레스 대응을 시도했습니다.');
  }

  return patterns.length ? patterns : ['이번 주 데이터가 쌓이면 더 정확한 패턴을 보여드릴게요.'];
}

function buildInsights(logs: MoodLog[], state: UserState): string[] {
  const insights: string[] = [];
  const withJournal = logs.filter((l) => state.gratitudeJournal.some((e) => e.date === l.date));
  const withoutJournal = logs.filter((l) => !state.gratitudeJournal.some((e) => e.date === l.date));

  if (withJournal.length && withoutJournal.length) {
    const avgWith = withJournal.reduce((s, l) => s + l.mindEnergy, 0) / withJournal.length;
    const avgWithout = withoutJournal.reduce((s, l) => s + l.mindEnergy, 0) / withoutJournal.length;
    const diff = Math.round(avgWith - avgWithout);
    if (diff > 0) {
      insights.push(`감사일기를 작성한 날에는 Mind Energy가 평균 ${diff}% 높았습니다.`);
    }
  }

  insights.push(`현재 XP ${state.xp}, Lv.${state.level} — 꾸준한 활동이 쌓이고 있습니다.`);
  if (state.streak > 0) {
    insights.push(`연속 ${state.streak}일 사용 중입니다.`);
  }

  return insights;
}

function buildRecommendations(state: UserState, patterns: string[]): string[] {
  const recs: string[] = [];

  if (patterns.some((p) => p.includes('퇴근'))) {
    recs.push('퇴근 직후 3분 호흡을 추가해보세요.');
  }
  if (!state.gratitudeJournal.some((e) => e.date === getTodayString())) {
    recs.push('오늘 감사일기를 작성하면 Mind Energy가 올라갈 수 있어요.');
  }
  if (!state.dailyMissions?.breathe) {
    recs.push('오피스 브리드 4-2-4 호흡을 한 번 시도해 보세요.');
  }
  recs.push('Recovery Plan 체크리스트를 완료해 회복 점수를 높여보세요.');

  return recs.slice(0, 3);
}

export function generateWeeklyReport(state: UserState): WeeklyReport {
  const moodLogs = buildMoodLogsFromState(state);
  const positiveDays = moodLogs.filter((l) => l.mood === 'positive').length;
  const stressDays = moodLogs.filter((l) => l.mood === 'stress').length;
  const patterns = analyzePatterns(moodLogs, state);
  const insights = buildInsights(moodLogs, state);
  const recommendations = buildRecommendations(state, patterns);

  const start = getWeekDates()[0].replace(/-/g, '.');
  const end = getWeekDates()[6].replace(/-/g, '.');

  return {
    weekLabel: `${start} ~ ${end}`,
    positiveDays,
    stressDays,
    patterns,
    insights,
    recommendations,
    moodLogs,
  };
}

export async function saveWeeklyReport(report: WeeklyReport): Promise<void> {
  const supabase = getSupabase();
  if (!isSupabaseConfigured() || !supabase) return;

  await supabase.from('weekly_reports').upsert({
    week_label: report.weekLabel,
    positive_days: report.positiveDays,
    stress_days: report.stressDays,
    patterns: report.patterns,
    insights: report.insights,
    recommendations: report.recommendations,
    generated_at: new Date().toISOString(),
  });
}

export function logAiConversation(conversation: AiConversation): void {
  const list = loadAiConversations();
  list.push(conversation);
  localStorage.setItem(AI_KEY, JSON.stringify(list.slice(-30)));
}

export function logMood(mood: MoodLog): void {
  const list = loadMoodLogs().filter((m) => m.date !== mood.date);
  list.push(mood);
  localStorage.setItem(MOOD_KEY, JSON.stringify(list.slice(-30)));
}
