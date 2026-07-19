"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Check, ChevronRight, MessageSquare, Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="mt-2 text-[2rem] font-black leading-none text-[var(--primary-light)]">+230%</div>
      <div className="mt-1 text-[0.75rem] text-white/70">vs last 6 months</div>
      <div className="relative mt-5 h-[116px]">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-9 h-px bg-white/6" />
        <div className="absolute inset-x-0 bottom-[72px] h-px bg-white/6" />
        <div className="absolute bottom-0 left-0 h-[92px] w-full bg-linear-to-t from-[var(--primary)]/30 to-transparent [clip-path:polygon(0_92%,12%_70%,24%_72%,36%_55%,49%_68%,61%_43%,72%_51%,84%_31%,92%_26%,100%_0,100%_100%,0_100%)]" />
        <div className="absolute inset-0 text-[var(--primary-light)]">
          <svg viewBox="0 0 310 116" className="h-full w-full overflow-visible" aria-hidden="true">
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
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative min-h-[505px]">
      <div className="absolute left-0 top-12 hidden h-[320px] w-[320px] rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/5 shadow-[0_0_70px_rgba(45,212,191,0.14)] md:block" />
      <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 5.4, ease: "easeInOut" }} className="absolute left-[6%] top-[18%] z-10 hidden h-[92px] w-[92px] place-items-center rounded-full border border-white/15 bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] text-[2.3rem] font-black text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] md:grid">
        G
      </motion.div>
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[66%] top-[16%] z-10 grid h-15 w-15 place-items-center rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] text-[var(--primary-light)] shadow-[0_0_28px_var(--primary-glow)]">
        <BarChart3 className="h-7 w-7" />
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.9, ease: "easeInOut" }} className="absolute left-[79%] top-[31%] z-10 grid h-13 w-13 place-items-center rounded-full border border-[var(--secondary)]/30 bg-[var(--secondary)]/12 text-[var(--secondary)] shadow-[0_0_28px_rgba(45,212,191,0.18)]">
        <Search className="h-6 w-6" />
      </motion.div>
      <div className="absolute left-[18%] top-[24%] z-20 hidden md:block">
        <div className="search-glow grid h-[120px] w-[120px] rotate-[-28deg] place-items-center rounded-full border-[12px] border-[var(--secondary)]/45 bg-white/5 shadow-[0_0_42px_rgba(45,212,191,0.18)]">
          <div className="h-[72px] w-[72px] rounded-full border border-white/20 bg-[var(--background)]/70" />
        </div>
        <div className="ml-[88px] mt-[-18px] h-[90px] w-5 rotate-[-28deg] rounded-full bg-[var(--secondary)]/55 shadow-[0_0_24px_rgba(45,212,191,0.2)]" />
      </div>
      <motion.div animate={{ y: [0, -16, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[34%] top-[24%] z-20 grid h-[220px] w-[220px] place-items-center rounded-full">
        <Image src="/assets/logo1.png" alt="The Simbolo mascot" width={220} height={220} className="h-full w-full object-contain drop-shadow-[0_0_34px_rgba(45,212,191,0.25)]" priority />
      </motion.div>
      <div className="absolute left-[31%] top-[69%] h-10 w-[245px] rounded-[50%] border border-[var(--secondary)]/30 bg-[var(--secondary)]/6 shadow-[0_0_30px_rgba(45,212,191,0.16)]" />
      <div className="absolute right-0 top-0 w-[53%] min-w-[330px]">
        <HeroChart />
      </div>
      <div className="absolute bottom-10 right-0 grid w-full grid-cols-3 gap-3 md:w-[64%]">
        {miniStats.map((stat) => (
          <div key={stat.label} className="rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_78%,transparent)] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
            <div className="text-[0.72rem] font-bold text-white">{stat.label}</div>
            <div className="mt-2 flex items-center gap-2 text-[1.45rem] font-black leading-none text-[var(--primary-light)]">
              {stat.value}
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SeoHero({ benefits }: SeoHeroProps) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
        <div className="mb-5 flex items-center gap-2 text-[0.78rem] font-medium text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#services" className="hover:text-white">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">SEO</span>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] px-4 text-[0.78rem] font-black uppercase text-[var(--primary-light)] shadow-[0_0_24px_var(--primary-glow)]">
          <Search className="h-4 w-4" />
          SEO Services
        </div>
        <h1 className="mt-5 max-w-[650px] text-[clamp(2.35rem,5vw,4.4rem)] font-black leading-[0.96] tracking-normal text-white">
          Rank Higher. Get Found.
          <span className="block text-[var(--primary-light)]">Grow Faster.</span>
        </h1>
        <p className="mt-5 max-w-[520px] text-[1.02rem] leading-7 text-white/84">Data-driven SEO strategies that bring more traffic, leads, and revenue to your business.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-[0.84rem] font-semibold text-white/82">
              <Check className="h-4 w-4 rounded-full border border-[var(--primary)] text-[var(--primary-light)]" />
              {benefit}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/contact?service=seo-audit" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] px-7 text-[0.92rem] font-black text-white shadow-[0_14px_30px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)]">
            Get Free SEO Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact?service=seo-expert" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] border border-[var(--primary)]/60 px-7 text-[0.92rem] font-black text-white transition duration-300 hover:bg-[var(--primary-glow)]">
            <MessageSquare className="h-4 w-4" />
            Talk to Expert
          </Link>
        </div>
      </motion.div>
      <HeroVisual />
    </section>
  );
}
