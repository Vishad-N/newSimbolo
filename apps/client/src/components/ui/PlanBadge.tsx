import { cn } from "@/utils/utils";

interface PlanBadgeProps {
  planName: string;
  className?: string;
}

export function PlanBadge({ planName, className }: PlanBadgeProps) {
  // Simple mapping to give different plans different colors
  const colorClass = 
    planName.toLowerCase().includes('enterprise') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
    planName.toLowerCase().includes('growth') ? 'bg-primary/10 text-primary border-primary/20' :
    'bg-blue-500/10 text-blue-400 border-blue-500/20';

  return (
    <span className={cn("inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-full border", colorClass, className)}>
      {planName}
    </span>
  );
}
