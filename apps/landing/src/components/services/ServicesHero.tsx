"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Search, BarChart3, Megaphone, MonitorPlay } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-8 lg:px-10 lg:pt-12 font-body">
      <div className="pointer-events-none absolute inset-0 opacity-75">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--primary)_6%,transparent),transparent_40rem)]" />
        <div className="absolute left-[15%] top-[10%] h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-[86px]" />
        <div className="absolute right-[10%] top-[20%] h-48 w-48 rounded-full bg-[#10B981]/10 blur-[64px]" />
      </div>

      <div className="relative mx-auto max-w-[1290px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_450px] items-center">
          
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/50 bg-[var(--primary)]/10 px-4 py-1.5 text-[0.85rem] font-bold uppercase text-[var(--accent)]">
              <Sparkles className="h-4 w-4" />
              Complete Digital Solutions
            </div>
            <h1 className="text-balance font-heading text-[2.2rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[3rem] lg:text-[3.2rem]">
              Everything Your Business Needs to <span className="bg-gradient-to-r from-[var(--hero-gradient-start)] via-[var(--hero-gradient-mid)] to-[var(--hero-gradient-end)] bg-clip-text text-transparent">Grow Online</span>
            </h1>
            <p className="mt-4 max-w-[640px] font-body text-[1rem] leading-6 text-[var(--muted)]">
              We provide end-to-end digital growth solutions including marketing, web development, e-commerce, AI-powered strategies, creative services, and business consulting.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href="#goal-selector" className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] px-6 text-[0.9rem] font-bold text-[#ffffff] transition duration-300 hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)]">
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/5 px-6 text-[0.9rem] font-bold text-white transition duration-300 hover:bg-white/10">
                Talk To Expert
              </Link>
            </div>
          </motion.div>

          {/* Right Illustration Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto h-[320px] w-full max-w-[380px]"
          >
            <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 bg-[var(--surface)] shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
            <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40" />
            
            <Image src="/assets/logo1.png" alt="The Simbolo Mascot" width={180} height={180} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mascot-float drop-shadow-[0_0_32px_var(--primary-glow)]" />

            {/* Floating Icons */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute left-0 top-[10%] grid h-12 w-12 place-items-center rounded-full border border-[#2DD4BF]/30 bg-[#0B2A26] text-[#2DD4BF] shadow-[0_15px_30px_rgba(45,212,191,0.2)]">
              <Search className="h-5 w-5" />
            </motion.div>
            
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute right-0 top-[15%] grid h-14 w-14 place-items-center rounded-full border border-[#3B82F6]/30 bg-[#1E3A8A] text-[#3B82F6] shadow-[0_15px_30px_rgba(59,130,246,0.2)]">
              <BarChart3 className="h-6 w-6" />
            </motion.div>

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute -left-2 bottom-[20%] grid h-10 w-10 place-items-center rounded-full border border-[#F43F5E]/30 bg-[#881337] text-[#F43F5E] shadow-[0_15px_30px_rgba(244,63,94,0.2)]">
              <Megaphone className="h-4 w-4" />
            </motion.div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }} className="absolute right-[5%] bottom-[10%] grid h-12 w-12 place-items-center rounded-full border border-[#A855F7]/30 bg-[#4C1D95] text-[#A855F7] shadow-[0_15px_30px_rgba(168,85,247,0.2)]">
              <MonitorPlay className="h-5 w-5" />
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
