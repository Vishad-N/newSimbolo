"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { SectionCard } from "@/components/seo/SectionCard";
import { TestimonialCard } from "@/components/seo/TestimonialCard";
import type { SeoResultMetric, SeoTestimonial } from "@/types/seo";

type SeoResultsProps = {
  metrics: SeoResultMetric[];
  testimonials: SeoTestimonial[];
};

export function SeoResults({ metrics, testimonials }: SeoResultsProps) {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];

  return (
    <SectionCard className="p-5">
      <h2 className="text-[1.35rem] font-black text-white">Real Results. Real Impact.</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="grid place-items-center text-center">
            <div className="grid h-[92px] w-[92px] place-items-center rounded-full border-[7px] border-[var(--primary)]/75 bg-[var(--background)]/44 shadow-[0_0_24px_var(--primary-glow)]">
              <div>
                <div className="text-[1.25rem] font-black leading-none text-white">
                  {metric.value}
                  {metric.suffix}
                </div>
                <div className="mt-1 max-w-[70px] text-[0.63rem] leading-3 text-white/72">{metric.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <TestimonialCard testimonial={testimonial} />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => setIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/75 transition hover:border-[var(--primary)]/50 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => setIndex((current) => (current + 1) % testimonials.length)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/75 transition hover:border-[var(--primary)]/50 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </SectionCard>
  );
}
