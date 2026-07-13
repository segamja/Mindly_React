import type { EmotionCategory, MusicItem } from '@/types/media';
import type { MusicProvider } from './types';

interface FreesoundResult {
  id: number;
  name: string;
  previews?: { 'preview-hq-mp3'?: string; 'preview-lq-mp3'?: string };
  duration?: number;
  tags?: string[];
}

interface FreesoundResponse {
  results?: FreesoundResult[];
}

export class FreesoundProvider implements MusicProvider {
  constructor(private readonly apiKey: string) {}

  async search(category: EmotionCategory, query: string): Promise<MusicItem[]> {
    if (!this.apiKey) return [];

    const params = new URLSearchParams({
      query,
      token: this.apiKey,
      page_size: '8',
      fields: 'id,name,previews,duration,tags',
    });

    const res = await fetch(`https://freesound.org/apiv2/search/text/?${params}`);
    if (!res.ok) throw new Error(`Freesound API ${res.status}`);

    const data = (await res.json()) as FreesoundResponse;
    return (data.results ?? [])
      .map((item) => {
        const url = item.previews?.['preview-hq-mp3'] ?? item.previews?.['preview-lq-mp3'];
        if (!url) return null;
        return {
          id: `freesound-${item.id}`,
          title: item.name,
          url,
          duration: Math.round(item.duration ?? 120),
          tags: item.tags ?? [],
          category,
        } satisfies MusicItem;
      })
      .filter((item): item is MusicItem => item !== null);
  }
}
