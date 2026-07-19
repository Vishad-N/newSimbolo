"use client";

import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { SeoTestimonial } from "@/types/seo";

type TestimonialCardProps = {
  testimonial: SeoTestimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div key={testimonial.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="rounded-[8px] border border-white/10 bg-[var(--background)]/36 p-5">
      <div className="flex gap-4">
        <Quote className="h-7 w-7 shrink-0 text-[var(--primary-light)]" />
        <p className="text-[0.88rem] leading-6 text-white/84">{testimonial.quote}</p>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--primary)] text-[0.86rem] font-black text-white">
          {testimonial.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="flex gap-1 text-[var(--primary-light)]">
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <div className="mt-1 text-[0.85rem] font-bold text-white">{testimonial.name}</div>
          <div className="text-[0.74rem] text-white/68">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
}
