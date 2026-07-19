"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { CampaignMetrics } from "@/components/metaAds/CampaignMetrics";

type MetaAdsHeroProps = {
  benefits: string[];
};

function MetaAdsMark() {
  return (
    <div className="relative h-[120px] w-[150px]">
      <div className="absolute left-12 top-0 h-[116px] w-9 rotate-[28deg] rounded-full bg-linear-to-b from-[#1877F2] to-[#E1306C] shadow-[0_0_26px_rgba(24,119,242,0.3)]" />
      <div className="absolute left-10 top-11 h-[92px] w-9 -rotate-[32deg] rounded-full bg-linear-to-b from-[var(--primary-light)] to-[var(--primary)] shadow-[0_0_26px_var(--primary-glow)]" />
      <div className="absolute bottom-0 left-0 h-10 w-10 rounded-full bg-[var(--primary)]" />
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative min-h-[410px]">
      <div className="absolute left-[4%] top-0 z-10 hidden md:block">
        <MetaAdsMark />
      </div>
      <motion.div animate={{ y: [0, -13, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[34%] top-[8%] z-20 h-[230px] w-[230px]">
        <Image src="/assets/logo1.png" alt="The Simbolo mascot" width={230} height={230} className="h-full w-full object-contain drop-shadow-[0_0_34px_rgba(24,119,242,0.24)]" priority />
      </motion.div>
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 4.8 }} className="absolute left-[23%] top-[28%] z-20 hidden h-[78px] w-[78px] rounded-full border-[10px] border-[#1877F2]/55 bg-[var(--background)]/50 shadow-[0_0_28px_rgba(24,119,242,0.2)] md:block" />
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute right-[12%] top-[24%] z-20 grid h-12 w-12 place-items-center rounded-[8px] border border-white/10 bg-[var(--surface)]/80 text-[#1877F2] font-bold text-xl">
        f
      </motion.div>
      <div className="absolute left-[28%] top-[67%] h-10 w-[250px] rounded-[50%] border border-[#E1306C]/25 bg-[#E1306C]/6 shadow-[0_0_30px_rgba(225,48,108,0.16)]" />
      <div className="absolute right-0 top-0 w-full max-w-[500px] translate-y-[285px] lg:translate-y-0">
        <CampaignMetrics />
      </div>
    </div>
  );
}

export function MetaAdsHero({ benefits }: MetaAdsHeroProps) {
  return (
    <section className="grid items-start gap-7 xl:grid-cols-[0.82fr_1.18fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
        <div className="mb-6 flex items-center gap-2 text-[0.78rem] font-medium text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#services" className="hover:text-white">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">Meta Ads</span>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] px-4 text-[0.78rem] font-black uppercase text-[var(--primary-light)] shadow-[0_0_24px_var(--primary-glow)]">
          <span className="text-white text-lg">✦</span>
          Meta Ads Services
        </div>
        <h1 className="mt-5 max-w-[660px] text-[clamp(2.1rem,4.3vw,3.75rem)] font-black leading-[1.06] tracking-normal text-white">
          Run Meta Ads That
          <span className="block"><span className="text-[var(--primary-light)]">Convert Clicks</span> into Customers</span>
        </h1>
        <p className="mt-5 max-w-[565px] text-[1rem] leading-7 text-white/82">Strategic campaigns. Laser-focused targeting. Higher ROAS. Maximum growth.</p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-[0.78rem] font-semibold text-white/82">
              <CheckCircle2 className="h-4 w-4 text-[var(--primary-light)]" />
              {benefit}
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-4 sm:flex-row">
          <Link href="/contact?service=meta-ads-audit" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] px-6 text-[0.88rem] font-black text-white shadow-[0_14px_30px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)]">
            Get Free Ad Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact?service=meta-ads-expert" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] border border-white/20 px-6 text-[0.88rem] font-black text-white transition duration-300 hover:bg-white/5 hover:border-white/30">
            <MessageSquare className="h-4 w-4" />
            Talk to Expert
          </Link>
        </div>
      </motion.div>
      <HeroArt />
    </section>
  );
}
