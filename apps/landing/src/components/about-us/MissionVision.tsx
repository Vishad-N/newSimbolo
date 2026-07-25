"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";

type CardProps = {
  title: string;
  description: string;
  icon: ElementType;
};

type MissionVisionProps = {
  mission: CardProps;
  vision: CardProps;
};

export function MissionVision({ mission, vision }: MissionVisionProps) {
  const MissionIcon = mission.icon;
  const VisionIcon = vision.icon;

  return (
    <section className="py-20 px-6 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden hover:bg-white/[0.04] transition-colors"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-6 border border-[var(--primary)]/20 group-hover:scale-110 transition-transform">
              <MissionIcon className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{mission.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {mission.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden hover:bg-white/[0.04] transition-colors"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <VisionIcon className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{vision.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {vision.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
