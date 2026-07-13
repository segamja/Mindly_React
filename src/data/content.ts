import type { PresetKey } from '@/types';

export interface PresetScript {
  label: string;
  script: string;
}

const PRESET_SCRIPTS: Record<Exclude<PresetKey, 'custom'>, PresetScript> = {
  meeting: {
    label: '회의 5분 전',
    script: `[회의 5분 전 · 긴장 완화 코칭]

① 몸 세팅 (30초)
눈을 감고 어깨·턱·손의 힘을 동시에 풀어 주세요.
코로 4초 들이쉬고, 입으로 6초 내쉬기. 긴장은 경고등이지, 실패 예고가 아닙니다.

② 마음 챙김 (1분)
"나는 준비해 왔고, 지금 필요한 것만 말하면 된다."
완벽한 답이 아니라, 명확한 한 걸음이면 충분합니다.

③ 입장 직전 앵커 (30초)
첫 문장을 미리 정해 두세요.
"오늘 논의할 핵심은 ○○입니다."

[오늘의 한 줄]
긴장은 집중의 에너지입니다. 숨을 길게 내쉬며 차분함으로 바꿔 보세요.`,
  },
  boss: {
    label: '상사 잔소리 직후',
    script: `[상사 잔소리 직후 · 감정 회복 코칭]

① 감정 분리 (1분)
상사의 말과 나의 가치는 별개입니다.
지금 뜨거운 감정은 90초 안에 온도가 내려갑니다.

② 3-3-3 호흡 (1분)
3초 들이쉬기 → 3초 멈추기 → 3초 내쉬기. 세 번 반복하세요.

③ 다음 행동 (1분)
물 한 잔, 30초 창밖 보기, 필요한 일 딱 하나만 고르기.

[오늘의 한 줄]
비판은 피드백일 수 있지만, 나의 전부를 정의하지는 않습니다.`,
  },
  commute: {
    label: '출근길 무기력',
    script: `[출근길 무기력 · 에너지 리셋 코칭]

① 몸부터 깨우기 (1분)
발바닥이 바닥에 닿는 느낌에 집중해 보세요.
무거운 몸도 이미 출근 중입니다. 그것만으로 충분합니다.

② 에너지 리셋 (1분)
"오늘은 80%만 해도 된다."
완벽한 하루가 아니라, 회복 가능한 하루를 목표로 합니다.

③ 작은 의미 부여 (1분)
출근길에 한 가지 기대를 정하세요.
하루의 시작을 스스로에게 선물하는 시간입니다.

[오늘의 한 줄]
무기력은 멈춤이 아니라, 몸이 쉬어가라는 신호일 수 있습니다.`,
  },
  overtime: {
    label: '야근 번아웃',
    script: `[야근 번아웃 · 긴급 회복 코칭]

① 번아웃 인정 (1분)
지금의 피로는 약함이 아니라, 오래 버텨온 흔적입니다.
먼저 자신에게 "고생했다"고 말해 주세요.

② 긴급 회복 루틴 (2분)
4초 들이쉬고 8초 내쉬기를 5회 — 교감신경을 진정시키는 가장 빠른 방법입니다.

③ 경계 설정 (1분)
"지금 이 시간 이후의 나를 위해, 5분만 쉰다."

[오늘의 한 줄]
회복하지 않고 달리면, 내일의 나에게 빚을 지는 것과 같습니다.`,
  },
};

const CUSTOM_FALLBACK = `[지금 이 순간]
당신이 느끼는 감정은 자연스러운 반응입니다. 판단하지 말고 호흡부터 시작해 보세요.

[3회 심호흡]
어깨를 올렸다가 내리며, 배로 숨을 채우고 천천히 내뱉습니다.

[한 문장 위로]
"나는 이 상황을 헤쳐 나갈 자원을 이미 가지고 있다."`;

export function getPresetScript(key: PresetKey): PresetScript {
  if (key === 'custom') return { label: '맞춤', script: CUSTOM_FALLBACK };
  return PRESET_SCRIPTS[key];
}

export function generateCustomScript(userInput: string): string {
  const input = userInput.trim().toLowerCase();
  if (!input) return CUSTOM_FALLBACK;
  if (input.includes('회의') || input.includes('발표')) return PRESET_SCRIPTS.meeting.script;
  if (input.includes('상사') || input.includes('잔소리')) return PRESET_SCRIPTS.boss.script;
  if (input.includes('출근') || input.includes('무기력')) return PRESET_SCRIPTS.commute.script;
  if (input.includes('야근') || input.includes('번아웃')) return PRESET_SCRIPTS.overtime.script;

  return `[상황 인식]
「${userInput.trim()}」 — 이 상황이 당신을 많이 지치게 하고 있군요.

[호흡으로 멈추기]
4초 들이쉬고 6초 내쉬기. 어깨를 내리고, 손에 힘이 들어가 있지 않은지 확인해 보세요.

[다음 한 걸음]
지금 당장 통제 가능한 것 하나만 고르세요.

[마음 챙김]
5분만 회복하고 다시 시작해도 괜찮습니다.`;
}

export const PRESET_LIST: { key: PresetKey; label: string }[] = [
  { key: 'meeting', label: '회의 5분 전' },
  { key: 'boss', label: '상사 잔소리 직후' },
  { key: 'commute', label: '출근길 무기력' },
  { key: 'overtime', label: '야근 번아웃' },
];

export const TRACKS = [
  { id: 'white-noise', title: '사무실 백색소음', duration: '5분', levelRequired: 1, src: 'assets/audio/white-noise.mp3' },
  { id: 'desk-stretch', title: '책상 앞 스트레칭', duration: '3분', levelRequired: 1, src: 'assets/audio/desk-stretch.mp3' },
  { id: 'meeting-calm', title: '회의 후 진정 호흡', duration: '3분', levelRequired: 1, src: 'assets/audio/desk-stretch.mp3' },
  { id: 'afternoon-focus', title: '오후 집중 부스터', duration: '5분', levelRequired: 1, src: 'assets/audio/white-noise.mp3' },
  { id: 'commute-winddown', title: '퇴근길 마음 비우기', duration: '3분', levelRequired: 1, src: 'assets/audio/desk-stretch.mp3' },
  { id: 'deep-sleep', title: '야근 후 딥슬립', duration: '20분', levelRequired: 3, src: 'assets/audio/deep-sleep.mp3' },
  { id: 'burnout-recovery', title: '번아웃 회복 명상', duration: '15분', levelRequired: 5, src: 'assets/audio/burnout-recovery.mp3' },
] as const;
