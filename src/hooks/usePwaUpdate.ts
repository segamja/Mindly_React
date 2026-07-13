import { useCallback, useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { APP_VERSION } from '@/config/version';

const UPDATE_CHECK_MS = 5 * 60 * 1000;
const STANDALONE_UPDATE_CHECK_MS = 60 * 1000;

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function usePwaUpdate() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

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

  useEffect(() => {
    if (needRefresh) setShowUpdateModal(true);
  }, [needRefresh]);

  useEffect(() => {
    if (!registration) return;

    const check = () => registration.update().catch(() => undefined);
    const interval = isStandalone() ? STANDALONE_UPDATE_CHECK_MS : UPDATE_CHECK_MS;

    check();
    const t1 = window.setTimeout(check, 1000);
    const t2 = window.setTimeout(check, 5000);
    const timer = window.setInterval(check, interval);

    const onVisible = () => {
      if (!document.hidden) check();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', check);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', check);
    };
  }, [registration]);

  const applyUpdate = useCallback(async () => {
    setShowUpdateModal(false);
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
  };
}
