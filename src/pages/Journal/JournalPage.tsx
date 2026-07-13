import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMindlyStore } from '@/store/useMindlyStore';
import { formatDateLabel, getTodayString } from '@/utils';

export function JournalPage() {
  const { userState, saveJournal } = useMindlyStore();
  const today = getTodayString();
  const todayEntry = userState.gratitudeJournal.find((e) => e.date === today);
  const [text, setText] = useState(todayEntry?.text ?? '');
  const [status, setStatus] = useState('');

  const handleSave = () => {
    const isNew = saveJournal(text);
    setStatus(isNew ? '저장 완료! +20 XP' : '수정 완료!');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>감사일기</CardTitle>
          <p className="text-sm text-slate-500">오늘 감사한 일을 적어 보세요.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="오늘 감사했던 일..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-400"
            rows={5}
          />
          <Button onClick={handleSave} className="w-full">
            저장
          </Button>
          {status && <p className="text-center text-sm text-sky-600">{status}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>히스토리</CardTitle>
        </CardHeader>
        <CardContent>
          {userState.gratitudeJournal.length === 0 ? (
            <p className="text-sm text-slate-400">아직 작성한 감사일기가 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {[...userState.gratitudeJournal].reverse().map((entry) => (
                <li key={entry.date} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">{formatDateLabel(entry.date)}</p>
                  <p className="mt-1 text-sm text-slate-700">{entry.text}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
