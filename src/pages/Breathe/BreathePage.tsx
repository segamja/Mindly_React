import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GALLERY_IMAGES } from '@/data/content';
import { useMindlyStore } from '@/store/useMindlyStore';
import { assetUrl } from '@/utils';
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
    const timer = setInterval(() => {
      setGalleryIdx((i) => (i + 1) % GALLERY_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

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
        <img
          src={assetUrl(GALLERY_IMAGES[galleryIdx])}
          alt="힐링 이미지"
          className="h-48 w-full object-cover transition-opacity duration-500"
        />
        <CardContent className="py-3 text-center text-xs text-slate-400">
          힐링 갤러리 · 8초마다 전환
        </CardContent>
      </Card>
    </AppLayout>
  );
}
