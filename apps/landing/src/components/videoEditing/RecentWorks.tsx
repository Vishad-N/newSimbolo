"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { PortfolioWork } from "@/data/services/videoEditing";

type RecentWorksProps = {
  works: PortfolioWork[];
};

export function RecentWorks({ works }: RecentWorksProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <SectionCard className="p-5 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[1.35rem] font-black text-white">Recent Our Work</h2>
          <p className="text-[0.8rem] text-white/60 mt-1">Swipe to explore our premium video projects.</p>
        </div>
        <Link href="/portfolio" className="hidden sm:flex items-center gap-1.5 text-[0.8rem] font-bold text-[var(--accent)] transition hover:text-white">
          View all works
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-1 px-1">
        {works.map((work, index) => (
          <motion.article
            key={work.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group relative flex flex-col shrink-0 snap-start rounded-[12px] border border-white/10 bg-[var(--surface)] transition duration-500 hover:border-[var(--accent)]/50 hover:-translate-y-1 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_var(--accent-glow)] w-[calc(100%/1.15)] sm:w-[calc(100%/2)] lg:w-[calc(100%/2.5)] xl:w-[calc(100%/3)]"
          >
            {/* Thumbnail Area */}
            <div className="relative aspect-video w-full overflow-hidden rounded-t-[11px] bg-black cursor-pointer" onClick={() => setPreviewUrl(work.previewUrl)}>
              <Image
                src={work.thumbnail}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300 group-hover:bg-black/40" />
              
              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                <div className="flex gap-2 flex-wrap">
                  <span className="rounded-full bg-[var(--primary)]/90 px-2.5 py-1 text-[0.65rem] font-black text-[#ffffff] shadow-sm backdrop-blur-md">
                    {work.category}
                  </span>
                  {work.secondaryBadge && (
                    <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-1 text-[0.65rem] font-bold text-white backdrop-blur-md">
                      {work.secondaryBadge}
                    </span>
                  )}
                </div>
                {work.isFeatured && (
                  <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[0.65rem] font-black text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Featured
                  </span>
                )}
              </div>

              {/* Hover Play Overlay */}
              <div className="absolute inset-0 grid place-items-center opacity-0 transition-all duration-300 group-hover:opacity-100 scale-95 group-hover:scale-100">
                <div className="flex flex-col items-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--primary)] shadow-[0_0_30px_var(--accent-glow)]">
                    <Play className="h-5 w-5 ml-1 text-white" fill="white" />
                  </div>
                  <span className="mt-2 text-[0.75rem] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">Watch Preview</span>
                </div>
              </div>

              {/* Bottom Info inside image */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {work.duration && (
                  <span className="rounded-[4px] bg-black/80 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur-sm">
                    {work.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 p-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="text-[1.1rem] font-black leading-tight text-white group-hover:text-[var(--accent)] transition-colors">{work.title}</h3>
                  <p className="mt-1 text-[0.75rem] font-medium text-white/70 line-clamp-1">{work.subtitle}</p>
                </div>
              </div>
              
              <div className="mt-4 flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.7rem] text-white/50 font-semibold">{work.industry}</span>
                  {work.rating && (
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-[0.7rem] font-bold text-white">{work.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <Link href={work.projectUrl} className="flex items-center justify-center w-full rounded-[6px] border border-white/10 bg-white/5 py-2 text-[0.75rem] font-bold text-white transition duration-300 hover:bg-white/10 hover:border-white/20">
                  View Project <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      
      {/* Mobile View All Link */}
      <Link href="/portfolio" className="mt-6 flex sm:hidden items-center justify-center gap-1.5 text-[0.85rem] font-bold text-[var(--accent)] transition hover:text-white">
        View all works
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[12px] bg-black shadow-2xl border border-white/10 aspect-video"
            >
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
              
              <iframe
                src={previewUrl}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
