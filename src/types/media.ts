import type { PresetKey } from '@/types';

export type EmotionCategory = 'stress' | 'anxiety' | 'burnout' | 'focus' | 'relax' | 'happy';

export interface MusicItem {
  id: string;
  title: string;
  url: string;
  duration: number;
  thumbnail?: string;
  tags: string[];
  category: EmotionCategory;
}

export interface ImageItem {
  id: string;
  url: string;
  thumb: string;
  author: string;
  category: EmotionCategory;
}

export interface MediaCacheEntry<T> {
  category: EmotionCategory;
  items: T[];
  cachedAt: number;
}

export interface MusicCacheMeta {
  id: string;
  category: EmotionCategory;
  lastUsedAt: number;
}

export const EMOTION_LABELS: Record<EmotionCategory, string> = {
  stress: '스트레스 해소',
  anxiety: '불안 완화',
  burnout: '번아웃 회복',
  focus: '집중',
  relax: '휴식',
  happy: '기분 전환',
};

export const PRESET_EMOTION: Record<PresetKey, EmotionCategory> = {
  meeting: 'focus',
  boss: 'stress',
  commute: 'burnout',
  overtime: 'burnout',
  custom: 'stress',
};
