"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SeoFaq } from "@/types/seo";

type FAQSectionProps = {
  faqs: SeoFaq[];
};

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState(faqs[0]?.id);

  return (
    <section className="pb-10">
      <h2 className="mb-4 text-[1.35rem] font-black text-white">SEO FAQs</h2>
      <div className="divide-y divide-white/10 overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_72%,transparent)]">
        {faqs.map((faq) => {
          const open = faq.id === openId;

          return (
            <div key={faq.id}>
              <button type="button" onClick={() => setOpenId(open ? "" : faq.id)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="text-[0.95rem] font-extrabold text-white">{faq.question}</span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-[var(--primary-light)] transition", open && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-[0.88rem] leading-6 text-white/72">{faq.answer}</p>
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
