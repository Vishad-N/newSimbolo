"use client";

import { motion } from "framer-motion";
import { workflowSteps } from "@/data/helpCenter";
import { Check } from "lucide-react";

export function HelpWorkflow() {
  return (
    <section className="py-12 relative">
      <div className="mb-12 flex flex-col items-center text-center">
        <h2 className="text-[1.35rem] font-black text-white">How We Work</h2>
        <p className="mt-2 text-[0.9rem] text-white/70 max-w-[500px]">
          Our transparent, step-by-step process ensures your project is delivered on time, every time.
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Scrollable container for mobile */}
        <div className="overflow-x-auto pb-8 hide-scrollbar">
          <div className="min-w-[800px] flex justify-between relative px-6">
            
            {/* Background Line */}
            <div className="absolute top-[24px] left-8 right-8 h-[2px] bg-white/10" />
            
            {/* Animated Glow Line */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "calc(100% - 64px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-[24px] left-8 h-[2px] bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" 
            />

            {workflowSteps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center w-24">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[var(--accent)] text-black shadow-[0_0_20px_var(--accent-glow)]"
                >
                  <Check className="h-5 w-5" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                  className="mt-4 text-center text-[0.8rem] font-bold text-white whitespace-nowrap"
                >
                  {step}
                </motion.p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
