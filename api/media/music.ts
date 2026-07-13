import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleMusicApi } from '../../src/services/media/server/handlers';
import type { EmotionCategory } from '../../src/types/media';

const CATEGORIES: EmotionCategory[] = ['stress', 'anxiety', 'burnout', 'focus', 'relax', 'happy'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const category = CATEGORIES.includes(req.query.category as EmotionCategory)
    ? (req.query.category as EmotionCategory)
    : 'stress';

  try {
    const payload = await handleMusicApi(category);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(payload);
  } catch {
    return res.status(200).json({ items: [] });
  }
}
