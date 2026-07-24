"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { quickActions } from "@/data/helpCenter";

export function QuickActions() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                href={action.link}
                className="group relative flex h-full items-start gap-4 rounded-[12px] border border-white/10 bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_10px_30px_rgba(34,211,238,0.08)]"
              >
                <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[var(--background)] text-[var(--accent)] shadow-sm transition group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/10">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="relative flex flex-col">
                  <h3 className="text-[1.05rem] font-bold text-white mb-1.5 transition group-hover:text-[var(--accent)]">{action.title}</h3>
                  <p className="text-[0.85rem] leading-snug text-white/60">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
