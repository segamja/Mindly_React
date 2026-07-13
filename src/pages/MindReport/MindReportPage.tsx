import { useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  EmotionChart,
  RecommendationCard,
  WeeklySummaryCard,
} from '@/components/mind-report/ReportCards';
import { generateWeeklyReport, saveWeeklyReport } from '@/services/reportService';
import { useMindlyStore } from '@/store/useMindlyStore';
import { isSupabaseConfigured } from '@/services/supabase/client';

export function MindReportPage() {
  const { userState } = useMindlyStore();

  const report = useMemo(() => generateWeeklyReport(userState), [userState]);

  useEffect(() => {
    void saveWeeklyReport(report);
  }, [report]);

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Mind Report</h1>
        <p className="text-sm text-slate-500">AI가 일주일 데이터를 분석한 심리 리포트</p>
        {!isSupabaseConfigured() && (
          <p className="mt-1 text-xs text-amber-600">
            Supabase 미연결 — localStorage 기반 분석 중
          </p>
        )}
      </div>

      <div className="space-y-4">
        <WeeklySummaryCard report={report} />
        <EmotionChart report={report} />
        <RecommendationCard report={report} />
      </div>
    </AppLayout>
  );
}
