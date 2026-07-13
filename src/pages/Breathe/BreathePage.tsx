import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useImages } from '@/hooks/useImages';
import { useMindlyStore } from '@/store/useMindlyStore';
import { PRESET_EMOTION } from '@/types/media';
import { BREATHE_RECOMMENDATIONS } from '@/utils/progress';

const PHASES = [
  { label: '들이쉬기', duration: 4000, scale: 1.3 },
  { label: '멈추기', duration: 2000, scale: 1.0 },
  { label: '내쉬기', duration: 4000, scale: 0.7 },
] as const;

export function BreathePage() {
  const { userState, completeMission } = useMindlyStore();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [cycles, setCycles] = useState(0);

  const preset = userState.lastPreset || 'default';
  const recommendation = BREATHE_RECOMMENDATIONS[preset] ?? BREATHE_RECOMMENDATIONS.default;
  const emotion =
    preset === 'default' ? 'relax' : PRESET_EMOTION[preset as keyof typeof PRESET_EMOTION];
  const { images, loading } = useImages(emotion);

  useEffect(() => {
    const phase = PHASES[phaseIdx];
    const timer = setTimeout(() => {
      const next = (phaseIdx + 1) % PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
    }, phase.duration);
    return () => clearTimeout(timer);
  }, [phaseIdx]);

  useEffect(() => {
    if (cycles >= 3) completeMission('breathe');
  }, [cycles, completeMission]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setGalleryIdx((i) => (i + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [images.length]);

  const currentImage = images[galleryIdx] ?? images[0];
  const phase = PHASES[phaseIdx];

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>오피스 브리드</CardTitle>
          <p className="text-sm text-slate-500">{recommendation}</p>
        </CardHeader>
      </Card>

      <div className="mb-6 flex flex-col items-center py-8">
        <div
          className="flex h-40 w-40 items-center justify-center rounded-full bg-sky-200/60 text-lg font-semibold text-sky-800 transition-transform duration-1000"
          style={{ transform: `scale(${phase.scale})` }}
        >
          {phase.label}
        </div>
        <p className="mt-4 text-sm text-slate-500">4-2-4 호흡 · {cycles}회 완료</p>
      </div>

      <Card className="overflow-hidden">
        {loading || !currentImage ? (
          <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-400">
            힐링 이미지 불러오는 중…
          </div>
        ) : (
          <img
            src={currentImage.url}
            alt="힐링 이미지"
            className="h-48 w-full object-cover transition-opacity duration-500"
          />
        )}
        <CardContent className="py-3 text-center text-xs text-slate-400">
          {currentImage ? `Photo by ${currentImage.author} · 8초마다 전환` : 'AI 감정 기반 갤러리'}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
