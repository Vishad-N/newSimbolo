"use client";

import Image from "next/image";
import { SectionCard } from "@/components/seo/SectionCard";

type Tool = {
  id: string;
  name: string;
  shortName?: string;
  iconUrl?: string;
  color: string;
  bgColor: string;
};

type ToolsWeUseProps = {
  tools: Tool[];
};

export function ToolsWeUse({ tools }: ToolsWeUseProps) {
  return (
    <SectionCard className="p-5 h-full">
      <h2 className="text-[1.15rem] font-black text-white mb-6">Tools We Use</h2>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <div key={tool.id} className="flex flex-col items-center gap-2">
            <div
              className="grid h-[52px] w-[52px] place-items-center rounded-[10px] border shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1"
              style={{ backgroundColor: tool.bgColor, borderColor: `${tool.color}30` }}
              title={tool.name}
            >
              {tool.iconUrl ? (
                <Image src={tool.iconUrl} alt={tool.name} width={28} height={28} className="object-contain" />
              ) : (
                <span className="text-[1.3rem] font-black" style={{ color: tool.color }}>
                  {tool.shortName}
                </span>
              )}
            </div>
            <span className="text-[0.6rem] font-medium text-white/60">{tool.name}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
