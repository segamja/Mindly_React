import type { EmotionCategory, ImageItem, MusicItem } from '@/types/media';

export interface MusicProvider {
  search(category: EmotionCategory, query: string): Promise<MusicItem[]>;
}

export interface ImageProvider {
  search(category: EmotionCategory, query: string): Promise<ImageItem[]>;
}
