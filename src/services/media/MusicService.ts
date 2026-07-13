import type { EmotionCategory, MusicItem } from '@/types/media';
import { cacheManager } from './cache/CacheManager';
import { getDefaultMusic } from './defaults';
import { normalizeMusicItems } from './resolveMediaUrl';

const pendingMusic = new Map<string, Promise<MusicItem[]>>();

function getApiBase(): string {
  return import.meta.env.VITE_MEDIA_API_BASE ?? '';
}

function parseCategory(value: string | null | undefined): EmotionCategory {
  const allowed: EmotionCategory[] = ['stress', 'anxiety', 'burnout', 'focus', 'relax', 'happy'];
  return allowed.includes(value as EmotionCategory) ? (value as EmotionCategory) : 'stress';
}

async function fetchFromApi(category: EmotionCategory): Promise<MusicItem[]> {
  const base = getApiBase();
  const url = `${base}/api/media/music?category=${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Music API ${res.status}`);
  const data = (await res.json()) as { items?: MusicItem[] };
  return data.items ?? [];
}

async function loadPlaylist(category: EmotionCategory): Promise<MusicItem[]> {
  cacheManager.clearExpired();

  const cached = cacheManager.getMusic(category);
  if (cached?.length) return cached;

  if (pendingMusic.has(category)) return pendingMusic.get(category)!;

  const promise = (async () => {
    try {
      const items = await fetchFromApi(category);
      if (items.length) {
        cacheManager.saveMusic(category, items);
        return items;
      }
    } catch {
      // Cache → API → Default
    }
    const fallback = normalizeMusicItems(getDefaultMusic(category));
    cacheManager.saveMusic(category, fallback);
    return fallback;
  })();

  pendingMusic.set(category, promise);
  try {
    return await promise;
  } finally {
    pendingMusic.delete(category);
  }
}

export class MusicService {
  async getPlaylist(category: EmotionCategory): Promise<MusicItem[]> {
    return loadPlaylist(category);
  }

  async getTrack(category: EmotionCategory, index = 0): Promise<MusicItem> {
    const playlist = await this.getPlaylist(category);
    const track = playlist[index] ?? playlist[0] ?? getDefaultMusic(category)[0];
    cacheManager.touchMusic(track.id, category);
    void cacheManager.prefetchUrl(track.url);
    return track;
  }

  async refreshInBackground(category: EmotionCategory): Promise<void> {
    if (!cacheManager.isCategoryExpired('music', category)) return;
    try {
      const items = await fetchFromApi(category);
      if (items.length) cacheManager.saveMusic(category, items);
    } catch {
      // 백그라운드 갱신 실패는 무시
    }
  }
}

export const musicService = new MusicService();

export function resolveMusicCategory(value?: string | null): EmotionCategory {
  return parseCategory(value);
}
