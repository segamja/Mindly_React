import { APP_VERSION, SW_CACHE_VERSION } from '@/config/version';

interface VersionBadgeProps {
  standalone?: boolean;
  className?: string;
}

export function VersionBadge({ standalone, className = '' }: VersionBadgeProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500 ${className}`}
    >
      <span className="font-medium text-slate-600">Mindly v{APP_VERSION}</span>
      <span className="text-slate-300">·</span>
      <span>{SW_CACHE_VERSION}</span>
      {standalone && (
        <>
          <span className="text-slate-300">·</span>
          <span className="text-sky-600">설치된 앱</span>
        </>
      )}
    </div>
  );
}
