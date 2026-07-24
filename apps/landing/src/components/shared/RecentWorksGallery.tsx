"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

export type Project = {
  id: string;
  title: string;
  category: string;
  technologies?: string[];
  thumbnail: string;
  link: string;
};

type RecentWorksGalleryProps = {
  works: Project[];
};

export function RecentWorksGallery({ works }: RecentWorksGalleryProps) {
  return (
    <SectionCard className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[1.15rem] font-semibold text-white">Recent Our Work</h2>
        <Link href="/portfolio" className="flex items-center gap-1.5 text-[0.8rem] font-heading font-medium text-[var(--accent)] transition hover:text-white">
          View all works
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group relative flex flex-col rounded-[10px] bg-[var(--surface)] border border-white/10 overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden bg-[var(--background)]">
              <Image
                src={work.thumbnail}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
            </div>
            <div className="flex flex-col flex-1 p-4">
              <h3 className="text-[1.05rem] font-semibold leading-tight text-white">{work.title}</h3>
              <p className="mt-1 text-[0.78rem] font-normal text-[var(--accent)]">{work.category}</p>
              
              {work.technologies && work.technologies.length > 0 && (
                <div className="mt-4 mb-5 flex flex-wrap gap-2">
                  {work.technologies.map((tech) => (
                    <span key={tech} className="rounded-[4px] bg-white/10 px-2 py-1 text-[0.65rem] font-semibold text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-auto pt-4">
                <Link href={work.link} className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-white/20 bg-white/5 px-4 text-[0.8rem] font-heading font-medium text-white transition hover:bg-white/10 w-full sm:w-auto">
                  Visit Project
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}
