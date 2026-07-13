import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCustomScript, getPresetScript, PRESET_LIST } from '@/data/content';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { getLocalTrackById } from '@/services/media/localMusic';
import { useMindlyStore } from '@/store/useMindlyStore';
import type { PresetKey } from '@/types';
import { PRESET_BGM } from '@/utils/progress';

export function CoachPage() {
  const navigate = useNavigate();
  const { nickname, runAiScript, musicEnabled } = useMindlyStore();
  const { play } = useMediaPlayer();
  const [script, setScript] = useState('');
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPresetMusic = useCallback(
    async (preset: PresetKey) => {
      if (!musicEnabled) return;
      const track = getLocalTrackById(PRESET_BGM[preset]);
      if (track) await play(track);
    },
    [musicEnabled, play],
  );

  const typeText = useCallback((text: string, onComplete?: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setScript('');
    setTyping(true);
    setDone(false);
    let i = 0;

    const tick = () => {
      if (i < text.length) {
        setScript((s) => s + text[i]);
        i++;
        timerRef.current = setTimeout(tick, 20);
      } else {
        setTyping(false);
        setDone(true);
        onComplete?.();
      }
    };
    tick();
  }, []);

  const handlePreset = (key: PresetKey) => {
    const preset = getPresetScript(key);
    typeText(preset.script, () => {
      runAiScript(key, preset.label);
      void startPresetMusic(key);
    });
  };

  const handleCustom = () => {
    const text = generateCustomScript(customInput);
    typeText(text, () => {
      runAiScript('custom', customInput || '맞춤');
      void startPresetMusic('custom');
    });
  };

  if (!nickname) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="py-8 text-center text-slate-500">
            홈에서 닉네임을 먼저 설정해 주세요.
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>AI 스트레스 관리실</CardTitle>
          <p className="text-sm text-slate-500">
            안녕하세요, {nickname}님. 지금 상황을 선택하거나 직접 입력해 주세요.
          </p>
        </CardHeader>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {PRESET_LIST.map(({ key, label }) => (
          <Button
            key={key}
            variant="outline"
            disabled={typing}
            onClick={() => handlePreset(key)}
            className="h-auto whitespace-normal py-3 text-left"
          >
            {label}
          </Button>
        ))}
      </div>

      <Card className="mb-4">
        <CardContent className="space-y-3 pt-4">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="지금 어떤 상황인가요?"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-400"
            rows={3}
          />
          <Button onClick={handleCustom} disabled={typing} className="w-full">
            맞춤 코칭 생성
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>코칭 스크립트</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
            {script || '프리셋을 선택하거나 상황을 입력해 주세요.'}
            {typing && <span className="animate-pulse">|</span>}
          </pre>
          {done && (
            <Button className="mt-4 w-full" onClick={() => navigate('/breathe')}>
              브리드로 이동 →
            </Button>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
