import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_VERSION } from '@/config/version';
import { useMindlyStore } from '@/store/useMindlyStore';

export function SettingsPage() {
  const { nickname, setNickname, userState } = useMindlyStore();
  const [name, setName] = useState(nickname);

  return (
    <AppLayout>
      <h1 className="mb-4 text-xl font-bold">설정</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
          <Button onClick={() => setNickname(name)} className="w-full">
            닉네임 저장
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>Mindly_new v{APP_VERSION}</p>
          <p>React + Vite + TypeScript</p>
          <p>
            Lv.{userState.level} · {userState.xp} XP · Mind Energy {userState.mindEnergy}%
          </p>
          <a
            href="https://github.com/segamja/Mindly_React"
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 hover:underline"
          >
            GitHub
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-slate-500">
            <li>• Push Notification</li>
            <li>• Daily Goal</li>
            <li>• Theme (Dark/Light)</li>
            <li>• Language</li>
            <li>• Firebase 로그인</li>
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
