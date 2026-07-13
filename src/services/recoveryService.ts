import type { RecoveryPlan } from '@/types';
import { getTodayString } from '@/utils';
import { getSupabase, isSupabaseConfigured } from './supabase/client';

const STORAGE_KEY = 'mindly_recovery_plan';

const DEFAULT_TASKS = [
  { id: 'water', label: '물 한잔 마시기', done: false },
  { id: 'breathe', label: '3분 호흡하기', done: false },
  { id: 'window', label: '창밖 보기', done: false },
  { id: 'journal', label: '감사일기 작성', done: false },
  { id: 'music', label: '좋아하는 음악 듣기', done: false },
];

function buildPlanForToday(): RecoveryPlan {
  const today = getTodayString();
  const hour = new Date().getHours();

  const tasks = [...DEFAULT_TASKS];
  if (hour >= 17) {
    tasks.unshift({ id: 'stretch', label: '어깨 스트레칭 2분', done: false });
  }
  if (hour < 12) {
    tasks.unshift({ id: 'intention', label: '오늘의 한 가지 의도 정하기', done: false });
  }

  return { date: today, tasks, score: 0 };
}

function calcScore(tasks: RecoveryPlan['tasks']): number {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
}

function loadLocal(): RecoveryPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = getTodayString();
    if (raw) {
      const plan = JSON.parse(raw) as RecoveryPlan;
      if (plan.date === today) return plan;
    }
  } catch {
    /* ignore */
  }
  return buildPlanForToday();
}

function saveLocal(plan: RecoveryPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export async function fetchRecoveryPlan(): Promise<RecoveryPlan> {
  const supabase = getSupabase();
  if (!isSupabaseConfigured() || !supabase) return loadLocal();

  const today = getTodayString();
  const { data } = await supabase
    .from('recovery_plans')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (data?.tasks) {
    return { date: today, tasks: data.tasks, score: data.score ?? calcScore(data.tasks) };
  }

  const plan = buildPlanForToday();
  await supabase.from('recovery_plans').upsert({ date: today, tasks: plan.tasks, score: 0 });
  return plan;
}

export async function toggleRecoveryTask(taskId: string): Promise<RecoveryPlan> {
  const plan = loadLocal();
  plan.tasks = plan.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
  plan.score = calcScore(plan.tasks);
  saveLocal(plan);

  const supabase = getSupabase();
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('recovery_plans').upsert({
      date: plan.date,
      tasks: plan.tasks,
      score: plan.score,
    });
    await supabase.from('recovery_history').insert({
      date: plan.date,
      task_id: taskId,
      completed_at: new Date().toISOString(),
    });
  }

  return plan;
}

export function getRecoveryPlanSync(): RecoveryPlan {
  return loadLocal();
}
