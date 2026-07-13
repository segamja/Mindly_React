import type { EmotionCategory } from '@/types/media';

export const MUSIC_KEYWORDS: Record<EmotionCategory, string[]> = {
  stress: ['rain', 'forest', 'calm'],
  anxiety: ['ocean', 'breathing', 'waves'],
  burnout: ['meditation', 'birds', 'ambient'],
  focus: ['white noise', 'office ambience'],
  relax: ['piano', 'ambient', 'soft'],
  happy: ['acoustic', 'uplifting', 'gentle'],
};

export const IMAGE_KEYWORDS: Record<EmotionCategory, string[]> = {
  stress: ['forest', 'trees', 'nature calm'],
  anxiety: ['ocean', 'beach', 'sea calm'],
  burnout: ['sunrise', 'morning light'],
  focus: ['minimal desk', 'workspace clean'],
  relax: ['mountain', 'landscape calm'],
  happy: ['flowers', 'spring garden'],
};

export function getMusicSearchQuery(category: EmotionCategory): string {
  return MUSIC_KEYWORDS[category].join(' ');
}

export function getImageSearchQuery(category: EmotionCategory): string {
  return IMAGE_KEYWORDS[category][0];
}

export function inferEmotionFromText(input: string): EmotionCategory {
  const text = input.toLowerCase();
  if (text.includes('불안') || text.includes('긴장') || text.includes('anxiety')) return 'anxiety';
  if (text.includes('번아웃') || text.includes('지침') || text.includes('피곤') || text.includes('burnout'))
    return 'burnout';
  if (text.includes('집중') || text.includes('회의') || text.includes('focus')) return 'focus';
  if (text.includes('기쁨') || text.includes('happy') || text.includes('좋')) return 'happy';
  if (text.includes('휴식') || text.includes('relax')) return 'relax';
  return 'stress';
}
