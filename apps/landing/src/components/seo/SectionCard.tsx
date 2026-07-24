import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_78%,transparent)] shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
