"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const includedItems = [
  "Comprehensive Strategy",
  "In-depth Market Research",
  "Premium UI/UX Design",
  "Custom Development",
  "Omnichannel Marketing",
  "AI-Powered Optimization",
  "Advanced Analytics",
  "Monthly Performance Reports",
  "24/7 Dedicated Support"
];

export function EverythingIncluded() {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-[24px] border border-[var(--accent)]/50 bg-gradient-to-b from-[#111827] to-[#0B1120] p-8 sm:p-12 shadow-[0_20px_60px_rgba(247,146,30,0.08)] relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[150px] w-[300px] bg-[var(--primary)]/10 blur-[80px]" />

          <div className="relative z-10 text-center mb-10">
            <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
              Everything You Need, <span className="text-[var(--primary)]">Included.</span>
            </h2>
            <p className="mt-3 text-[1rem] text-[var(--muted)]">
              No hidden fees, no surprises. Just a complete suite of services designed for growth.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {includedItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 rounded-[12px] border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] hover:border-white/10"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                <span className="text-[0.95rem] font-medium text-white/90">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
