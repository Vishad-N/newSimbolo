"use client";

import Image from "next/image";
import { PlayCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import { ServiceHero } from "@/components/shared/ServiceHero";

type VideoEditingHeroProps = {
  benefits: string[];
};

function HeroStatsCard() {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_78%,transparent)] p-5 shadow-[0_22px_52px_rgba(0,0,0,0.26)]">
      <div className="text-[0.88rem] font-bold text-white">Why Videos Work?</div>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--accent)]">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[1.25rem] font-black text-white">95%</div>
          <div className="text-[0.7rem] text-white/70 leading-snug">people watch videos<br />to learn about products</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--accent)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
        </div>
        <div>
          <div className="text-[1.25rem] font-black text-white">85%</div>
          <div className="text-[0.7rem] text-white/70 leading-snug">increase in engagement<br />with video content</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--accent)]">
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
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative h-[340px] w-full">
      <div className="absolute inset-0 scale-[0.80] md:scale-[0.85] origin-top md:origin-right">
      <div className="absolute inset-0 md:-translate-x-[150px] transition-transform duration-500">
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
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.9, ease: "easeInOut" }} className="absolute left-[45%] top-[70%] z-30 grid h-16 w-16 place-items-center rounded-full border border-[var(--accent)]/603530 bg-[var(--primary)]/90 text-[#ffffff] shadow-[0_0_28px_rgba(var(--primary),0.4)]">
        <PlayCircle className="h-8 w-8" />
      </motion.div>
      </div>

      <div className="absolute right-0 top-0 w-full max-w-[280px] z-40">
        <HeroStatsCard />
      </div>
      </div>
    </motion.div>
  );
}

export function VideoEditingHero({ benefits }: VideoEditingHeroProps) {
  return (
    <ServiceHero
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "Video Editing" },
      ]}
      badge={{
        icon: PlayCircle,
        text: "PROFESSIONAL VIDEO EDITING SERVICES",
      }}
      title={
        <>
          Edit Videos That Captivate,
          <span className="block text-[var(--accent)]">
            Engage & Convert
          </span>
        </>
      }
      description="From Reels to YouTube videos, we edit with precision, creativity, and strategy to make your content stand out."
      benefits={benefits}
      primaryCta={{
        text: "Get Free Video Audit",
        href: "/contact?service=video-editing-audit",
      }}
      secondaryCta={{
        text: "Talk to Expert",
        href: "/contact?service=video-editing-expert",
      }}
      visual={<HeroVisual />}
    />
  );
}
