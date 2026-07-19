"use client";
import React from "react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

type Asset = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
};

type MarketingAssetsProps = {
  assets: Asset[];
};

export function MarketingAssets({ assets }: MarketingAssetsProps) {
  return (
    <SectionCard className="p-6 md:p-8 flex flex-col">
      <h2 className="text-[1.15rem] font-black text-white">Marketing Assets</h2>
      <p className="mt-1 text-[0.8rem] text-white/60">Get everything you need to promote The Simbolo.</p>
      
      <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4 flex-1">
        {assets.map((asset, index) => {
          const Icon = asset.icon;
          // Map accents to colors
          const colorMap: Record<string, string> = {
            pink: "text-pink-500 bg-pink-500/10 border-pink-500/20",
            blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
            green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          };
          const colorStyle = colorMap[asset.accent] || "text-[var(--primary)] bg-[var(--primary-glow)] border-[var(--primary)]/30";

          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center text-center rounded-[12px] border border-white/5 bg-[var(--background)]/40 p-4 transition hover:bg-[var(--background)]/60"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-[8px] border ${colorStyle}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-[0.85rem] font-bold text-white leading-tight">{asset.title}</h3>
              <p className="mt-1.5 text-[0.7rem] text-white/50 leading-snug">{asset.description}</p>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <Link href="/dashboard/affiliate/assets" className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--primary)]/50 bg-[var(--primary-glow)] text-[0.85rem] font-bold text-white transition hover:bg-[var(--primary)]/20">
          Access Marketing Assets
          <ArrowRight className="h-4 w-4 text-[var(--primary-light)]" />
        </Link>
      </div>
    </SectionCard>
  );
}
