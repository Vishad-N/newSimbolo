"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { Project } from "@/components/shared/RecentWorksGallery";

type EcommercePortfolioProps = {
  works: Project[];
};

export function EcommercePortfolio({ works }: EcommercePortfolioProps) {
  if (!works || works.length === 0) return null;

  const featuredWork = works[0];
  const remainingWorks = works.slice(1, 4); // Take up to 3 more

  return (
    <SectionCard className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[1.15rem] font-semibold text-white">Featured Stores</h2>
        <Link href="/portfolio" className="flex items-center gap-1.5 text-[0.8rem] font-heading font-medium text-[var(--accent)] transition hover:text-white">
          View all stores
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Featured Project (Left Column) */}
        {featuredWork && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative flex flex-col rounded-[10px] bg-[var(--surface)] border border-[var(--accent)]/30 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.05)]"
          >
            <div className="relative h-full min-h-[300px] w-full overflow-hidden">
              <Image
                src={featuredWork.thumbnail}
                alt={featuredWork.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040D14] via-[#040D14]/50 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                <span className="mb-2 inline-block rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-3 py-1 text-[0.7rem] font-bold text-[var(--accent)] uppercase tracking-wider backdrop-blur-md">
                  Featured Case Study
                </span>
                <h3 className="text-[1.75rem] font-black leading-tight text-white">{featuredWork.title}</h3>
                <p className="mt-2 text-[0.9rem] font-medium text-white/70">{featuredWork.category}</p>
                
                {featuredWork.technologies && featuredWork.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featuredWork.technologies.map((tech) => (
                      <span key={tech} className="rounded-[4px] bg-white/10 px-2 py-1 text-[0.7rem] font-semibold text-white/90">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-6">
                  <Link href={featuredWork.link} className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[var(--accent)] px-6 text-[0.85rem] font-bold text-black transition hover:bg-[var(--accent-hover)] shadow-[0_0_20px_var(--accent-glow)]">
                    View Case Study
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Supporting Projects (Right Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {remainingWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative flex flex-col sm:flex-row lg:flex-row items-center gap-4 rounded-[10px] bg-[var(--surface)] border border-white/10 p-4 transition-colors hover:bg-white/[0.02] hover:border-white/20"
            >
              <div className="relative h-32 w-full sm:w-32 lg:w-40 shrink-0 overflow-hidden rounded-[6px]">
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 160px"
                />
              </div>
              <div className="flex flex-1 flex-col w-full">
                <h3 className="text-[1.1rem] font-bold text-white">{work.title}</h3>
                <p className="text-[0.8rem] text-[var(--accent)] mt-1">{work.category}</p>
                <Link href={work.link} className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-white/60 transition group-hover:text-white">
                  View Store <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
