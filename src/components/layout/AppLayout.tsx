import { NavLink } from 'react-router-dom';
import {
  Brain,
  BookOpen,
  FileBarChart,
  Heart,
  Home,
  Library,
  Settings,
  Wind,
} from 'lucide-react';
import { cn } from '@/utils';

const TABS = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/coach', icon: Brain, label: 'AI' },
  { to: '/breathe', icon: Wind, label: '브리드' },
  { to: '/library', icon: Library, label: '라이브러리' },
  { to: '/journal', icon: BookOpen, label: '일기' },
  { to: '/report', icon: FileBarChart, label: '리포트' },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col bg-slate-50">
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
        <ul className="flex items-stretch justify-around px-1 py-2">
          {TABS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors',
                    isActive ? 'text-sky-600' : 'text-slate-400',
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function SettingsLink() {
  return (
    <NavLink
      to="/settings"
      className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
      aria-label="설정"
    >
      <Settings className="h-5 w-5" />
    </NavLink>
  );
}

export function StatBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function LevelUpModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
        <Heart className="mx-auto mb-3 h-10 w-10 text-amber-400" />
        <h2 className="text-xl font-bold text-slate-900">레벨 업!</h2>
        <p className="mt-2 text-sky-600">{title}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-sky-500 py-3 font-medium text-white hover:bg-sky-600"
        >
          축하합니다 🎉
        </button>
      </div>
    </div>
  );
}

export function XpToast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-4 z-[90] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}

export function OnboardingModal({ onSubmit }: { onSubmit: (name: string) => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">Mindly에 오신 것을 환영합니다</h2>
        <p className="mt-2 text-sm text-slate-500">닉네임을 입력해 주세요.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSubmit(String(fd.get('nickname') || ''));
          }}
          className="mt-4 space-y-3"
        >
          <input
            name="nickname"
            required
            maxLength={20}
            placeholder="닉네임"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 py-3 font-medium text-white hover:bg-sky-600"
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
