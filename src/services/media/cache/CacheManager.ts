import type { EmotionCategory, ImageItem, MediaCacheEntry, MusicCacheMeta, MusicItem } from '@/types/media';

const MUSIC_META_KEY = 'mindly_music_cache_v3';
const IMAGE_CACHE_PREFIX = 'mindly_image_cache_';
const MUSIC_MAX_ENTRIES = 20;
const IMAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MEDIA_BLOB_CACHE = 'mindly-media-v1';

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

async function openBlobCache(): Promise<Cache | null> {
  if (typeof caches === 'undefined') return null;
  try {
    return await caches.open(MEDIA_BLOB_CACHE);
  } catch {
    return null;
  }
}

export class CacheManager {
  getMusic(category: EmotionCategory): MusicItem[] | null {
    const entry = readJson<MediaCacheEntry<MusicItem>>(`${MUSIC_META_KEY}_${category}`);
    if (!entry || this.isExpired(category, entry.cachedAt, IMAGE_TTL_MS)) return null;
    return entry.items;
  }

  saveMusic(category: EmotionCategory, items: MusicItem[]): void {
    writeJson(`${MUSIC_META_KEY}_${category}`, {
      category,
      items,
      cachedAt: Date.now(),
    } satisfies MediaCacheEntry<MusicItem>);

    const meta = readJson<MusicCacheMeta[]>(MUSIC_META_KEY) ?? [];
    const now = Date.now();
    const next = [
      ...meta.filter((m) => m.category !== category),
      ...items.map((item) => ({ id: item.id, category, lastUsedAt: now })),
    ];
    const trimmed = next
      .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
      .slice(0, MUSIC_MAX_ENTRIES);
    writeJson(MUSIC_META_KEY, trimmed);
  }

  touchMusic(id: string, category: EmotionCategory): void {
    const meta = readJson<MusicCacheMeta[]>(MUSIC_META_KEY) ?? [];
    const now = Date.now();
    const next = meta.map((m) => (m.id === id ? { ...m, lastUsedAt: now } : m));
    if (!next.some((m) => m.id === id)) {
      next.push({ id, category, lastUsedAt: now });
    }
    writeJson(
      MUSIC_META_KEY,
      next.sort((a, b) => b.lastUsedAt - a.lastUsedAt).slice(0, MUSIC_MAX_ENTRIES),
    );
  }

  getImages(category: EmotionCategory): ImageItem[] | null {
    const entry = readJson<MediaCacheEntry<ImageItem>>(`${IMAGE_CACHE_PREFIX}${category}`);
    if (!entry || this.isExpired(category, entry.cachedAt, IMAGE_TTL_MS)) return null;
    return entry.items;
  }

  saveImages(category: EmotionCategory, items: ImageItem[]): void {
    writeJson(`${IMAGE_CACHE_PREFIX}${category}`, {
      category,
      items: items.slice(0, 20),
      cachedAt: Date.now(),
    } satisfies MediaCacheEntry<ImageItem>);
  }

  isCategoryExpired(kind: 'music' | 'images', category: EmotionCategory): boolean {
    const key =
      kind === 'music' ? `${MUSIC_META_KEY}_${category}` : `${IMAGE_CACHE_PREFIX}${category}`;
    const entry = readJson<MediaCacheEntry<unknown>>(key);
    return !entry || this.isExpired(category, entry.cachedAt);
  }

  isExpired(_category: EmotionCategory, cachedAt?: number, ttl = IMAGE_TTL_MS): boolean {
    if (!cachedAt) return true;
    return Date.now() - cachedAt > ttl;
  }

  clearExpired(): void {
    const categories: EmotionCategory[] = ['stress', 'anxiety', 'burnout', 'focus', 'relax', 'happy'];
    for (const category of categories) {
      const musicEntry = readJson<MediaCacheEntry<MusicItem>>(`${MUSIC_META_KEY}_${category}`);
      if (musicEntry && this.isExpired(category, musicEntry.cachedAt)) {
        localStorage.removeItem(`${MUSIC_META_KEY}_${category}`);
      }
      const imageEntry = readJson<MediaCacheEntry<ImageItem>>(`${IMAGE_CACHE_PREFIX}${category}`);
      if (imageEntry && this.isExpired(category, imageEntry.cachedAt)) {
        localStorage.removeItem(`${IMAGE_CACHE_PREFIX}${category}`);
      }
    }
  }

  async prefetchUrl(url: string): Promise<void> {
    const cache = await openBlobCache();
    if (!cache || !url.startsWith('http')) return;
    try {
      const existing = await cache.match(url);
      if (existing) return;
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) await cache.put(url, res);
    } catch {
      // 오프라인·CORS 실패는 무시
    }
  }
}

export const cacheManager = new CacheManager();
