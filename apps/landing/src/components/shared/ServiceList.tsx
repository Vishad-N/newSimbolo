"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { SharedService } from "@/types/shared";

type ServiceListProps = {
  title?: string;
  services: SharedService[];
};

export function ServiceList({ title = "Our Services", services }: ServiceListProps) {
  return (
    <SectionCard className="h-full p-4">
      <h2 className="mb-5 text-[1.12rem] font-black text-white">{title}</h2>
      <div className="space-y-3">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.38 }}
              whileHover={{ x: 4 }}
              className="flex gap-4 rounded-[8px] p-2 transition hover:bg-white/[0.04]"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-[var(--accent-glow)] text-[var(--accent)]">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[0.86rem] font-black text-white">{service.title}</h3>
                <p className="mt-0.5 text-[0.72rem] leading-4 text-white/68">{service.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
