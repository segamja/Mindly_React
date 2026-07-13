import { Button } from '@/components/ui/button';
import { APP_VERSION, SW_CACHE_VERSION } from '@/config/version';

interface PwaUpdateModalProps {
  open: boolean;
  isStandalone: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function PwaUpdateModal({ open, isStandalone, onUpdate, onDismiss }: PwaUpdateModalProps) {
  if (!open) return null;

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
            Mindly v{APP_VERSION} 업데이트가 준비되었습니다.
            {isStandalone ? ' 앱을 최신 상태로 유지하려면 업데이트해 주세요.' : ' 새로고침하면 적용됩니다.'}
          </p>
          <p className="mt-1 text-xs text-slate-400">캐시: {SW_CACHE_VERSION}</p>
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
