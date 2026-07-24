"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { DesignCategory } from "@/types/graphic-design";

type DesignCategoryCardProps = {
  category: DesignCategory;
  index: number;
};

export function DesignCategoryCard({ category, index }: DesignCategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-[16px] border border-white/10 bg-[var(--surface)] transition-all hover:-translate-y-2 hover:border-[var(--accent)]/40 hover:shadow-[0_15px_40px_rgba(34,211,238,0.12)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/50">
        <Image
          src={category.thumbnail}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {category.badge && (
            <span className="font-heading flex items-center gap-1 rounded-full bg-[var(--accent)]/90 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-black backdrop-blur-md shadow-lg">
              <Sparkles className="h-2.5 w-2.5" />
              {category.badge}
            </span>
          )}
        </div>

        {/* Hover CTA Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 p-6 text-center">
          <Link
            href={category.ctaLink || `/contact?service=${category.id}`}
            className="font-heading mt-auto flex h-9 w-full max-w-[160px] items-center justify-center gap-1.5 rounded-[6px] bg-[var(--accent)] text-[0.8rem] font-bold text-black transition-transform hover:scale-105 shadow-[0_0_20px_var(--accent-glow)] translate-y-4 group-hover:translate-y-0 duration-300"
          >
            {category.ctaText || "Request Custom Design"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div>
          <h3 className="font-heading text-[1rem] font-bold text-white transition-colors group-hover:text-[var(--accent)] line-clamp-1">
            {category.title}
          </h3>
          <p className="mt-1.5 text-[0.75rem] leading-snug text-white/60 line-clamp-2">
            {category.shortDescription}
          </p>
        </div>

        <div className="mt-4">
          <h4 className="font-heading text-[0.65rem] font-bold uppercase tracking-wider text-white/40 mb-2">Deliverables Included</h4>
          <ul className="grid grid-cols-1 gap-1.5">
            {category.deliverables.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[0.75rem] text-white/70">
                <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)] mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
            {category.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="rounded-[4px] bg-white/5 px-2 py-0.5 text-[0.65rem] font-semibold text-white/50 border border-white/5 whitespace-nowrap">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
