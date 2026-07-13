import { createContext, useContext } from 'react';
import { usePwaUpdate } from '@/hooks/usePwaUpdate';
import { PwaUpdateModal } from '@/components/PwaUpdateModal';

interface PwaContextValue {
  isStandalone: boolean;
  appVersion: string;
}

const PwaContext = createContext<PwaContextValue>({
  isStandalone: false,
  appVersion: '3.0.0',
});

export function usePwaContext() {
  return useContext(PwaContext);
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const { showUpdateModal, applyUpdate, dismissUpdate, isStandalone, appVersion } = usePwaUpdate();

  return (
    <PwaContext.Provider value={{ isStandalone, appVersion }}>
      {children}
      <PwaUpdateModal
        open={showUpdateModal}
        isStandalone={isStandalone}
        onUpdate={applyUpdate}
        onDismiss={dismissUpdate}
      />
    </PwaContext.Provider>
  );
}
