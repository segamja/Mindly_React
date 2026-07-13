import { useCallback, useEffect, useState } from 'react';
import { musicService } from '@/services/media/MusicService';
import type { EmotionCategory, MusicItem } from '@/types/media';

interface UseMusicResult {
  music: MusicItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  playTrack: (index?: number) => Promise<MusicItem | null>;
}

export function useMusic(category: EmotionCategory): UseMusicResult {
  const [music, setMusic] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await musicService.getPlaylist(category);
      setMusic(items);
      void musicService.refreshInBackground(category);
    } catch (e) {
      setError(e instanceof Error ? e.message : '음악을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void load();
  }, [load]);

  const playTrack = useCallback(
    async (index = 0) => {
      try {
        return await musicService.getTrack(category, index);
      } catch {
        return null;
      }
    },
    [category],
  );

  return { music, loading, error, refresh: load, playTrack };
}
