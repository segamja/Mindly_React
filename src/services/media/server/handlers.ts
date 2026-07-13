import type { EmotionCategory, ImageItem, MusicItem } from '@/types/media';
import { getDefaultImages, getDefaultMusic } from '../defaults';
import { getImageSearchQuery, getMusicSearchQuery } from '../emotionMapping';
import { FreesoundProvider } from '../providers/FreesoundProvider';
import { LoudlyProvider } from '../providers/LoudlyProvider';
import { UnsplashProvider } from '../providers/UnsplashProvider';

function env(key: string): string {
  const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return nodeEnv?.[key] ?? '';
}

export async function fetchMusicFromProviders(category: EmotionCategory): Promise<MusicItem[]> {
  const query = getMusicSearchQuery(category);
  const providers = [
    new LoudlyProvider(env('LOUDLY_API_KEY')),
    new FreesoundProvider(env('FREESOUND_API_KEY')),
  ];

  for (const provider of providers) {
    try {
      const items = await provider.search(category, query);
      if (items.length > 0) return items;
    } catch {
      // 다음 Provider 시도
    }
  }

  return getDefaultMusic(category);
}

export async function fetchImagesFromProviders(category: EmotionCategory): Promise<ImageItem[]> {
  const query = getImageSearchQuery(category);
  const provider = new UnsplashProvider(env('UNSPLASH_ACCESS_KEY'));

  try {
    const items = await provider.search(category, query);
    if (items.length > 0) return items;
  } catch {
    // Provider 실패 → 기본 리소스
  }

  return getDefaultImages(category);
}

export async function handleMusicApi(category: EmotionCategory): Promise<{ items: MusicItem[] }> {
  const items = await fetchMusicFromProviders(category);
  return { items };
}

export async function handleImagesApi(category: EmotionCategory): Promise<{ items: ImageItem[] }> {
  const items = await fetchImagesFromProviders(category);
  return { items };
}
