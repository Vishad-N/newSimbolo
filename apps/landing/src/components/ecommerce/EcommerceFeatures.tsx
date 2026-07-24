"use client";

import React from "react";
import { motion } from "framer-motion";

type FeatureData = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

type EcommerceFeaturesProps = {
  features: FeatureData[];
};

export function EcommerceFeatures({ features }: EcommerceFeaturesProps) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[1.35rem] font-black text-white">Advanced Store Features</h2>
        <p className="text-[0.9rem] text-white/70 max-w-[400px] text-left sm:text-right">
          Everything you need to manage products, customers, and orders seamlessly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative flex items-start gap-4 rounded-[10px] border border-white/10 bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 rounded-[10px]" />
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[var(--background)] text-[var(--accent)] shadow-sm transition group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/10">
                <Icon className="h-5 w-5" />
              </div>
              <div className="relative">
                <h3 className="text-[1rem] font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-[0.8rem] leading-snug text-white/60">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
