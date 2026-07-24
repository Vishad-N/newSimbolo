"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

export function EcommerceCTA() {
  return (
    <SectionCard className="relative overflow-hidden p-8 sm:p-12 border-[var(--accent)]/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent)]/5" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
      
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-[0.85rem] font-bold text-[var(--accent)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]"></span>
          </span>
          Start Selling Online Today
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-[2rem] font-black leading-tight text-white sm:text-[2.75rem]"
        >
          Ready to Build a Store That <br className="hidden sm:block" />
          <span className="text-[var(--accent)]">Converts Visitors into Buyers?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-[1.05rem] text-white/70"
        >
          Join 150+ successful brands that trust The Simbolo to build, scale, and automate their e-commerce operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-6 sm:flex-row"
        >
          <Link
            href="/contact?service=ecommerce"
            className="group flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-8 text-[1rem] font-black text-black transition-all hover:scale-105 hover:bg-[var(--accent-hover)] hover:shadow-[0_0_30px_var(--accent-glow)]"
          >
            Launch Your Store
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/portfolio"
            className="group flex h-14 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 text-[1rem] font-bold text-white transition hover:bg-white/10"
          >
            View Success Stories
          </Link>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-8 w-full"
        >
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Zap className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-[0.9rem] font-bold">Fast Performance</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <ShoppingCart className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-[0.9rem] font-bold">Seamless Checkout</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <TrendingUp className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-[0.9rem] font-bold">Built to Scale</span>
          </div>
        </motion.div>
      </div>
    </SectionCard>
  );
}
