"use client";

import { motion } from "framer-motion";
import { BarChart3, Mail, Quote, UserRound, Users } from "lucide-react";
import { chooseItems } from "@/data/landing";

export function InfoCards() {
  return (
    <section className="mx-auto grid max-w-[1290px] gap-4 px-4 pt-5 sm:px-8 lg:grid-cols-[1fr_1.28fr_0.84fr] lg:px-10">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[8px] border border-white/[0.08] bg-[var(--surface)]/82 p-5"
      >
        <h2 className="mb-5 text-[1.35rem] font-extrabold">Why Choose The Simbolo?</h2>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {chooseItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-[0.88rem] text-white">
              <item.icon className="h-5 w-5 shrink-0 text-[#2DD4BF]" />
              {item.label}
            </div>
          ))}
        </div>
      </motion.article>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08 }}
        className="rounded-[8px] border border-white/[0.08] bg-[var(--surface)]/82 p-5"
      >
        <h2 className="mb-5 text-[1.35rem] font-extrabold">How It Works</h2>
        <div className="grid grid-cols-5 items-start gap-2">
          {[
            ["1. Describe", "Your Business", UserRound],
            ["2. AI Finds", "Best Experts", Users],
            ["3. Compare", "Packages", Mail],
            ["4. Hire", "Your Expert", UserRound],
            ["5. Grow", "Your Business", BarChart3],
          ].map(([top, bottom, Icon], index) => (
            <div key={String(top)} className="relative text-center">
              {index < 4 && <div className="absolute left-[58%] top-7 hidden h-px w-[84%] border-t border-dashed border-white/[0.14] sm:block" />}
              <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/[0.08] bg-[var(--sidebar)] text-[#2DD4BF] shadow-none first:bg-[#22C55E] first:text-white">
                <Icon className="h-7 w-7" />
              </div>
              <p className="mt-2 text-[0.83rem] leading-5 text-white">
                {String(top)}
                <br />
                {String(bottom)}
              </p>
            </div>
          ))}
        </div>
      </motion.article>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.16 }}
        className="rounded-[8px] border border-white/[0.08] bg-[var(--surface)]/82 p-5"
      >
        <h2 className="mb-4 text-[1.35rem] font-extrabold">What Our Clients Say</h2>
        <div className="grid grid-cols-[58px_1fr] gap-4">
          <Quote className="h-12 w-12 fill-[#2DD4BF] text-[#2DD4BF]" />
          <div>
            <p className="mb-4 text-[1rem] leading-6 text-white">We got 450 leads in just one month. Amazing results!</p>
            <div className="mb-3 flex gap-1 text-[#14B8A6]">★★★★★</div>
            <p className="font-semibold text-white">- Dental Clinic, <span className="text-[#2DD4BF]">Mumbai</span></p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-full border border-white/[0.14] bg-white text-xl font-extrabold text-[#0B1120] shadow-[0_12px_24px_rgba(0,0,0,0.22)]">S</div>
        </div>
      </motion.article>
    </section>
  );
}
