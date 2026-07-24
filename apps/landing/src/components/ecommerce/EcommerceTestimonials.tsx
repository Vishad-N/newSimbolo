"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { SharedTestimonial } from "@/types/shared";

type EcommerceTestimonialsProps = {
  testimonials: SharedTestimonial[];
};

export function EcommerceTestimonials({ testimonials }: EcommerceTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <section>
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="text-[1.35rem] font-black text-white">Trusted by Growing Brands</h2>
        <p className="mt-2 text-[0.9rem] text-white/70 max-w-[500px]">
          Hear from the store owners who transformed their online businesses with us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Featured Testimonial */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col justify-between rounded-[10px] bg-gradient-to-br from-[var(--surface)] to-[var(--background)] border border-[var(--accent)]/30 p-8 shadow-[0_0_30px_rgba(34,211,238,0.05)]"
          >
            <Quote className="absolute right-6 top-6 h-12 w-12 text-[var(--accent)]/10" />
            <div>
              <div className="flex gap-1 mb-6">
                {[...Array(featured.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[var(--accent)] text-[var(--accent)]" />
                ))}
              </div>
              <p className="text-[1.1rem] leading-relaxed text-white font-medium">"{featured.quote}"</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[1.2rem] font-bold text-[var(--accent)]">
                {featured.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-[1rem] font-bold text-white">{featured.name}</h4>
                <p className="text-[0.8rem] text-[var(--accent)]">{featured.role}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Smaller Testimonials Grid */}
        <div className="grid grid-cols-1 gap-4">
          {others.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-[10px] bg-[var(--surface)] border border-white/10 p-6"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                  ))}
                </div>
                <p className="text-[0.9rem] leading-relaxed text-white/80">"{testimonial.quote}"</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-[0.9rem] font-bold text-white">{testimonial.name}</h4>
                  <p className="text-[0.75rem] text-white/50">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
