"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, MessageSquare, MonitorPlay, Code2, Globe } from "lucide-react";
import { motion } from "framer-motion";

type WebsiteDesignHeroProps = {
  benefits: string[];
};

function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative min-h-[500px]">
      <div className="absolute left-0 top-12 hidden h-[320px] w-[320px] rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/5 shadow-[0_0_70px_rgba(45,212,191,0.14)] md:block" />
      
      {/* Laptop / Main Screen */}
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[15%] top-[12%] z-20 hidden md:block w-[420px] h-[280px] rounded-[16px] overflow-hidden border-[4px] border-[#1e1e1e] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="h-4 bg-[#2d2d2d] w-full flex items-center px-2 gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
        <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" alt="Dashboard Preview" width={420} height={280} className="w-full h-full object-cover opacity-90" priority />
        <div className="absolute inset-0 bg-linear-to-tr from-[var(--primary)]/20 to-transparent" />
      </motion.div>

      {/* Mobile Screen */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }} className="absolute left-[65%] top-[25%] z-30 hidden md:block w-[140px] h-[280px] rounded-[24px] overflow-hidden border-[6px] border-[#1e1e1e] bg-black shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80" alt="Mobile Preview" width={140} height={280} className="w-full h-full object-cover opacity-90" />
      </motion.div>

      {/* Floating React Icon */}
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute left-[5%] top-[25%] z-40 hidden h-14 w-14 place-items-center rounded-2xl border border-[#61DAFB]/30 bg-[#20232a] text-[1.4rem] font-black text-[#61DAFB] shadow-[0_15px_30px_rgba(32,35,42,0.5)] md:grid">
        <Globe className="h-7 w-7" />
      </motion.div>
      
      {/* Floating Next.js Icon */}
      <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[55%] top-[5%] z-40 hidden h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] md:grid">
        <Code2 className="h-7 w-7" />
      </motion.div>

      <div className="absolute right-0 top-[60%] w-full max-w-[280px] z-40 hidden lg:block">
        <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_85%,transparent)] p-4 shadow-[0_22px_52px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="h-8 w-8 rounded-full bg-[var(--primary)]/20 grid place-items-center text-[var(--primary-light)]">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[0.75rem] text-white/70">Performance Score</div>
              <div className="text-[1rem] font-black text-white">99/100</div>
            </div>
          </div>
          <div className="pt-3">
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-[var(--primary-light)] w-[99%]" />
             </div>
             <div className="mt-2 flex justify-between text-[0.65rem] text-white/50">
               <span>LCP: 0.8s</span>
               <span>CLS: 0.01</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function WebsiteDesignHero({ benefits }: WebsiteDesignHeroProps) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
        <div className="mb-5 flex items-center gap-2 text-[0.78rem] font-medium text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#services" className="hover:text-white">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">Website Design</span>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] px-4 text-[0.78rem] font-black uppercase text-[var(--primary-light)] shadow-[0_0_24px_var(--primary-glow)]">
          <MonitorPlay className="h-4 w-4" />
          PROFESSIONAL WEBSITE DESIGN & DEVELOPMENT
        </div>
        <h1 className="mt-5 max-w-[650px] text-[clamp(2.35rem,5vw,3.8rem)] font-black leading-[1.05] tracking-normal text-white">
          Build Modern Websites That Convert 
          <span className="block text-[var(--primary-light)]">Visitors Into Customers</span>
        </h1>
        <p className="mt-5 max-w-[520px] text-[1rem] leading-7 text-white/84">Design and develop high-performance websites that are fast, responsive, SEO-friendly, and built for business growth.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-[0.84rem] font-semibold text-white/82">
              <Check className="h-4 w-4 rounded-full border border-[var(--primary)] text-[var(--primary-light)]" />
              {benefit}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/contact?service=website-design-audit" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] px-7 text-[0.92rem] font-black text-white shadow-[0_14px_30px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)]">
            Get Free Website Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact?service=website-design-expert" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] border border-[var(--primary)]/60 px-7 text-[0.92rem] font-black text-white transition duration-300 hover:bg-[var(--primary-glow)]">
            <MessageSquare className="h-4 w-4" />
            Talk to Expert
          </Link>
        </div>
      </motion.div>
      <HeroVisual />
    </section>
  );
}
