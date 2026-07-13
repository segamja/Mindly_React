import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeeklyReport } from '@/types';

export function WeeklySummaryCard({ report }: { report: WeeklyReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>이번 주 Mind Report</CardTitle>
        <p className="text-sm text-slate-500">{report.weekLabel}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-2xl">😊</p>
          <p className="text-xs text-slate-500">긍정적인 하루</p>
          <p className="text-lg font-bold text-emerald-700">{report.positiveDays}일</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3 text-center">
          <p className="text-2xl">😔</p>
          <p className="text-xs text-slate-500">스트레스 높았던 하루</p>
          <p className="text-lg font-bold text-rose-700">{report.stressDays}일</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmotionChart({ report }: { report: WeeklyReport }) {
  const maxEnergy = 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mind Energy 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-32 items-end justify-between gap-2">
          {report.moodLogs.map((log) => {
            const height = (log.mindEnergy / maxEnergy) * 100;
            const color =
              log.mood === 'positive'
                ? 'bg-emerald-400'
                : log.mood === 'stress'
                  ? 'bg-rose-400'
                  : 'bg-sky-300';
            return (
              <div key={log.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md ${color} transition-all`}
                  style={{ height: `${Math.max(8, height)}%` }}
                  title={`${log.date}: ${log.mindEnergy}%`}
                />
                <span className="text-[10px] text-slate-400">
                  {log.date.slice(5).replace('-', '/')}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecommendationCard({ report }: { report: WeeklyReport }) {
  return (
    <Card className="border-amber-100 bg-amber-50/50">
      <CardHeader>
        <CardTitle>AI 분석 & 추천</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-700">
        {report.patterns.map((p) => (
          <p key={p}>• {p}</p>
        ))}
        {report.insights.map((i) => (
          <p key={i} className="text-slate-600">
            {i}
          </p>
        ))}
        <div className="rounded-xl bg-white p-3">
          <p className="mb-2 font-medium text-amber-800">추천</p>
          {report.recommendations.map((r) => (
            <p key={r} className="text-slate-600">
              → {r}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
