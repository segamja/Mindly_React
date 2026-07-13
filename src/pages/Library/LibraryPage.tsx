import { useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TRACKS } from '@/data/content';
import { useMindlyStore } from '@/store/useMindlyStore';
import { assetUrl } from '@/utils';
import { getLevelTitle, XP_REWARDS } from '@/utils/progress';

export function LibraryPage() {
  const { userState, addXp, toggleMusic, musicEnabled } = useMindlyStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track: (typeof TRACKS)[number]) => {
    if (userState.level < track.levelRequired) {
      alert(`Lv.${track.levelRequired} (${getLevelTitle(track.levelRequired)}) 이상 필요합니다.`);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    if (activeTrackId === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        void audio.play();
        setIsPlaying(true);
      }
      return;
    }

    if (!musicEnabled) toggleMusic();
    audio.src = assetUrl(track.src);
    void audio.play();
    setActiveTrackId(track.id);
    setIsPlaying(true);
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
          const active = activeTrackId === track.id && isPlaying;
          return (
            <li key={track.id}>
              <button
                onClick={() => playTrack(track)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  locked
                    ? 'border-slate-100 bg-slate-50 opacity-60'
                    : active
                      ? 'border-sky-300 bg-sky-50'
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
                    <span className="text-sky-500">{active ? '⏸' : '▶'}</span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Card className="mt-4">
        <CardContent className="py-3 text-center text-xs text-slate-400">
          트랙 클릭 시 재생 · 같은 트랙 다시 클릭 시 일시정지
        </CardContent>
      </Card>
    </AppLayout>
  );
}
