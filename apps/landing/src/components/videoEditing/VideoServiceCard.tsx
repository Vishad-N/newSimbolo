"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { VideoEditingService } from "@/types/video-editing";

type VideoServiceCardProps = {
  service: VideoEditingService;
  onPreview: (service: VideoEditingService) => void;
  index: number;
};

export function VideoServiceCard({ service, onPreview, index }: VideoServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-[12px] border border-white/10 bg-[var(--surface)] transition-all hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-[0_15px_40px_rgba(34,211,238,0.1)]"
    >
      {/* Thumbnail & Preview */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image
          src={service.thumbnail}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {service.badge && (
            <span className="font-heading flex items-center gap-1 rounded-full bg-[var(--accent)]/90 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-black backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              {service.badge}
            </span>
          )}
          {service.complexity && (
            <span className="font-heading rounded-full bg-black/60 px-2.5 py-0.5 text-[0.7rem] font-bold text-white/90 backdrop-blur-md border border-white/20">
              {service.complexity} Level
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onPreview(service)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-black transition-transform hover:scale-110 shadow-[0_0_20px_var(--accent-glow)]"
          >
            <Play className="h-5 w-5 fill-black ml-1" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <h3 className="font-heading text-[1.1rem] font-bold text-white transition-colors group-hover:text-[var(--accent)]">
            {service.title}
          </h3>
          <p className="mt-1.5 text-[0.85rem] leading-snug text-white/60 line-clamp-2">
            {service.shortDescription}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {service.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-[4px] bg-white/5 px-2 py-0.5 text-[0.7rem] font-medium text-white/50">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <div>
              <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-wider text-white/40">Starting From</p>
              <p className="font-heading mt-0.5 flex items-baseline gap-1 text-[1.25rem] font-black text-white">
                {service.currency === "INR" ? "₹" : "$"}{service.hourlyRate}
                <span className="text-[0.75rem] font-medium text-white/50">/ Hour</span>
              </p>
            </div>
            
            <Link
              href={service.ctaLink || `/contact?service=${service.slug}`}
              className="font-heading rounded-[6px] bg-white/10 px-4 py-2 text-[0.8rem] font-bold text-white transition hover:bg-[var(--accent)] hover:text-black"
            >
              {service.ctaText || "Request Quote"}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
