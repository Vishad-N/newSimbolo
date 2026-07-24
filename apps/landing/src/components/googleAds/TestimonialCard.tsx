"use client";

import { Star } from "lucide-react";
import type { GoogleAdsTestimonial } from "@/types/googleAds";

type TestimonialCardProps = {
  testimonial: GoogleAdsTestimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--primary)] text-[0.68rem] font-black text-[#ffffff]">
        {testimonial.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
      </div>
      <div className="min-w-0">
        <div className="flex gap-0.5 text-[var(--accent)]">
          {Array.from({ length: testimonial.rating }).map((_, index) => (
            <Star key={index} className="h-3 w-3 fill-current" />
          ))}
        </div>
        <p className="mt-1 text-[0.72rem] font-bold text-white">{testimonial.name}</p>
        <p className="text-[0.66rem] text-white/60">{testimonial.role}</p>
      </div>
    </div>
  );
}
