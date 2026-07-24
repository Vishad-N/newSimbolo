"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { popularSearches } from "@/data/helpCenter";

export function HelpCenterHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-24 text-center sm:px-8 lg:px-10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent)]/15 via-transparent to-transparent opacity-80" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[2.5rem] font-black leading-tight text-white sm:text-[3.5rem]"
        >
          How can we <span className="text-[var(--accent)]">help you?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-4 text-[1.05rem] text-white/70"
        >
          Find answers, browse guides, or get in touch with our experts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10"
        >
          <div className="relative mx-auto flex max-w-2xl items-center rounded-[100px] bg-[var(--surface)] p-2 pr-2 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] focus-within:border-[var(--accent)]/50 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all">
            <Search className="ml-4 h-5 w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search for articles, services, payments..."
              className="w-full bg-transparent px-4 py-3 text-[1rem] text-white outline-none placeholder:text-white/40"
            />
            <button className="hidden h-10 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[0.9rem] font-bold text-black transition hover:bg-[var(--accent-hover)] hover:shadow-[0_0_15px_var(--accent-glow)] sm:flex">
              Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-[0.85rem] font-semibold text-white/50">Popular:</span>
            {popularSearches.map((search, index) => (
              <button
                key={index}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.8rem] text-white/80 transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              >
                {search}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
