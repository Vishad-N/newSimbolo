import { cn } from "@/utils/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
