import type { EmotionCategory, ImageItem } from '@/types/media';
import type { ImageProvider } from './types';

interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string };
  user: { name: string };
}

interface UnsplashResponse {
  results?: UnsplashPhoto[];
}

export class UnsplashProvider implements ImageProvider {
  constructor(private readonly accessKey: string) {}

  async search(category: EmotionCategory, query: string): Promise<ImageItem[]> {
    if (!this.accessKey) return [];

    const params = new URLSearchParams({
      query,
      per_page: '12',
      orientation: 'landscape',
    });

    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${this.accessKey}` },
    });
    if (!res.ok) throw new Error(`Unsplash API ${res.status}`);

    const data = (await res.json()) as UnsplashResponse;
    return (data.results ?? []).map((photo) => ({
      id: `unsplash-${photo.id}`,
      url: photo.urls.regular,
      thumb: photo.urls.small,
      author: photo.user.name,
      category,
    }));
  }
}
