import type { MusicItem } from '@/types/media';
import { resolveMediaUrl } from './resolveMediaUrl';

const LOCAL_DEFAULT = resolveMediaUrl('assets/default/default.mp3');
const REMOTE_FALLBACK =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = document.createElement('audio');
    audio.preload = 'auto';
    audio.setAttribute('playsinline', 'true');
    audio.style.display = 'none';
    document.body.appendChild(audio);
  }
  return audio;
}

function waitForAudioReady(el: HTMLAudioElement, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Audio load timeout: ${url}`));
    }, 12000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      el.removeEventListener('canplaythrough', onReady);
      el.removeEventListener('error', onError);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Audio load error: ${url}`));
    };

    el.addEventListener('canplaythrough', onReady, { once: true });
    el.addEventListener('error', onError, { once: true });

    if (el.src !== url) {
      el.src = url;
    }
    el.load();
  });
}

async function playUrl(url: string): Promise<void> {
  const el = getAudio();
  el.loop = true;
  el.volume = 1;
  await waitForAudioReady(el, url);
  await el.play();
}

export async function playSharedTrack(track: MusicItem): Promise<void> {
  const candidates = [track.url, LOCAL_DEFAULT, REMOTE_FALLBACK];
  let lastError: unknown;

  for (const url of candidates) {
    try {
      await playUrl(url);
      return;
    } catch (err) {
      lastError = err;
      console.warn('[Mindly] 재생 실패, 다음 소스 시도:', url);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All audio sources failed');
}

export function pauseSharedAudio(): void {
  audio?.pause();
}

export function getSharedAudio(): HTMLAudioElement | null {
  return audio;
}
