import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { useMusic } from '@/hooks/useMusic';
import { useMindlyStore } from '@/store/useMindlyStore';
import { useMediaStore } from '@/store/useMediaStore';
import { EMOTION_LABELS, type EmotionCategory } from '@/types/media';
import { XP_REWARDS } from '@/utils/progress';

const CATEGORIES = Object.keys(EMOTION_LABELS) as EmotionCategory[];

function formatDuration(seconds: number): string {
  const min = Math.max(1, Math.round(seconds / 60));
  return `${min}분`;
}

export function LibraryPage() {
  const [category, setCategory] = useState<EmotionCategory>('stress');
  const { music, loading, error } = useMusic(category);
  const { addXp, toggleMusic, musicEnabled } = useMindlyStore();
  const { currentMusic, isPlaying } = useMediaStore();
  const { play } = useMediaPlayer();

  const playTrack = async (index: number) => {
    const track = music[index];
    if (!track) return;
    if (!musicEnabled) toggleMusic();
    await play(track, category);
    addXp(XP_REWARDS.audioPlay, track.title);
  };

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>힐링 라이브러리</CardTitle>
          <p className="text-sm text-slate-500">AI 감정 기반 · 외부 API + 캐시</p>
        </CardHeader>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((key) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              category === key
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-sky-50'
            }`}
          >
            {EMOTION_LABELS[key]}
          </button>
        ))}
      </div>

      {loading && (
        <Card className="mb-4">
          <CardContent className="py-6 text-center text-sm text-slate-500">
            {EMOTION_LABELS[category]} 플레이리스트 불러오는 중…
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="py-4 text-center text-sm text-amber-800">
            API 연결 실패 — 오프라인 기본 음악을 사용합니다.
          </CardContent>
        </Card>
      )}

      <ul className="space-y-2">
        {music.map((track, index) => {
          const active = isPlaying && currentMusic?.id === track.id;
          return (
            <li key={track.id}>
              <button
                onClick={() => void playTrack(index)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-sky-300 bg-sky-50'
                    : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-800">{track.title}</p>
                    <p className="text-xs text-slate-400">
                      {formatDuration(track.duration)} · {track.tags.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <span className="text-sky-500">{active ? '⏸' : '▶'}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Card className="mt-4">
        <CardContent className="py-3 text-center text-xs text-slate-400">
          Cache → Serverless API → 기본 리소스 순으로 제공됩니다.
        </CardContent>
      </Card>
    </AppLayout>
  );
}
