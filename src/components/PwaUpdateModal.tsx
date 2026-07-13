import { Button } from '@/components/ui/button';
import { APP_VERSION, SW_CACHE_VERSION } from '@/config/version';
import type { RemoteVersionInfo } from '@/services/versionService';

interface PwaUpdateModalProps {
  open: boolean;
  isStandalone: boolean;
  remoteVersion: RemoteVersionInfo | null;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function PwaUpdateModal({
  open,
  isStandalone,
  remoteVersion,
  onUpdate,
  onDismiss,
}: PwaUpdateModalProps) {
  if (!open) return null;

  const nextVersion = remoteVersion?.appVersion ?? APP_VERSION;
  const nextCache = remoteVersion?.swCacheVersion ?? SW_CACHE_VERSION;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-labelledby="pwa-update-title"
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 text-center">
          <span className="text-3xl">🔄</span>
          <h2 id="pwa-update-title" className="mt-2 text-xl font-bold text-slate-900">
            새 버전이 있습니다
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isStandalone
              ? '앱을 다시 실행했을 때 새 버전이 감지되었습니다. 업데이트해 주세요.'
              : '새 버전이 배포되었습니다. 업데이트하면 최신 기능을 사용할 수 있습니다.'}
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <p>
              현재 v{APP_VERSION} → 최신 v{nextVersion}
            </p>
            <p className="mt-1 text-slate-400">
              {SW_CACHE_VERSION} → {nextCache}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={onUpdate} className="w-full">
            업데이트
          </Button>
          {!isStandalone && (
            <Button variant="ghost" onClick={onDismiss} className="w-full">
              나중에
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
