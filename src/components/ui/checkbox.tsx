import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/utils';

export function Checkbox({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={(v) => onCheckedChange(v === true)}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300',
        'data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white',
      )}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
