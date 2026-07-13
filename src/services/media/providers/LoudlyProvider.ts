import type { EmotionCategory, MusicItem } from '@/types/media';
import type { MusicProvider } from './types';

const LOUDLY_BASE = 'https://soundtracks.loudly.com';

/** 감정 → Loudly catalog mood 태그 */
const LOUDLY_MOOD: Record<EmotionCategory, string> = {
  stress: 'Laid Back',
  anxiety: 'Dreamy',
  burnout: 'Laid Back',
  focus: 'Dark',
  relax: 'Dreamy',
  happy: 'Laid Back',
};

interface LoudlySong {
  id: string;
  title: string;
  duration?: number;
  music_file_path?: string;
  genre?: string[];
  mood?: string[];
}

interface LoudlySongsResponse {
  items?: LoudlySong[];
}

export class LoudlyProvider implements MusicProvider {
  constructor(private readonly apiKey: string) {}

  async search(category: EmotionCategory, query: string): Promise<MusicItem[]> {
    if (!this.apiKey) return [];

    const mood = LOUDLY_MOOD[category];
    const params = new URLSearchParams({ limit: '8', mood });
    if (query) params.set('genre', query.split(' ')[0]);

    const res = await fetch(`${LOUDLY_BASE}/api/songs?${params}`, {
      headers: {
        'API-KEY': this.apiKey,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Loudly API ${res.status}`);

    const data = (await res.json()) as LoudlySongsResponse;
    return (data.items ?? [])
      .map((song) => {
        if (!song.music_file_path) return null;
        const durationMs = song.duration ?? 180000;
        return {
          id: `loudly-${song.id}`,
          title: song.title,
          url: song.music_file_path,
          duration: Math.max(30, Math.round(durationMs / 1000)),
          tags: [...(song.mood ?? []), ...(song.genre ?? [])],
          category,
        } satisfies MusicItem;
      })
      .filter((item): item is MusicItem => item !== null);
  }
}
