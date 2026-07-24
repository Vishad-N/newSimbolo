"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { FAQItem } from "@/types/packages";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="mt-8 pb-10">
      <h2 className="text-[1.15rem] font-extrabold text-white">Frequently Asked Questions</h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-3">
        {items.map((item) => {
          const open = openId === item.id;

          return (
            <div key={item.id} className="rounded-[8px] border border-white/10 bg-[var(--card)]/78">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left text-[0.9rem] text-white/90"
              >
                <span>{item.question}</span>
                <Plus className={cn("h-5 w-5 shrink-0 text-white/80 transition duration-300", open && "rotate-45 text-[var(--primary)]")} />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[0.84rem] leading-6 text-white/70">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
