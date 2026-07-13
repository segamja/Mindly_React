import type { EmotionCategory, ImageItem, MusicItem } from '@/types/media';

const DEFAULT_IMAGE = 'assets/default/default.svg';
const LOCAL_DEFAULT = 'assets/default/default.mp3';

function music(
  id: string,
  title: string,
  category: EmotionCategory,
  url: string,
  tags: string[],
  duration = 180,
): MusicItem {
  return { id, title, url, duration, tags, category, thumbnail: DEFAULT_IMAGE };
}

function image(id: string, category: EmotionCategory, url: string, author: string): ImageItem {
  return { id, url, thumb: url, author, category };
}

/** API·캐시 모두 실패 시 사용하는 오프라인 기본 리소스 */
export const DEFAULT_MUSIC: Record<EmotionCategory, MusicItem[]> = {
  stress: [
    music('default-stress-rain', '잔잔한 빗소리', 'stress', LOCAL_DEFAULT, ['rain', 'calm']),
    music('default-stress-forest', '숲속 명상', 'stress', LOCAL_DEFAULT, ['forest', 'calm'], 240),
  ],
  anxiety: [
    music('default-anxiety-ocean', '파도 소리', 'anxiety', LOCAL_DEFAULT, ['ocean', 'waves']),
  ],
  burnout: [
    music('default-burnout-meditation', '회복 명상', 'burnout', LOCAL_DEFAULT, ['meditation'], 300),
  ],
  focus: [
    music('default-focus-noise', '화이트 노이즈', 'focus', LOCAL_DEFAULT, ['white noise'], 300),
  ],
  relax: [
    music('default-relax-piano', '피아노 앰비언트', 'relax', LOCAL_DEFAULT, ['piano', 'ambient']),
  ],
  happy: [
    music('default-happy-acoustic', '어쿠스틱 힐링', 'happy', LOCAL_DEFAULT, ['acoustic']),
  ],
};

export const DEFAULT_IMAGES: Record<EmotionCategory, ImageItem[]> = {
  stress: [image('default-stress-1', 'stress', DEFAULT_IMAGE, 'Mindly')],
  anxiety: [image('default-anxiety-1', 'anxiety', DEFAULT_IMAGE, 'Mindly')],
  burnout: [image('default-burnout-1', 'burnout', DEFAULT_IMAGE, 'Mindly')],
  focus: [image('default-focus-1', 'focus', DEFAULT_IMAGE, 'Mindly')],
  relax: [image('default-relax-1', 'relax', DEFAULT_IMAGE, 'Mindly')],
  happy: [image('default-happy-1', 'happy', DEFAULT_IMAGE, 'Mindly')],
};

export function getDefaultMusic(category: EmotionCategory): MusicItem[] {
  return DEFAULT_MUSIC[category] ?? DEFAULT_MUSIC.stress;
}

export function getDefaultImages(category: EmotionCategory): ImageItem[] {
  return DEFAULT_IMAGES[category] ?? DEFAULT_IMAGES.stress;
}
