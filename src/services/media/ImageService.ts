import type { EmotionCategory, ImageItem } from '@/types/media';
import { cacheManager } from './cache/CacheManager';
import { getDefaultImages } from './defaults';
import { normalizeImageItems } from './resolveMediaUrl';

const pendingImages = new Map<string, Promise<ImageItem[]>>();

function getApiBase(): string {
  return import.meta.env.VITE_MEDIA_API_BASE ?? '';
}

function parseCategory(value: string | null | undefined): EmotionCategory {
  const allowed: EmotionCategory[] = ['stress', 'anxiety', 'burnout', 'focus', 'relax', 'happy'];
  return allowed.includes(value as EmotionCategory) ? (value as EmotionCategory) : 'stress';
}

async function fetchFromApi(category: EmotionCategory): Promise<ImageItem[]> {
  const base = getApiBase();
  const url = `${base}/api/media/images?category=${category}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Images API ${res.status}`);
  const data = (await res.json()) as { items?: ImageItem[] };
  return data.items ?? [];
}

async function loadGallery(category: EmotionCategory): Promise<ImageItem[]> {
  cacheManager.clearExpired();

  const cached = cacheManager.getImages(category);
  if (cached?.length) return cached;

  if (pendingImages.has(category)) return pendingImages.get(category)!;

  const promise = (async () => {
    try {
      const items = await fetchFromApi(category);
      if (items.length) {
        cacheManager.saveImages(category, items);
        items.slice(0, 5).forEach((item) => void cacheManager.prefetchUrl(item.url));
        return items;
      }
    } catch {
      // Cache → API → Default
    }
    const fallback = normalizeImageItems(getDefaultImages(category));
    cacheManager.saveImages(category, fallback);
    return fallback;
  })();

  pendingImages.set(category, promise);
  try {
    return await promise;
  } finally {
    pendingImages.delete(category);
  }
}

export class ImageService {
  async getGallery(category: EmotionCategory): Promise<ImageItem[]> {
    return loadGallery(category);
  }

  async getHeroImage(category: EmotionCategory): Promise<ImageItem> {
    const gallery = await this.getGallery(category);
    return gallery[0] ?? getDefaultImages(category)[0];
  }

  async refreshInBackground(category: EmotionCategory): Promise<void> {
    if (!cacheManager.isCategoryExpired('images', category)) return;
    try {
      const items = await fetchFromApi(category);
      if (items.length) cacheManager.saveImages(category, items);
    } catch {
      // 백그라운드 갱신 실패는 무시
    }
  }
}

export const imageService = new ImageService();

export function resolveImageCategory(value?: string | null): EmotionCategory {
  return parseCategory(value);
}
