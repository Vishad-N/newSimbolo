import { cn } from "@/utils/utils";

interface ProgressBarProps {
  progress: number;
  label?: string;
  colorClass?: string;
  className?: string;
}

export function ProgressBar({ progress, label, colorClass = "bg-primary", className }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-400">{label}</span>
          <span className="text-xs font-bold text-white">{progress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
