import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** 최소 유효 MP3 — 오프라인·GitHub Pages 폴백용 */
const SILENT_MP3_B64 =
  '//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/////////////////////////////////////////8AAAA5TEFNRTMuOTAuOQAAAAAA';

const out = resolve('public/assets/default/default.mp3');
const buf = Buffer.from(SILENT_MP3_B64, 'base64');

const needsWrite = !existsSync(out) || statSync(out).size < 100;

if (needsWrite) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buf);
  console.log(`Created ${out} (${buf.length} bytes)`);
} else {
  console.log(`Using existing ${out}`);
}
