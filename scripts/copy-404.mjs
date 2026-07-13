import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexHtml = resolve(distDir, 'index.html');

if (!existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

// GitHub Pages project site SPA fallback (segamja.github.io/Mindly_React/*)
const html = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>Mindly</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>`;

writeFileSync(resolve(distDir, '404.html'), html);
console.log('Created dist/404.html for GitHub Pages SPA routing.');
