"use client";

import Link from "next/link";
import { services } from "@/data/landing";
import { ServiceCard } from "@/components/ui/ServiceCard";

export function FeaturedServices() {
  return (
    <section className="mx-auto max-w-[1290px] border-t border-white/10 px-4 pt-4 sm:px-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading flex items-center gap-2 text-[1.45rem] font-extrabold text-white">
          <span className="text-[#2DD4BF]">✦</span>
          Featured Services
        </h2>
        <Link href="/packages" className="hidden items-center gap-2 text-[0.95rem] font-semibold text-[#2DD4BF] transition hover:text-[#14B8A6] sm:flex">
          View all packages <span className="text-xl">→</span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            image={service.image}
            bullets={service.bullets}
            price={service.price}
            rating={service.rating}
            accent={service.accent as any}
            delay={index * 0.05}
          />
        ))}
      </div>
    </section>
  );
}
