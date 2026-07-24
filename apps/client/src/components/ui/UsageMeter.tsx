import { cn } from "@/utils/utils";

interface UsageMeterProps {
  name: string;
  used: number;
  max: number;
  className?: string;
}

export function UsageMeter({ name, used, max, className }: UsageMeterProps) {
  const percentage = Math.min((used / max) * 100, 100);
  
  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-300">{name}</span>
        <span className="text-white font-medium text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">
          {used} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
