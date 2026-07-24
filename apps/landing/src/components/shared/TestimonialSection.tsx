"use client";

import { Quote, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SectionCard } from "@/components/seo/SectionCard";
import type { SharedTestimonial } from "@/types/shared";

type TestimonialSectionProps = {
  title?: string;
  testimonials: SharedTestimonial[];
};

export function TestimonialSection({ title = "What Our Clients Say", testimonials }: TestimonialSectionProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const testimonial = testimonials[index];

  if (!testimonial) return null;

  return (
    <SectionCard className="p-4 h-full flex flex-col">
      <h2 className="text-[1.08rem] font-semibold text-white">{title}</h2>
      <div className="flex-1 relative mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col h-full justify-between"
          >
            <div className="flex gap-4">
              <Quote className="h-7 w-7 shrink-0 text-[var(--accent)]" />
              <p className="relative z-10 text-[0.85rem] leading-relaxed text-white/80">&quot;{testimonial.quote}&quot;</p>
            </div>
            <div className="mt-5 flex items-center gap-4">
              {testimonial.name.includes("Image") ? ( // if we decide to pass image url
                <div className="h-11 w-11 rounded-full overflow-hidden bg-white/10" />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--primary)] text-[0.86rem] font-black text-[#ffffff]">
                  {testimonial.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-heading text-[0.85rem] font-semibold text-white">{testimonial.name}</div>
                <div className="text-[0.74rem] text-white/68">{testimonial.role}</div>
                <div className="flex gap-1 mt-1 text-[var(--accent)]">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}
