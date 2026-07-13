import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexHtml = resolve(distDir, 'index.html');
const fallbackHtml = resolve(distDir, '404.html');

if (!existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

cpSync(indexHtml, fallbackHtml);
console.log('Created dist/404.html for GitHub Pages SPA routing.');
