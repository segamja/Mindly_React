import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, '')}`;
}

export function formatDateLabel(date: string): string {
  return date.replace(/-/g, '.');
}

export function getTimeGreeting(): { emoji: string; text: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { emoji: '🌤', text: '좋은 아침입니다.' };
  if (hour >= 12 && hour < 18) return { emoji: '☀️', text: '좋은 오후입니다.' };
  if (hour >= 18 && hour < 22) return { emoji: '🌆', text: '수고 많으셨어요.' };
  return { emoji: '🌙', text: '편안한 밤 되세요.' };
}

export function getCompanionPeriod(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}
