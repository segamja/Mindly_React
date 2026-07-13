import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CompanionMessage } from '@/types';

interface CompanionCardProps {
  message: CompanionMessage;
}

export function CompanionCard({ message }: CompanionCardProps) {
  return (
    <Card className="border-sky-100 bg-gradient-to-br from-sky-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sky-800">
          <span className="text-xl">{message.emoji}</span>
          Mindly Message
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium text-slate-800">{message.greeting}</p>
        <p className="text-sm leading-relaxed text-slate-600">{message.suggestion}</p>
      </CardContent>
    </Card>
  );
}
