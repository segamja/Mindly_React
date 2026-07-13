import { useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TRACKS } from '@/data/content';
import { useMindlyStore } from '@/store/useMindlyStore';
import { assetUrl } from '@/utils';
import { getLevelTitle, XP_REWARDS } from '@/utils/progress';

export function LibraryPage() {
  const { userState, addXp, toggleMusic } = useMindlyStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: (typeof TRACKS)[number]) => {
    if (userState.level < track.levelRequired) {
      alert(`Lv.${track.levelRequired} (${getLevelTitle(track.levelRequired)}) 이상 필요합니다.`);
      return;
    }
    toggleMusic();
    if (!audioRef.current) {
      audioRef.current = new Audio(assetUrl(track.src));
    } else {
      audioRef.current.src = assetUrl(track.src);
    }
    void audioRef.current.play();
    addXp(XP_REWARDS.audioPlay, track.title);
  };

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>콘텐츠 라이브러리</CardTitle>
          <p className="text-sm text-slate-500">내 레벨 Lv.{userState.level}</p>
        </CardHeader>
      </Card>

      <ul className="space-y-2">
        {TRACKS.map((track) => {
          const locked = userState.level < track.levelRequired;
          return (
            <li key={track.id}>
              <button
                onClick={() => playTrack(track)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  locked
                    ? 'border-slate-100 bg-slate-50 opacity-60'
                    : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{track.title}</p>
                    <p className="text-xs text-slate-400">{track.duration}</p>
                  </div>
                  {locked ? (
                    <span className="text-xs font-medium text-rose-500">Lv.{track.levelRequired}</span>
                  ) : (
                    <span className="text-sky-500">▶</span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Card className="mt-4">
        <CardContent className="py-3 text-center text-xs text-slate-400">
          트랙 클릭 시 음악 자동 ON + 재생
        </CardContent>
      </Card>
    </AppLayout>
  );
}
