import { create } from 'zustand';
import type { EmotionCategory, ImageItem, MusicItem } from '@/types/media';

interface MediaState {
  currentMusic: MusicItem | null;
  currentCategory: EmotionCategory | null;
  galleryImages: ImageItem[];
  favorites: string[];
  isPlaying: boolean;
  setCurrentMusic: (track: MusicItem | null, category?: EmotionCategory | null) => void;
  setGalleryImages: (images: ImageItem[]) => void;
  setPlaying: (playing: boolean) => void;
  toggleFavorite: (id: string) => void;
}

const FAVORITES_KEY = 'mindly_media_favorites';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export const useMediaStore = create<MediaState>((set, get) => ({
  currentMusic: null,
  currentCategory: null,
  galleryImages: [],
  favorites: loadFavorites(),
  isPlaying: false,

  setCurrentMusic: (track, category = null) =>
    set({ currentMusic: track, currentCategory: category ?? track?.category ?? null }),

  setGalleryImages: (images) => set({ galleryImages: images }),

  setPlaying: (isPlaying) => set({ isPlaying }),

  toggleFavorite: (id) => {
    const next = get().favorites.includes(id)
      ? get().favorites.filter((f) => f !== id)
      : [...get().favorites, id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    set({ favorites: next });
  },
}));
