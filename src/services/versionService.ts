import { APP_VERSION, SW_CACHE_VERSION } from '@/config/version';

export interface RemoteVersionInfo {
  appVersion: string;
  swCacheVersion: string;
  builtAt: string;
}

export async function fetchRemoteVersion(): Promise<RemoteVersionInfo | null> {
  try {
    const url = `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as RemoteVersionInfo;
  } catch {
    return null;
  }
}

export function hasNewerVersion(remote: RemoteVersionInfo | null): boolean {
  if (!remote) return false;
  return remote.appVersion !== APP_VERSION || remote.swCacheVersion !== SW_CACHE_VERSION;
}

export function markVersionActive(): void {
  localStorage.setItem('mindly_active_version', APP_VERSION);
  localStorage.setItem('mindly_active_sw_cache', SW_CACHE_VERSION);
}

export function getStoredActiveVersion(): string | null {
  return localStorage.getItem('mindly_active_version');
}
