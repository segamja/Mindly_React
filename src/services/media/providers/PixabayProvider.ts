// 향후 Pixabay API Provider 교체용 스텁
import type { EmotionCategory, ImageItem } from '@/types/media';
import type { ImageProvider } from './types';

export class PixabayProvider implements ImageProvider {
  constructor(private readonly apiKey: string) {}

  async search(_category: EmotionCategory, _query: string): Promise<ImageItem[]> {
    if (!this.apiKey) return [];
    return [];
  }
}
