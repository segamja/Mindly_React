import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import type { EmotionCategory } from './src/types/media';

const CATEGORIES: EmotionCategory[] = ['stress', 'anxiety', 'burnout', 'focus', 'relax', 'happy'];

function parseCategory(url: URL): EmotionCategory {
  const value = url.searchParams.get('category');
  return CATEGORIES.includes(value as EmotionCategory) ? (value as EmotionCategory) : 'stress';
}

/** 로컬 개발 시 Vercel Serverless API를 대체하는 미들웨어 */
export function mediaApiPlugin(): Plugin {
  return {
    name: 'mindly-media-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '');
      Object.assign(process.env, env);

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/media/')) return next();

        try {
          const url = new URL(req.url, 'http://localhost');
          const category = parseCategory(url);
          const { handleMusicApi, handleImagesApi } = await import(
            './src/services/media/server/handlers'
          );

          const payload =
            url.pathname === '/api/media/music'
              ? await handleMusicApi(category)
              : url.pathname === '/api/media/images'
                ? await handleImagesApi(category)
                : null;

          if (!payload) return next();

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ items: [] }));
        }
      });
    },
  };
}
