import { createContext, useContext } from 'react';
import { usePwaUpdate } from '@/hooks/usePwaUpdate';
import { PwaUpdateModal } from '@/components/PwaUpdateModal';

interface PwaContextValue {
  isStandalone: boolean;
  appVersion: string;
  swCacheVersion: string;
}

const PwaContext = createContext<PwaContextValue>({
  isStandalone: false,
  appVersion: '3.0.0',
  swCacheVersion: 'mindly-v3.0.0',
});

export function usePwaContext() {
  return useContext(PwaContext);
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const {
    showUpdateModal,
    applyUpdate,
    dismissUpdate,
    isStandalone,
    appVersion,
    swCacheVersion,
    remoteVersion,
  } = usePwaUpdate();

  return (
    <PwaContext.Provider value={{ isStandalone, appVersion, swCacheVersion }}>
      {children}
      <PwaUpdateModal
        open={showUpdateModal}
        isStandalone={isStandalone}
        remoteVersion={remoteVersion}
        onUpdate={applyUpdate}
        onDismiss={dismissUpdate}
      />
    </PwaContext.Provider>
  );
}
