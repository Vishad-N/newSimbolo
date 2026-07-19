"use client";
import React from "react";

import { motion } from "framer-motion";

type TechItem = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

type TechStackProps = {
  technologies: TechItem[];
};

export function TechStack({ technologies }: TechStackProps) {
  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <h2 className="text-[1.35rem] font-black text-white">TECHNOLOGIES WE WORK WITH</h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-[var(--primary)]" />
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
        {technologies.map((tech, index) => {
          const Icon = tech.icon;
          
          return (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative flex flex-col items-center justify-center rounded-[12px] border border-white/10 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-[color-mix(in_srgb,var(--surface)_80%,transparent)]"
            >
              <div 
                className="absolute inset-0 rounded-[12px] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ backgroundColor: tech.color }}
              />
              <div 
                className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10"
              >
                <Icon className="h-6 w-6" style={{ color: tech.color }} />
              </div>
              <h3 className="relative text-[0.8rem] font-bold text-white">{tech.name}</h3>
              <p className="relative mt-1 text-[0.65rem] font-medium text-white/50">{tech.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
