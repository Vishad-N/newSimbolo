"use client";

import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { SectionCard } from "@/components/seo/SectionCard";
import { TestimonialCard } from "@/components/googleAds/TestimonialCard";
import type { GoogleAdsTestimonial } from "@/types/googleAds";

type WhyChooseUsProps = {
  items: string[];
  testimonials: GoogleAdsTestimonial[];
};

export function WhyChooseUs({ items, testimonials }: WhyChooseUsProps) {
  const [index, setIndex] = useState(0);

  return (
    <SectionCard className="p-4">
      <h2 className="text-[1.08rem] font-black text-white">Why Choose The Simbolo?</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[0.8rem] text-white/78">
            <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
            {item}
          </li>
        ))}
      </ul>
      <TestimonialCard testimonial={testimonials[index]} />
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" aria-label="Previous testimonial" onClick={() => setIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/70 hover:text-white">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label="Next testimonial" onClick={() => setIndex((current) => (current + 1) % testimonials.length)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/70 hover:text-white">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </SectionCard>
  );
}
