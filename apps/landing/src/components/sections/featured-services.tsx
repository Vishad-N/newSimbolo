"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { services } from "@/data/landing";
import { cn } from "@/lib/utils";

const accents = {
  blue: "from-[#0865ff]/62 to-[#2DD4BF]/14 text-[#37b8ff]",
  green: "from-[#2DD4BF]/28 to-[#22C55E]/16 text-[#22C55E]",
  cyan: "from-[#2DD4BF]/34 to-[#0284c7]/20 text-[#2DD4BF]",
  purple: "from-[#8b5cf6]/60 to-[#2DD4BF]/10 text-[#a78bfa]",
  pink: "from-[#ec4899]/60 to-[#2DD4BF]/12 text-[#fb7185]",
};

export function FeaturedServices() {
  return (
    <section className="mx-auto max-w-[1290px] border-t border-white/10 px-4 pt-4 sm:px-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[1.45rem] font-extrabold text-white">
          <span className="text-[#2DD4BF]">✦</span>
          Featured Services
        </h2>
        <a href="/services" className="hidden items-center gap-2 text-[0.95rem] font-semibold text-[#2DD4BF] transition hover:text-[#14B8A6] sm:flex">
          View all services <span className="text-xl">→</span>
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -7 }}
            className="group relative min-h-[222px] overflow-hidden rounded-[8px] border border-white/[0.08] bg-[var(--surface)]/86 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:border-white/[0.14] hover:shadow-[0_18px_42px_rgba(0,0,0,0.24)]"
          >
            <div className={cn("absolute -left-8 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl", accents[service.accent])} />

            <div className="relative flex h-full flex-col gap-4">
              <div className="relative h-[120px] w-full shrink-0 overflow-visible rounded-[8px]">
                <div className={cn("absolute inset-2 rounded-full bg-gradient-to-br opacity-55 blur-2xl", accents[service.accent])} />
                <Image
                  src={service.image}
                  alt={`${service.title} 3D isometric service illustration`}
                  fill
                  sizes="(min-width: 1280px) 120px, (min-width: 768px) 42vw, 42vw"
                  className="object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.4)] transition duration-500 group-hover:scale-[1.12]"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="min-w-0">
                  <h3 className="mb-3 text-[1.05rem] font-extrabold leading-6 text-white">{service.title}</h3>
                  <ul className="space-y-1.5 text-[0.76rem] leading-4 text-white">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#2DD4BF]" />
                        <span className="truncate">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <div>
                    <p className="text-[0.8rem] text-white/80">Starting at</p>
                    <p className="text-[1.45rem] font-extrabold leading-6 text-[var(--primary)]">{service.price}</p>
                  </div>
                  <div className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-[var(--sidebar)] px-3 text-[0.9rem] font-bold text-white">
                    <Star className="h-4 w-4 fill-[#FACC15] text-[#FACC15]" />
                    {service.rating}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
