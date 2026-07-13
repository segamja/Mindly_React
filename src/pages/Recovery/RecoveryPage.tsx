import { AppLayout } from '@/components/layout/AppLayout';
import { RecoveryCard } from '@/components/RecoveryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMindlyStore } from '@/store/useMindlyStore';

export function RecoveryPage() {
  const { recoveryPlan, toggleRecoveryTask } = useMindlyStore();

  return (
    <AppLayout>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recovery Plan</CardTitle>
          <p className="text-sm text-slate-500">
            오늘의 회복 루틴을 완료해 Recovery Score를 높여보세요.
          </p>
        </CardHeader>
        <CardContent>
          <RecoveryCard plan={recoveryPlan} onToggle={(id) => void toggleRecoveryTask(id)} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
