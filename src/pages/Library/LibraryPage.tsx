import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TRACKS } from '@/data/content';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { getLocalTrackById } from '@/services/media/localMusic';
import { useMindlyStore } from '@/store/useMindlyStore';
import { useMediaStore } from '@/store/useMediaStore';
import { XP_REWARDS, getLevelTitle } from '@/utils/progress';

export function LibraryPage() {
  const { userState, addXp, toggleMusic, musicEnabled } = useMindlyStore();
  const { currentMusic, isPlaying } = useMediaStore();
  const { play } = useMediaPlayer();

  const playTrack = async (trackId: (typeof TRACKS)[number]['id']) => {
    const meta = TRACKS.find((t) => t.id === trackId);
    if (!meta) return;

    if (userState.level < meta.levelRequired) {
      alert(`Lv.${meta.levelRequired} (${getLevelTitle(meta.levelRequired)}) 이상 필요합니다.`);
      return;
    }

    const track = getLocalTrackById(trackId);
    if (!track) return;

    if (!musicEnabled) toggleMusic();

    try {
      await play(track);
      addXp(XP_REWARDS.audioPlay, track.title);
    } catch {
      alert('음악을 재생할 수 없습니다.');
    }
  };

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>콘텐츠 라이브러리</CardTitle>
          <p className="text-sm text-slate-500">로컬 MP3 · 내 레벨 Lv.{userState.level}</p>
        </CardHeader>
      </Card>

      <ul className="space-y-2">
        {TRACKS.map((track) => {
          const locked = userState.level < track.levelRequired;
          const active = isPlaying && currentMusic?.id === track.id;
          return (
            <li key={track.id}>
              <button
                onClick={() => void playTrack(track.id)}
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
          트랙 클릭 시 음악 자동 ON + 재생
        </CardContent>
      </Card>
    </AppLayout>
  );
}
