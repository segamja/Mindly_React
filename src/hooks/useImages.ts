import { useCallback, useEffect, useState } from 'react';
import { imageService } from '@/services/media/ImageService';
import type { EmotionCategory, ImageItem } from '@/types/media';

interface UseImagesResult {
  images: ImageItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useImages(category: EmotionCategory): UseImagesResult {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await imageService.getGallery(category);
      setImages(items);
      void imageService.refreshInBackground(category);
    } catch (e) {
      setError(e instanceof Error ? e.message : '이미지를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void load();
  }, [load]);

  return { images, loading, error, refresh: load };
}
