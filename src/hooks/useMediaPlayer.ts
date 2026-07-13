import { useCallback } from 'react';
import { pauseSharedAudio, playSharedTrack } from '@/services/media/audioPlayer';
import { useMediaStore } from '@/store/useMediaStore';
import type { EmotionCategory, MusicItem } from '@/types/media';

export function useMediaPlayer() {
  const { setCurrentMusic, setPlaying } = useMediaStore();

  const play = useCallback(
    async (track: MusicItem, category?: EmotionCategory) => {
      try {
        await playSharedTrack(track);
        setCurrentMusic(track, category ?? track.category);
        setPlaying(true);
      } catch (err) {
        console.error('[Mindly] 음악 재생 실패:', track.url, err);
        setPlaying(false);
        throw err;
      }
    },
    [setCurrentMusic, setPlaying],
  );

  const stop = useCallback(() => {
    pauseSharedAudio();
    setPlaying(false);
  }, [setPlaying]);

  return { play, stop };
}
