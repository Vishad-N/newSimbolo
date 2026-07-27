"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const accents = {
  blue: "from-[#0865ff]/62 to-[#2DD4BF]/14 text-[#37b8ff]",
  green: "from-[#2DD4BF]/28 to-[#22C55E]/16 text-[#22C55E]",
  cyan: "from-[#2DD4BF]/34 to-[#0284c7]/20 text-[#2DD4BF]",
  purple: "from-[#8b5cf6]/60 to-[#2DD4BF]/10 text-[#a78bfa]",
  pink: "from-[#ec4899]/60 to-[#2DD4BF]/12 text-[#fb7185]",
  orange: "from-[#f97316]/60 to-[#2DD4BF]/12 text-[#fb923c]",
  teal: "from-[#14b8a6]/60 to-[#0f766e]/12 text-[#2dd4bf]",
};

export type AccentColor = keyof typeof accents;

export interface ServiceCardProps {
  title: string;
  image: string;
  bullets?: string[];
  price: string | number;
  rating: string | number;
  accent: AccentColor;
  delay?: number;
  onClick?: () => void;
  showCta?: boolean;
  ctaText?: string;
}

export function ServiceCard({
  title,
  image,
  bullets,
  price,
  rating,
  accent,
  delay = 0,
  onClick,
  showCta,
  ctaText = "Explore"
}: ServiceCardProps) {
  const isNumberPrice = typeof price === "number";
  const formattedPrice = isNumberPrice ? `₹${price.toLocaleString("en-IN")}` : price;
  const shouldRenderCta = showCta ?? Boolean(onClick);

  // Strip any trailing text arrow from ctaText if present so the glowing icon handles it cleanly
  const cleanCtaText = ctaText ? ctaText.replace(/\s*(?:->|\u2192|\u2794)+\s*$/g, "") : "Explore";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={cn(
        "group relative h-full min-h-[300px] overflow-hidden rounded-[16px] border border-white/[0.08] bg-[var(--surface)]/86 p-6 shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-white/20 hover:bg-[var(--surface)]/95 hover:shadow-[0_22px_48px_rgba(0,0,0,0.35)] flex flex-col transform-gpu will-change-transform",
        onClick && "cursor-pointer"
      )}
    >
      {/* Background radial gradient glow */}
      <div className={cn("absolute -left-8 -top-10 h-36 w-36 rounded-full bg-gradient-to-br blur-2xl opacity-60 pointer-events-none transform-gpu transition-opacity duration-300 group-hover:opacity-80", accents[accent])} />

      <div className="relative flex h-full flex-col">
        {/* Large Illustration Area (~20-25% increase) */}
        <div className="relative h-[155px] w-full shrink-0 flex items-center justify-center overflow-visible rounded-[8px] mb-4">
          <div className={cn("absolute inset-2 rounded-full bg-gradient-to-br opacity-40 blur-xl pointer-events-none transform-gpu transition-opacity duration-300 group-hover:opacity-60", accents[accent])} />
          <Image
            src={image}
            alt={`${title} 3D isometric service illustration`}
            fill
            sizes="(min-width: 1280px) 160px, (min-width: 768px) 45vw, 45vw"
            className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-[1.15]"
          />
        </div>

        {/* Card Content & Information Hierarchy */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="font-heading text-[1.2rem] font-extrabold leading-6 text-white tracking-wide">{title}</h3>
          </div>

          <div className="mt-auto pt-5">
            <p className="text-[0.76rem] font-semibold uppercase tracking-wider text-white/60">Starting From</p>

            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="font-heading text-[1.65rem] font-black leading-none text-[var(--primary)] tracking-tight">
                {formattedPrice}
              </div>
              <div className="inline-flex h-6.5 items-center gap-1 rounded-full border border-white/[0.08] bg-[var(--sidebar)]/90 px-2.5 py-0.5 text-[0.82rem] font-bold text-white shadow-sm">
                <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
                <span>{rating}</span>
              </div>
            </div>

            {/* Floating Glass CTA */}
            {shouldRenderCta && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  aria-label={`Explore ${title} package details`}
                  className="group/btn inline-flex min-w-[140px] h-10 items-center justify-between gap-3 rounded-full bg-slate-900/60 px-5 text-[0.88rem] font-semibold text-white border border-[#22D3EE]/30 backdrop-blur-md shadow-[inset_0_1px_8px_rgba(34,211,238,0.18),0_4px_12px_rgba(0,0,0,0.25)] transition-all duration-250 hover:bg-slate-800/70 hover:border-[#22D3EE]/70 hover:shadow-[inset_0_1px_12px_rgba(34,211,238,0.35),0_8px_24px_rgba(34,211,238,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
                >
                  <span className="text-white font-semibold tracking-wide">{cleanCtaText}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#22D3EE] transition-transform duration-250 group-hover/btn:translate-x-1.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
