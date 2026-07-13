import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import type { RecoveryPlan } from '@/types';

interface RecoveryCardProps {
  plan: RecoveryPlan;
  onToggle: (taskId: string) => void;
}

export function RecoveryCard({ plan, onToggle }: RecoveryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Recovery Plan</CardTitle>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Recovery</span>
          <span className="font-semibold text-sky-600">{plan.score}%</span>
        </div>
        <Progress value={plan.score} />
      </CardHeader>
      <CardContent>
        <RecoveryChecklist plan={plan} onToggle={onToggle} />
      </CardContent>
    </Card>
  );
}

export function RecoveryChecklist({ plan, onToggle }: RecoveryCardProps) {
  return (
    <ul className="space-y-3">
      {plan.tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-3">
          <Checkbox
            id={task.id}
            checked={task.done}
            onCheckedChange={() => onToggle(task.id)}
          />
          <label
            htmlFor={task.id}
            className={`text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}
          >
            {task.label}
          </label>
        </li>
      ))}
    </ul>
  );
}
