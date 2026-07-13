import { assetUrl } from '@/utils';
import type { ImageItem, MusicItem } from '@/types/media';

export function resolveMediaUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return assetUrl(url.replace(/^\//, ''));
}

export function normalizeMusicItems(items: MusicItem[]): MusicItem[] {
  return items.map((item) => ({
    ...item,
    url: resolveMediaUrl(item.url),
    thumbnail: item.thumbnail ? resolveMediaUrl(item.thumbnail) : undefined,
  }));
}

export function normalizeImageItems(items: ImageItem[]): ImageItem[] {
  return items.map((item) => ({
    ...item,
    url: resolveMediaUrl(item.url),
    thumb: resolveMediaUrl(item.thumb),
  }));
}
