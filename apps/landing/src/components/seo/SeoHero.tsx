"use client";

import Image from "next/image";
import { BarChart3, Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ServiceHero } from "@/components/shared/ServiceHero";

type SeoHeroProps = {
  benefits: string[];
};

const miniStats = [
  { label: "Keywords Ranked", value: "+320%" },
  { label: "Traffic Growth", value: "+180%" },
  { label: "Conversions", value: "+150%" },
];

function HeroChart() {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_78%,transparent)] p-5 shadow-[0_22px_52px_rgba(0,0,0,0.26)]">
      <div className="text-[0.88rem] font-bold text-white">Organic Traffic</div>
      <div className="mt-2 text-[2rem] font-black leading-none text-[var(--accent)]">+230%</div>
      <div className="mt-1 text-[0.75rem] text-white/70">vs last 6 months</div>
      <div className="relative mt-5 h-[116px]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-9 h-px bg-white/6" />
        <div className="absolute inset-x-0 bottom-[72px] h-px bg-white/6" />
        <div className="absolute inset-0 text-[var(--accent)]">
          <svg viewBox="0 0 310 116" className="h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="seoChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M5 106 L42 78 L76 80 L112 62 L150 76 L188 48 L224 58 L260 34 L286 29 L306 5 L306 116 L5 116 Z" fill="url(#seoChartGradient)" />
            <path d="M5 106 L42 78 L76 80 L112 62 L150 76 L188 48 L224 58 L260 34 L286 29 L306 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="absolute inset-x-2 bottom-[-2px] flex justify-between text-[0.64rem] font-semibold text-white/70">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative h-full min-h-[340px] w-full flex flex-col justify-between items-end pb-2">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-6 hidden h-[260px] w-[260px] rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/5 shadow-[0_0_70px_rgba(45,212,191,0.14)] md:block" />
        <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 5.4, ease: "easeInOut" }} className="absolute left-[6%] top-[10%] z-10 hidden h-[72px] w-[72px] place-items-center rounded-full border border-white/15 bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] text-[1.8rem] font-black text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] md:grid">
          G
        </motion.div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[66%] top-[8%] z-10 grid h-12 w-12 place-items-center rounded-full border border-[var(--accent)]/603535 bg-[var(--accent-glow)] text-[var(--accent)] shadow-[0_0_28px_var(--accent-glow)]">
          <BarChart3 className="h-5 w-5" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.9, ease: "easeInOut" }} className="absolute left-[79%] top-[20%] z-10 grid h-10 w-10 place-items-center rounded-full border border-[var(--secondary)]/30 bg-[var(--secondary)]/12 text-[var(--secondary)] shadow-[0_0_28px_rgba(45,212,191,0.18)]">
          <Search className="h-5 w-5" />
        </motion.div>
        <div className="absolute left-[18%] top-[12%] z-20 hidden md:block">
          <div className="search-glow grid h-[100px] w-[100px] rotate-[-28deg] place-items-center rounded-full border-[10px] border-[var(--secondary)]/45 bg-white/5 shadow-[0_0_42px_rgba(45,212,191,0.18)]">
            <div className="h-[60px] w-[60px] rounded-full border border-white/20 bg-[var(--background)]/70" />
          </div>
          <div className="ml-[72px] mt-[-14px] h-[75px] w-4 rotate-[-28deg] rounded-full bg-[var(--secondary)]/55 shadow-[0_0_24px_rgba(45,212,191,0.2)]" />
        </div>
      </div>
      <div className="relative w-[75%] min-w-[310px] origin-top-right mt-2 lg:scale-100 scale-95 pointer-events-auto">
        <HeroChart />
      </div>
      <div className="relative grid w-full max-w-[450px] grid-cols-3 gap-2 mt-4 pointer-events-auto">
        {miniStats.map((stat) => (
          <div key={stat.label} className="rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_78%,transparent)] p-3 shadow-[0_18px_42px_rgba(0,0,0,0.2)] flex flex-col justify-between">
            <div className="text-[0.68rem] font-bold text-white leading-tight">{stat.label}</div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[1.1rem] font-black leading-none text-[var(--accent)]">
              {stat.value}
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SeoHero({ benefits }: SeoHeroProps) {
  return (
    <ServiceHero
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "SEO" },
      ]}
      badge={{
        icon: Search,
        text: "SEO Services",
      }}
      title={
        <>
          Rank Higher. Get Found.
          <span className="block text-[var(--accent)]">
            Grow Faster.
          </span>
        </>
      }
      description="Data-driven SEO strategies that bring more traffic, leads, and revenue to your business."
      benefits={benefits}
      primaryCta={{
        text: "Get Free SEO Audit",
        href: "/contact?service=seo-audit",
      }}
      secondaryCta={{
        text: "Talk to Expert",
        href: "/contact?service=seo-expert",
      }}
      visual={<HeroVisual />}
    />
  );
}
