"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAQSection } from "@/components/seo/FAQSection";
import { SeoApproach } from "@/components/seo/SeoApproach";
import { SeoHero } from "@/components/seo/SeoHero";
import { SeoPackages } from "@/components/seo/SeoPackages";
import { SeoResults } from "@/components/seo/SeoResults";
import { SeoServiceCard } from "@/components/seo/SeoServiceCard";
import { StatsBar } from "@/components/seo/StatsBar";
import { heroBenefits, approachSteps, resultMetrics, seoFaqs, seoMetrics, testimonials } from "@/mock/seo";
import { seoPackages } from "@/mock/seo-packages";
import { seoServices } from "@/mock/seo-services";
export function SeoPage() {
  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <SeoHero benefits={heroBenefits} />
            <StatsBar metrics={seoMetrics} />
            <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
              <section className="rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_72%,transparent)] p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-[1.25rem] font-black text-white">Our SEO Services</h2>
                  <Link href="/services" className="hidden items-center gap-1 text-[0.78rem] font-bold text-[var(--accent)] hover:text-white sm:flex">
                    View all services
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {seoServices.map((service, index) => (
                    <SeoServiceCard key={service.id} service={service} index={index} />
                  ))}
                </div>
              </section>
              <SeoApproach steps={approachSteps} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
              <SeoPackages packages={seoPackages} />
              <SeoResults metrics={resultMetrics} testimonials={testimonials} />
            </div>
            <FAQSection faqs={seoFaqs} />
          </div>
        </div>
      </>
  );
}
