"use client";

import { Check } from "lucide-react";

export function FeatureItem({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3 text-[0.88rem] leading-[1.45] text-white">
      <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[3] text-[#B9FF00]" />
      <span>{label}</span>
    </li>
  );
}
