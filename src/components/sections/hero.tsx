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
        <div className="grid items-center gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            className="relative mx-auto h-[205px] w-[215px] sm:h-[238px] sm:w-[248px] lg:mx-0 lg:translate-x-7"
          >
            <div className="absolute left-3 top-3 h-60 w-60 rounded-full bg-[#10B981]/34 blur-[54px]" />
            <div className="absolute bottom-6 left-7 h-8 w-40 rounded-full border border-[#34D399]/45 shadow-[0_0_20px_rgba(16,185,129,0.32)]" />
            <div className="absolute bottom-10 left-1 h-12 w-52 -rotate-[13deg] rounded-[50%] border border-[#34D399]/42" />
            <Image src="/assets/logo1.png" alt="The Simbolo mascot" fill sizes="248px" priority className="mascot-float object-contain drop-shadow-[0_0_32px_rgba(16,185,129,0.42)]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-center"
          >
            <div className="mx-auto mb-2 inline-flex h-8 items-center gap-3 rounded-full border border-[#22C55E] bg-[#22C55E]/12 px-5 text-[0.82rem] font-bold uppercase text-[#4ADE80] shadow-none backdrop-blur-md">
              <Sparkles className="h-4 w-4 fill-[#4ADE80] text-[#4ADE80]" />
              AI-Powered Marketing Match
            </div>
            <h1 className="text-balance mx-auto max-w-[920px] text-[2.65rem] font-extrabold leading-[1.08] tracking-normal text-white sm:text-[4.2rem] lg:text-[4.55rem]">
              Find the right <span className="bg-gradient-to-r from-[#FFD166] via-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">Digital Marketing</span> Expert in seconds.
            </h1>
            <p className="mx-auto mt-2 max-w-[760px] text-[1rem] leading-7 text-[#94A3B8] sm:text-[1.12rem]">
              Tell us about your business. Get matched with the perfect marketing solution instantly.
            </p>
            <div className="search-glow mx-auto mt-4 flex max-w-[1080px] flex-col gap-2 rounded-[24px] border border-white/[0.08] bg-[#0B1120]/70 p-2.5 shadow-[0_18px_48px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition duration-300 focus-within:border-[#D97706] focus-within:shadow-[0_0_16px_rgba(217,119,6,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] sm:flex-row">
              <label className="flex min-h-16 flex-1 items-center gap-4 rounded-[18px] bg-white/[0.035] px-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 focus-within:bg-white/[0.055]">
                <Sparkles className="h-5 w-5 shrink-0 fill-[#4ADE80] text-[#4ADE80]" />
                <input
                  aria-label="Describe your marketing challenge"
                  className="w-full bg-transparent text-[0.95rem] font-medium text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                  placeholder="Describe your business, industry, goals, budget or marketing challenge..."
                />
                <Mic className="h-6 w-6 shrink-0 text-[#2DD4BF]" />
              </label>
              <button className="inline-flex min-h-16 items-center justify-center gap-5 rounded-[18px] bg-[#D97706] px-8 text-[1.1rem] font-extrabold text-white shadow-[0_10px_24px_rgba(217,119,6,0.18)] transition duration-300 hover:scale-[1.02] hover:bg-[#B45309] sm:w-[196px]">
                AI Search
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mx-auto mt-3 max-w-[1110px]"
        >
          <p className="mb-2 px-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/42">Popular Services</p>
          <div className="grid grid-cols-2 justify-center gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {categoryChips.map((chip) => {
              const isSelected = selectedChip === chip.label;

              return (
                <button
                  key={chip.label}
                  onClick={() => setSelectedChip(chip.label)}
                  className={`group relative inline-flex h-10 min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full border px-3 text-[0.88rem] font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(217,119,6,0.12)] lg:px-3.5 xl:text-[0.84rem] ${
                    isSelected
                      ? "scale-[1.025] border-[#D97706] bg-[#D97706]/10 text-white shadow-none"
                      : "border-white/[0.08] bg-white/[0.035] hover:border-[#D97706] hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="absolute inset-x-3 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#FBBF24]/70 to-transparent transition group-hover:scale-x-100" />
                  <chip.icon className={`h-5 w-5 shrink-0 transition ${isSelected ? "text-[#FBBF24]" : "text-[#94A3B8] group-hover:text-[#FBBF24]"}`} />
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
