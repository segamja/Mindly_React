import { TRACKS } from '@/data/content';
import { assetUrl } from '@/utils';
import type { EmotionCategory, MusicItem } from '@/types/media';
import type { TrackId } from '@/types';

function parseDuration(label: string): number {
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) * 60 : 180;
}

export function getLocalTrackById(id: TrackId | string): MusicItem | null {
  const track = TRACKS.find((t) => t.id === id);
  if (!track) return null;
  return {
    id: track.id,
    title: track.title,
    url: assetUrl(track.src),
    duration: parseDuration(track.duration),
    tags: ['local'],
    category: 'relax' as EmotionCategory,
  };
}

export function getAllLocalTracks(): MusicItem[] {
  return TRACKS.map((track) => ({
    id: track.id,
    title: track.title,
    url: assetUrl(track.src),
    duration: parseDuration(track.duration),
    tags: ['local'],
    category: 'relax' as EmotionCategory,
  }));
}

export { TRACKS };
