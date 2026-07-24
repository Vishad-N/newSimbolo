"use client";

import { Download, FolderDown } from "lucide-react";
import { motion } from "framer-motion";
import { clientResources } from "@/data/helpCenter";
import { SectionCard } from "@/components/seo/SectionCard";
import Link from "next/link";

export function ClientResources() {
  return (
    <SectionCard className="p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent)]/10 text-[var(--accent)]">
            <FolderDown className="h-5 w-5" />
          </div>
          <h2 className="text-[1.25rem] font-bold text-white">Client Resources</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link
                href={resource.link}
                className="group flex items-center justify-between rounded-[8px] border border-white/10 bg-[var(--background)] p-4 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--surface)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-white/5 text-white/60 transition-colors group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[0.9rem] font-semibold text-white group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                    {resource.title}
                  </span>
                </div>
                <div className="text-white/30 transition-colors group-hover:text-[var(--accent)]">
                  <Download className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
