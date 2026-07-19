"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, MessageSquare, PlayCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

type VideoEditingHeroProps = {
  benefits: string[];
};

function HeroStatsCard() {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_78%,transparent)] p-5 shadow-[0_22px_52px_rgba(0,0,0,0.26)]">
      <div className="text-[0.88rem] font-bold text-white">Why Videos Work?</div>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)]">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[1.25rem] font-black text-white">95%</div>
          <div className="text-[0.7rem] text-white/70 leading-snug">people watch videos<br />to learn about products</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
        </div>
        <div>
          <div className="text-[1.25rem] font-black text-white">85%</div>
          <div className="text-[0.7rem] text-white/70 leading-snug">increase in engagement<br />with video content</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
        </div>
        <div>
          <div className="text-[1.25rem] font-black text-white">2X</div>
          <div className="text-[0.7rem] text-white/70 leading-snug">more conversions<br />than image post</div>
        </div>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative min-h-[505px]">
      <div className="absolute left-0 top-12 hidden h-[320px] w-[320px] rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/5 shadow-[0_0_70px_rgba(45,212,191,0.14)] md:block" />
      
      {/* Main Image */}
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[10%] top-[10%] z-20 hidden md:block w-[480px] h-[320px] rounded-[12px] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
        <Image src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80" alt="Video Editing Workstation" width={480} height={320} className="w-full h-full object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </motion.div>

      {/* Premiere Icon */}
      <motion.div animate={{ y: [0, -14, 0], rotate: [-2, 3, -2] }} transition={{ repeat: Infinity, duration: 5.4, ease: "easeInOut" }} className="absolute left-[8%] top-[55%] z-30 hidden h-14 w-14 place-items-center rounded-[12px] border border-[#e2bbfd]/30 bg-[#2a0b3c] text-[1.4rem] font-black text-[#e2bbfd] shadow-[0_15px_30px_rgba(42,11,60,0.5)] md:grid">
        Pr
      </motion.div>
      
      {/* After Effects Icon */}
      <motion.div animate={{ y: [0, 12, 0], rotate: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[60%] top-[5%] z-30 hidden h-14 w-14 place-items-center rounded-[12px] border border-[#b0baff]/30 bg-[#161b36] text-[1.4rem] font-black text-[#b0baff] shadow-[0_15px_30px_rgba(22,27,54,0.5)] md:grid">
        Ae
      </motion.div>

      {/* Floating Play Button */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.9, ease: "easeInOut" }} className="absolute left-[45%] top-[70%] z-30 grid h-16 w-16 place-items-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/90 text-white shadow-[0_0_28px_rgba(var(--primary),0.4)]">
        <PlayCircle className="h-8 w-8" />
      </motion.div>

      <div className="absolute right-0 top-0 w-full max-w-[280px] z-40">
        <HeroStatsCard />
      </div>
    </motion.div>
  );
}

export function VideoEditingHero({ benefits }: VideoEditingHeroProps) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
        <div className="mb-5 flex items-center gap-2 text-[0.78rem] font-medium text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#services" className="hover:text-white">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">Video Editing</span>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] px-4 text-[0.78rem] font-black uppercase text-[var(--primary-light)] shadow-[0_0_24px_var(--primary-glow)]">
          <PlayCircle className="h-4 w-4" />
          PROFESSIONAL VIDEO EDITING SERVICES
        </div>
        <h1 className="mt-5 max-w-[650px] text-[clamp(2.35rem,5vw,4rem)] font-black leading-[1.05] tracking-normal text-white">
          Edit Videos That Captivate,
          <span className="block text-[var(--primary-light)]">Engage & Convert</span>
        </h1>
        <p className="mt-5 max-w-[520px] text-[1.02rem] leading-7 text-white/84">From Reels to YouTube videos, we edit with precision, creativity, and strategy to make your content stand out.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-[0.84rem] font-semibold text-white/82">
              <Check className="h-4 w-4 rounded-full border border-[var(--primary)] text-[var(--primary-light)]" />
              {benefit}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/contact?service=video-editing-audit" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] px-7 text-[0.92rem] font-black text-white shadow-[0_14px_30px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)]">
            Get Free Video Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact?service=video-editing-expert" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] border border-[var(--primary)]/60 px-7 text-[0.92rem] font-black text-white transition duration-300 hover:bg-[var(--primary-glow)]">
            <MessageSquare className="h-4 w-4" />
            Talk to Expert
          </Link>
        </div>
      </motion.div>
      <HeroVisual />
    </section>
  );
}
