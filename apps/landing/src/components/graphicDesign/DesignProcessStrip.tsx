"use client";

import { motion } from "framer-motion";
import { Lightbulb, Search, Palette, PencilRuler, MessageSquare, CheckCircle2 } from "lucide-react";

const steps = [
  { id: "step-1", label: "Brief", icon: Lightbulb },
  { id: "step-2", label: "Research", icon: Search },
  { id: "step-3", label: "Concept", icon: PencilRuler },
  { id: "step-4", label: "Design", icon: Palette },
  { id: "step-5", label: "Feedback", icon: MessageSquare },
  { id: "step-6", label: "Final Delivery", icon: CheckCircle2 },
];

export function DesignProcessStrip() {
  return (
    <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] p-5 sm:p-6 shadow-[0_5px_20px_rgba(34,211,238,0.05)]">
      <div className="mb-4 text-center">
        <h3 className="font-heading text-[1.1rem] font-bold text-white">Our Design Process</h3>
        <p className="mt-0.5 text-[0.75rem] text-white/50">A streamlined workflow from concept to final delivery.</p>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Connecting Line (Desktop) */}
        <div className="absolute left-[5%] top-1/2 hidden h-[2px] w-[90%] -translate-y-1/2 bg-white/10 md:block">
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-6 md:gap-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[var(--background)] shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110 hover:border-[var(--accent)] hover:shadow-[0_0_15px_var(--accent-glow)]">
                  <Icon className="h-4 w-4 text-white/80" />
                </div>
                <div className="font-heading mt-2.5 text-[0.7rem] font-bold text-white tracking-wide">{step.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
