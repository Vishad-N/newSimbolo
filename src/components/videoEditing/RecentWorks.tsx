"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

type PortfolioWork = {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
};

type RecentWorksProps = {
  works: PortfolioWork[];
};

export function RecentWorks({ works }: RecentWorksProps) {
  return (
    <SectionCard className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[1.15rem] font-black text-white">Recent Our Work</h2>
        <Link href="/portfolio" className="flex items-center gap-1.5 text-[0.8rem] font-bold text-[var(--primary-light)] transition hover:text-white">
          View all works
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="group relative cursor-pointer"
          >
            <div className="relative aspect-video overflow-hidden rounded-[8px] bg-[var(--surface)] border border-white/10">
              <Image
                src={work.thumbnail}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
              <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur-md">
                  <Play className="h-4 w-4 ml-0.5 text-white" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-1.5 right-1.5 rounded-[4px] bg-black/80 px-1.5 py-0.5 text-[0.6rem] font-semibold text-white backdrop-blur-sm">
                {work.duration}
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-[0.78rem] font-bold leading-tight text-white line-clamp-1">{work.title}</h3>
              <p className="mt-0.5 text-[0.68rem] text-white/60">{work.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}
