"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Fingerprint, Zap, Maximize, Printer, Sparkles } from "lucide-react";

const advantages = [
  { id: "adv-1", label: "Unique Concepts", icon: Fingerprint, desc: "Bespoke designs tailored exclusively for your brand." },
  { id: "adv-2", label: "Brand Consistency", icon: ShieldCheck, desc: "Strict adherence to your brand guidelines and voice." },
  { id: "adv-3", label: "Fast Turnaround", icon: Zap, desc: "Agile delivery without compromising on quality." },
  { id: "adv-4", label: "Pixel Perfect", icon: Maximize, desc: "Meticulous attention to detail on every single pixel." },
  { id: "adv-5", label: "Print Ready", icon: Printer, desc: "High-resolution files prepared perfectly for print." },
  { id: "adv-6", label: "Unlimited Creativity", icon: Sparkles, desc: "Innovative approaches to solve complex design challenges." },
];

export function WhyDesignsStandOut() {
  return (
    <div className="rounded-[12px] border border-[var(--accent)]/10 bg-gradient-to-br from-[var(--surface)] to-[var(--background)] p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="font-heading text-[1.2rem] font-black text-white">Why Our Designs Stand Out</h3>
        <p className="mt-1 text-[0.8rem] text-white/60">We focus on what matters: quality, speed, and creative excellence.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {advantages.map((adv, index) => {
          const Icon = adv.icon;
          return (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center text-center gap-2 rounded-[8px] border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/[0.05] hover:border-white/10"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-heading text-[0.75rem] font-bold text-white leading-tight">{adv.label}</h4>
                <p className="mt-1 text-[0.65rem] text-white/50 leading-snug line-clamp-2">{adv.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
