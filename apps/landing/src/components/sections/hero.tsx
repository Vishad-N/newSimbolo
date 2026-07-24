"use client";

import Image from "next/image";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { categoryChips } from "@/data/landing";

export function Hero() {
  const [selectedChip, setSelectedChip] = useState(categoryChips[0]?.label ?? "");

  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-0 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-75">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.035),transparent_34rem)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_50%_10%,black,transparent_68%)]" />
        <div className="hero-mesh absolute left-[11%] top-[6%] h-72 w-72 rounded-full bg-[#10B981]/28 blur-[86px]" />
        <div className="absolute left-[48%] top-[18%] h-20 w-20 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[10%] top-[12%] h-28 w-28 rounded-full bg-white/5 blur-[64px]" />
        <div className="absolute left-[34%] top-[38%] h-1.5 w-1.5 rounded-full bg-white/30 shadow-[0_0_14px_rgba(255,255,255,0.14)]" />
        <div className="absolute right-[28%] top-[28%] h-1 w-1 rounded-full bg-white/35 shadow-[0_0_18px_rgba(255,255,255,0.22)]" />
      </div>
      <div className="relative mx-auto max-w-[1290px]">
        <div className="relative flex flex-col items-center justify-center lg:block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            className="relative mx-auto mb-6 h-[160px] w-[170px] sm:h-[180px] sm:w-[190px] lg:absolute lg:left-4 lg:top-[40%] lg:mb-0 lg:-translate-y-1/2 z-0"
          >
            <div className="absolute left-3 top-3 h-40 w-40 rounded-full bg-[#10B981]/34 blur-[54px]" />
            <div className="absolute bottom-4 left-5 h-6 w-32 rounded-full border border-[#34D399]/45 shadow-[0_0_20px_rgba(16,185,129,0.32)]" />
            <div className="absolute bottom-6 left-1 h-10 w-40 -rotate-[13deg] rounded-[50%] border border-[#34D399]/42" />
            <Image src="/assets/logo1.png" alt="The Simbolo mascot" fill sizes="190px" priority className="mascot-float object-contain drop-shadow-[0_0_32px_rgba(16,185,129,0.42)]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative z-10 w-full text-center mx-auto"
          >
            <div className="mx-auto mb-2 inline-flex h-7 items-center gap-2 rounded-full border border-[#22C55E] bg-[#22C55E]/12 px-4 text-[0.75rem] font-bold uppercase text-[#4ADE80] shadow-none backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 fill-[#4ADE80] text-[#4ADE80]" />
              AI-Powered Marketing Match
            </div>
            <h1 className="text-balance mx-auto max-w-[860px] font-heading text-[2.2rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[3.2rem] lg:text-[3.6rem]">
              Find the right <span className="bg-gradient-to-r from-[var(--hero-gradient-start)] via-[var(--hero-gradient-mid)] to-[var(--hero-gradient-end)] bg-clip-text text-transparent">Digital Marketing</span> Expert in seconds.
            </h1>
            <p className="mx-auto mt-1 max-w-[680px] text-[0.9rem] leading-6 text-[var(--muted)] sm:text-[0.95rem]">
              Tell us about your business. Get matched with the perfect marketing solution instantly.
            </p>
            <div className="search-glow mx-auto mt-3 flex max-w-[900px] flex-col gap-2 rounded-[20px] border border-white/[0.08] bg-[var(--sidebar)]/70 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition duration-300 focus-within:border-[var(--primary)] focus-within:shadow-[0_0_16px_var(--primary-glow),inset_0_1px_0_rgba(255,255,255,0.08)] sm:flex-row">
              <label className="flex min-h-12 flex-1 items-center gap-3 rounded-[16px] bg-white/[0.035] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 focus-within:bg-white/[0.055]">
                <Sparkles className="h-4 w-4 shrink-0 fill-[#4ADE80] text-[#4ADE80]" />
                <input
                  aria-label="Describe your marketing challenge"
                  className="w-full bg-transparent text-[0.85rem] font-medium text-[var(--text-primary)] outline-none placeholder:text-[#64748B]"
                  placeholder="Describe your business, industry, goals, budget or marketing challenge..."
                />
                <Mic className="h-5 w-5 shrink-0 text-[#2DD4BF]" />
              </label>
              <button className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[16px] bg-[var(--primary)] px-6 text-[0.95rem] font-heading font-semibold tracking-[0.2px] normal-case text-white shadow-[0_10px_24px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)] sm:w-[160px]">
                AI Search
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mx-auto mt-2 max-w-[960px]"
        >
          <p className="mb-1.5 px-2 text-center text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/42">Popular Services</p>
          <div className="flex flex-wrap justify-center gap-2">
            {categoryChips.map((chip) => {
              const isSelected = selectedChip === chip.label;

              return (
                <button
                  key={chip.label}
                  onClick={() => setSelectedChip(chip.label)}
                  className={`group relative inline-flex h-8 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full border px-2.5 text-[0.75rem] font-medium text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_var(--primary-glow)] lg:px-3 xl:text-[0.75rem] ${
                    isSelected
                      ? "scale-[1.025] border-[var(--primary)] bg-[var(--primary)]/20 text-white shadow-none"
                      : "border-white/[0.08] bg-white/[0.035] hover:border-[var(--primary)] hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="absolute inset-x-3 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#14B8A6]/70 to-transparent transition group-hover:scale-x-100" />
                  <chip.icon className={`h-4 w-4 shrink-0 transition ${isSelected ? "text-[#14B8A6]" : "text-[var(--muted)] group-hover:text-[#14B8A6]"}`} />
                  <span className="truncate whitespace-nowrap">{chip.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
