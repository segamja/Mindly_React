import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
import { APP_VERSION, SW_CACHE_VERSION } from './src/config/version';
import { mediaApiPlugin } from './vite-plugin-media-api';

const PROD_BASE = '/Mindly_React/';

function versionJsonPlugin(): Plugin {
  return {
    name: 'mindly-version-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify(
          {
            appVersion: APP_VERSION,
            swCacheVersion: SW_CACHE_VERSION,
            builtAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? PROD_BASE : '/';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      mediaApiPlugin(),
      versionJsonPlugin(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/images/care.png'],
        manifest: {
          id: base,
          name: 'Mindly',
          short_name: 'Mindly',
          description: 'Your AI Mind Coach — 직장인을 위한 AI 멘탈 케어',
          theme_color: '#38bdf8',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          lang: 'ko',
          start_url: base,
          scope: base,
          icons: [
            {
              src: `${base}assets/icons/icon-192.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${base}assets/icons/icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${base}assets/icons/icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,webmanifest}'],
          globIgnores: ['**/calm-*.jpg', '**/*.mp3'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/Mindly_React\/assets\//, /^\/assets\//],
          runtimeCaching: [
            {
              urlPattern: /\/version\.json$/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'mindly-version',
                expiration: { maxEntries: 1, maxAgeSeconds: 60 },
              },
            },
            {
              urlPattern: /\/assets\/audio\/.*\.mp3$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'mindly-audio',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: /\/assets\/images\/.*\.(jpg|jpeg|png)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'mindly-images',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(APP_VERSION),
      __SW_CACHE_VERSION__: JSON.stringify(SW_CACHE_VERSION),
    },
    server: {
      port: 5173,
      open: '/',
      watch: {
        ignored: ['**/docs/**', '**/dist/**', '**/legacy/**'],
      },
    },
    build: {
      outDir: 'dist',
    },
  };
});
