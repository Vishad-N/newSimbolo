"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Link as LinkIcon, BadgePercent, Users, DollarSign, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type AffiliateHeroProps = {
  benefits: string[];
};

function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative min-h-[500px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden h-[400px] w-[400px] rounded-full bg-[var(--primary)]/5 blur-[120px] md:block" />
      
      {/* Floating Mascot (Simulated with image) */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[20%] top-[10%] z-30 hidden md:flex items-center justify-center w-[200px] h-[200px] rounded-full border border-[var(--primary)]/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <div className="relative w-full h-full rounded-full overflow-hidden p-2 bg-[var(--surface)]">
            <Image src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80" alt="Affiliate Mascot" width={200} height={200} className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="absolute -bottom-6 w-32 h-6 bg-[var(--primary)]/30 rounded-full blur-[10px]" />
      </motion.div>

      {/* Floating Dollar Icon */}
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute left-[10%] top-[5%] z-40 hidden h-14 w-14 place-items-center rounded-full border border-[#CBFF3B]/30 bg-[#162A00] text-[var(--primary)] shadow-[0_15px_30px_rgba(22,42,0,0.5)] md:grid">
        <DollarSign className="h-6 w-6" />
      </motion.div>
      
      {/* Floating Link Icon */}
      <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[12%] top-[40%] z-40 hidden h-12 w-12 place-items-center rounded-full border border-[#D946EF]/30 bg-[#3B0764] text-[#D946EF] shadow-[0_15px_30px_rgba(59,7,100,0.5)] md:grid">
        <LinkIcon className="h-5 w-5" />
      </motion.div>

      {/* Floating Users Icon */}
      <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }} className="absolute left-[45%] top-[55%] z-40 hidden h-14 w-14 place-items-center rounded-full border border-[#3B82F6]/30 bg-[#1E3A8A] text-[#3B82F6] shadow-[0_15px_30px_rgba(30,58,138,0.5)] md:grid">
        <Users className="h-6 w-6" />
      </motion.div>
      
      {/* Growth Chart Icon */}
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute right-[30%] top-[10%] z-20 hidden md:block">
        <ArrowUpRight className="h-16 w-16 text-[var(--primary)] opacity-40" strokeWidth={3} />
      </motion.div>

      {/* Earning Potential Card */}
      <div className="absolute right-0 top-[20%] w-full max-w-[320px] z-40 hidden lg:block">
        <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[var(--surface)] p-6 shadow-[0_22px_52px_rgba(0,0,0,0.5)]">
          <h3 className="text-[1rem] font-bold text-white relative">Your Earning Potential</h3>
          
          <div className="mt-4 pb-4 border-b border-white/10">
            <div className="text-[0.8rem] text-white/60 mb-1">Earn Up To</div>
            <div className="text-[2.2rem] font-black text-white leading-none">₹25,000+</div>
            <div className="text-[0.8rem] text-white/60 mt-1">Per Successful Referral</div>
          </div>
          
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-[0.8rem] text-white/80">
              <Check className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              Earn on Every Successful Sale
            </li>
            <li className="flex items-center gap-2 text-[0.8rem] text-white/80">
              <Check className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              30 Days Cookie Duration
            </li>
            <li className="flex items-center gap-2 text-[0.8rem] text-white/80">
              <Check className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              No Limit on Earnings
            </li>
            <li className="flex items-center gap-2 text-[0.8rem] text-white/80">
              <Check className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              Marketing Materials Provided
            </li>
            <li className="flex items-center gap-2 text-[0.8rem] text-white/80">
              <Check className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              Dedicated Affiliate Support
            </li>
          </ul>

          <Link href="/contact?type=affiliate" className="relative mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] text-[0.9rem] font-bold text-black transition hover:bg-[var(--primary-hover)]">
            Join Now for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function AffiliateHero({ benefits }: AffiliateHeroProps) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
        <div className="mb-5 flex items-center gap-2 text-[0.78rem] font-medium text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white">Affiliate Program</span>
        </div>
        <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] px-4 text-[0.78rem] font-black uppercase text-[var(--primary-light)] shadow-[0_0_24px_var(--primary-glow)]">
          <BadgePercent className="h-4 w-4" />
          JOIN SIMBOLO AFFILIATE PROGRAM
        </div>
        <h1 className="mt-5 max-w-[650px] text-[clamp(2.35rem,5vw,3.8rem)] font-black leading-[1.05] tracking-normal text-white">
          Earn More by Referring <span className="text-[var(--primary)] block">Digital Success.</span>
        </h1>
        <p className="mt-5 max-w-[520px] text-[1rem] leading-7 text-white/84">Join our affiliate program and earn attractive commissions by referring businesses to The Simbolo&apos;s digital marketing services.</p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-[0.84rem] font-medium text-white/80 border border-white/10 rounded-full px-4 py-1.5 bg-white/5">
              <Check className="h-4 w-4 text-[var(--primary)]" />
              {benefit}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/contact?type=affiliate" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] px-7 text-[0.92rem] font-black text-black shadow-[0_14px_30px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)]">
            Join Affiliate Program
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] border border-white/15 px-7 text-[0.92rem] font-black text-white transition duration-300 hover:bg-white/5">
            <LinkIcon className="h-4 w-4" />
            Login to Dashboard
          </Link>
        </div>
      </motion.div>
      <HeroVisual />
    </section>
  );
}
