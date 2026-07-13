import { useCallback, useRef } from 'react';
import { useMediaStore } from '@/store/useMediaStore';
import type { EmotionCategory, MusicItem } from '@/types/media';

export function useMediaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setCurrentMusic, setPlaying } = useMediaStore();

  const play = useCallback(
    async (track: MusicItem, category?: EmotionCategory) => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = track.url;
      audioRef.current.loop = true;
      try {
        await audioRef.current.play();
        setCurrentMusic(track, category ?? track.category);
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    },
    [setCurrentMusic, setPlaying],
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [setPlaying]);

  return { play, stop, audioRef };
}
