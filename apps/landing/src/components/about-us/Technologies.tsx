"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";

type Technology = {
  name: string;
  icon: ElementType;
};

type TechnologiesProps = {
  technologies: Technology[];
};

export function Technologies({ technologies }: TechnologiesProps) {
  return (
    <section className="py-24 px-6 bg-white/[0.01]">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Technologies We Master</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
          We use a modern, scalable, and robust tech stack to ensure your projects are built for the future.
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {technologies.map((tech, i) => {
            const Icon = tech.icon;
            
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 w-[120px] h-[120px] md:w-[140px] md:h-[140px] hover:bg-white/[0.06] hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-gray-400 group-hover:text-cyan-400 transition-colors mb-3" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{tech.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
