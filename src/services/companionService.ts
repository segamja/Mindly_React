import type { CompanionMessage } from '@/types';
import { getCompanionPeriod } from '@/utils';

const MESSAGES: Record<CompanionMessage['period'], Omit<CompanionMessage, 'period'>> = {
  morning: {
    emoji: '🌤',
    greeting: '좋은 아침입니다.',
    suggestion: '오늘 중요한 일정이 있으신가요? 회의 전에 2분 호흡을 추천드립니다.',
  },
  afternoon: {
    emoji: '☀️',
    greeting: '오후의 나에게.',
    suggestion: '지금쯤 집중력이 떨어질 시간입니다. 잠시 스트레칭을 해보세요.',
  },
  evening: {
    emoji: '🌆',
    greeting: '오늘도 수고하셨습니다.',
    suggestion: '오늘 감사했던 일을 하나만 적어볼까요?',
  },
  night: {
    emoji: '🌙',
    greeting: '편안한 밤 되세요.',
    suggestion: '오늘 하루를 마무리하며 4-2-4 호흡으로 긴장을 내려놓아 보세요.',
  },
};

export function getCompanionMessage(
  nickname: string,
  hasJournalToday: boolean,
  lastPreset?: string | null,
): CompanionMessage {
  const period = getCompanionPeriod();
  const base = MESSAGES[period];

  let suggestion = base.suggestion;
  if (period === 'evening' && hasJournalToday) {
    suggestion = '오늘 감사일기를 이미 작성하셨네요. 잠시 음악과 함께 휴식을 취해보세요.';
  }
  if (lastPreset === 'overtime' && period === 'evening') {
    suggestion = '야근 후에는 3분 호흡과 물 한 잔으로 회복 루틴을 시작해 보세요.';
  }
  if (lastPreset === 'meeting' && period === 'morning') {
    suggestion = '어제 회의 스트레스가 있었다면, 오늘 아침 2분 호흡으로 마음을 가볍게 시작해 보세요.';
  }

  const name = nickname ? `${nickname}님, ` : '';
  return {
    period,
    emoji: base.emoji,
    greeting: `${name}${base.greeting}`,
    suggestion,
  };
}
