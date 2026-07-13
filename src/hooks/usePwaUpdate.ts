import { useCallback, useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { APP_VERSION, SW_CACHE_VERSION } from '@/config/version';
import {
  fetchRemoteVersion,
  hasNewerVersion,
  markVersionActive,
  type RemoteVersionInfo,
} from '@/services/versionService';

const UPDATE_CHECK_MS = 5 * 60 * 1000;
const STANDALONE_UPDATE_CHECK_MS = 30 * 1000;

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function hasWaitingWorker(registration: ServiceWorkerRegistration | null): boolean {
  return Boolean(registration?.waiting && navigator.serviceWorker.controller);
}

export function usePwaUpdate() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [remoteVersion, setRemoteVersion] = useState<RemoteVersionInfo | null>(null);
  const refreshingRef = useRef(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(reg) {
      setRegistration(reg ?? null);
    },
    onNeedRefresh() {
      setShowUpdateModal(true);
    },
  });

  const openUpdateModal = useCallback((remote: RemoteVersionInfo | null) => {
    if (remote) setRemoteVersion(remote);
    setShowUpdateModal(true);
  }, []);

  const checkForUpdates = useCallback(
    async (registrationOverride?: ServiceWorkerRegistration | null) => {
      const reg = registrationOverride ?? registration;
      const remote = await fetchRemoteVersion();

      if (remote) setRemoteVersion(remote);

      if (reg) {
        await reg.update().catch(() => undefined);
        if (hasWaitingWorker(reg)) {
          openUpdateModal(remote);
          return true;
        }
      }

      if (hasNewerVersion(remote)) {
        openUpdateModal(remote);
        return true;
      }

      return false;
    },
    [registration, openUpdateModal],
  );

  useEffect(() => {
    if (needRefresh) setShowUpdateModal(true);
  }, [needRefresh]);

  useEffect(() => {
    if (!registration) return;

    const onUpdateFound = () => {
      const worker = registration.installing;
      if (!worker) return;

      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          setShowUpdateModal(true);
        }
      });
    };

    if (hasWaitingWorker(registration)) {
      setShowUpdateModal(true);
    }

    registration.addEventListener('updatefound', onUpdateFound);

    return () => {
      registration.removeEventListener('updatefound', onUpdateFound);
    };
  }, [registration]);

  useEffect(() => {
    markVersionActive();

    const runStartupChecks = () => {
      void checkForUpdates(registration);
    };

    runStartupChecks();

    const t1 = window.setTimeout(runStartupChecks, 800);
    const t2 = window.setTimeout(runStartupChecks, 3000);

    const interval = isStandalone() ? STANDALONE_UPDATE_CHECK_MS : UPDATE_CHECK_MS;
    const timer = window.setInterval(() => {
      void checkForUpdates(registration);
    }, interval);

    const onVisible = () => {
      if (!document.hidden) void checkForUpdates(registration);
    };

    const onFocus = () => {
      void checkForUpdates(registration);
    };

    const onPageShow = () => {
      void checkForUpdates(registration);
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    window.addEventListener('pageshow', onPageShow);

    const onControllerChange = () => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker?.addEventListener('controllerchange', onControllerChange);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onPageShow);
      navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange);
    };
  }, [registration, checkForUpdates]);

  const applyUpdate = useCallback(async () => {
    setShowUpdateModal(false);
    markVersionActive();
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  const dismissUpdate = useCallback(() => {
    if (!isStandalone()) setShowUpdateModal(false);
  }, []);

  return {
    showUpdateModal,
    applyUpdate,
    dismissUpdate,
    isStandalone: isStandalone(),
    appVersion: APP_VERSION,
    swCacheVersion: SW_CACHE_VERSION,
    remoteVersion,
  };
}
