"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

type ValueItem = {
  title: string;
  description: string;
  icon: ElementType;
  accent: string;
};

type CoreValuesProps = {
  values: ValueItem[];
};

const getAccentColor = (accent: string) => {
  switch (accent) {
    case "blue": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "green": return "text-green-400 bg-green-500/10 border-green-500/20";
    case "yellow": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "cyan": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case "pink": return "text-pink-400 bg-pink-500/10 border-pink-500/20";
    case "purple": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    default: return "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20";
  }
};

export function CoreValues({ values }: CoreValuesProps) {
  return (
    <section className="py-24 px-6 bg-white/[0.01]">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Core Values</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
          These principles guide everything we do, from how we build software to how we treat our clients.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {values.map((value, i) => {
            const Icon = value.icon;
            const colorClasses = getAccentColor(value.accent);
            
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all hover:-translate-y-1"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 border transition-transform group-hover:scale-110", colorClasses)}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
