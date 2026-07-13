import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
import { APP_VERSION, SW_CACHE_VERSION } from './src/config/version';

export default defineConfig({
  base: '/OfficeCalm_Ai/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/images/care.png'],
      manifest: {
        id: '/OfficeCalm_Ai/',
        name: 'Mindly',
        short_name: 'Mindly',
        description: 'Your AI Mind Coach — 직장인을 위한 AI 멘탈 케어',
        theme_color: '#38bdf8',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ko',
        start_url: '/OfficeCalm_Ai/',
        scope: '/OfficeCalm_Ai/',
        icons: [
          {
            src: '/OfficeCalm_Ai/assets/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/OfficeCalm_Ai/assets/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/OfficeCalm_Ai/assets/icons/icon-512.png',
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
        navigateFallbackDenylist: [/^\/OfficeCalm_Ai\/assets\//],
        runtimeCaching: [
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
        enabled: false,
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
  },
  build: {
    outDir: 'dist',
  },
});
