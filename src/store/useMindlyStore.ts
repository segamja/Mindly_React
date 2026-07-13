import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PresetKey, RecoveryPlan, UserState } from '@/types';
import { getRecoveryPlanSync, toggleRecoveryTask } from '@/services/recoveryService';
import { logAiConversation, logMood } from '@/services/reportService';
import { getTodayString } from '@/utils';
import {
  allMissionsComplete,
  calculateMindEnergy,
  ensureMissions,
  getLevelFromXp,
  getLevelTitle,
  XP_REWARDS,
} from '@/utils/progress';

const DEFAULT_STATE: UserState = {
  streak: 0,
  lastCompletedDate: null,
  xp: 0,
  level: 1,
  mindEnergy: 45,
  lastJournalDate: null,
  gratitudeJournal: [],
  dailyMissions: null,
  lastPreset: null,
};

interface MindlyStore {
  nickname: string;
  userState: UserState;
  musicEnabled: boolean;
  recoveryPlan: RecoveryPlan;
  xpToast: string | null;
  levelUpTitle: string | null;
  setNickname: (name: string) => void;
  addXp: (amount: number, reason: string) => void;
  completeMission: (type: 'aiCoaching' | 'breathe' | 'journal') => void;
  saveJournal: (text: string) => boolean;
  runAiScript: (preset: PresetKey, summary: string) => void;
  completeRitual: () => void;
  toggleMusic: () => void;
  toggleRecoveryTask: (taskId: string) => Promise<void>;
  dismissLevelUp: () => void;
  hydrateRecovery: () => void;
}

function loadLegacyState(): Partial<UserState> {
  try {
    const raw = localStorage.getItem('officeCalm_user_state');
    if (!raw) return {};
    const legacy = JSON.parse(raw) as UserState;
    const lastPreset = (localStorage.getItem('mindly_last_preset') as PresetKey) || null;
    return { ...legacy, lastPreset };
  } catch {
    return {};
  }
}

function loadLegacyNickname(): string {
  try {
    return localStorage.getItem('nickname')?.trim() || '';
  } catch {
    return '';
  }
}

export const useMindlyStore = create<MindlyStore>()(
  persist(
    (set, get) => ({
      nickname: loadLegacyNickname(),
      userState: { ...DEFAULT_STATE, ...loadLegacyState() },
      musicEnabled: false,
      recoveryPlan: getRecoveryPlanSync(),
      xpToast: null,
      levelUpTitle: null,

      setNickname: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        localStorage.setItem('nickname', trimmed);
        set({ nickname: trimmed });
      },

      addXp: (amount, reason) => {
        const state = { ...get().userState };
        const prevLevel = state.level;
        state.xp += amount;
        state.level = getLevelFromXp(state.xp);
        state.mindEnergy = calculateMindEnergy(state);
        set({
          userState: state,
          xpToast: `+${amount} XP · ${reason}`,
          levelUpTitle: state.level > prevLevel ? getLevelTitle(state.level) : null,
        });
        setTimeout(() => set({ xpToast: null }), 2000);
      },

      completeMission: (type) => {
        const state = { ...get().userState };
        const missions = ensureMissions(state);
        if (missions[type]) return;

        missions[type] = true;
        state.dailyMissions = missions;
        state.mindEnergy = calculateMindEnergy(state);
        set({ userState: state });

        if (allMissionsComplete(missions) && !missions.bonusClaimed) {
          missions.bonusClaimed = true;
          state.dailyMissions = missions;
          set({ userState: state });
          get().addXp(XP_REWARDS.missionBonus, '오늘의 미션 완료');
        }
      },

      saveJournal: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return false;

        const state = { ...get().userState };
        const today = getTodayString();
        const existing = state.gratitudeJournal.find((e) => e.date === today);
        const isNew = !existing;

        if (existing) {
          existing.text = trimmed;
        } else {
          state.gratitudeJournal.push({
            date: today,
            text: trimmed,
            createdAt: new Date().toISOString(),
          });
        }

        state.lastJournalDate = today;
        state.mindEnergy = calculateMindEnergy(state);
        set({ userState: state });

        get().completeMission('journal');
        if (isNew) get().addXp(XP_REWARDS.gratitudeJournal, '감사일기 작성');

        logMood({ date: today, mood: 'positive', mindEnergy: state.mindEnergy });
        return isNew;
      },

      runAiScript: (preset, summary) => {
        const state = { ...get().userState };
        state.lastPreset = preset;
        localStorage.setItem('mindly_last_preset', preset);
        state.mindEnergy = calculateMindEnergy(state);
        set({ userState: state });

        get().addXp(XP_REWARDS.aiScript, 'AI 코칭');
        get().completeMission('aiCoaching');

        logAiConversation({ date: getTodayString(), preset, summary });
        logMood({
          date: getTodayString(),
          mood: preset === 'overtime' || preset === 'boss' ? 'stress' : 'neutral',
          mindEnergy: state.mindEnergy,
          preset,
        });
      },

      completeRitual: () => {
        const state = { ...get().userState };
        const today = getTodayString();
        if (state.lastCompletedDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().slice(0, 10);

        if (state.lastCompletedDate === yStr) {
          state.streak += 1;
        } else {
          state.streak = 1;
        }

        state.lastCompletedDate = today;
        state.mindEnergy = calculateMindEnergy(state);
        set({ userState: state });
        get().addXp(XP_REWARDS.ritualComplete, '오늘의 명상 완료');
      },

      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),

      toggleRecoveryTask: async (taskId) => {
        const plan = await toggleRecoveryTask(taskId);
        set({ recoveryPlan: plan });
      },

      dismissLevelUp: () => set({ levelUpTitle: null }),

      hydrateRecovery: () => set({ recoveryPlan: getRecoveryPlanSync() }),
    }),
    {
      name: 'mindly-new-store',
      partialize: (s) => ({
        nickname: s.nickname,
        userState: s.userState,
        musicEnabled: s.musicEnabled,
      }),
    },
  ),
);
