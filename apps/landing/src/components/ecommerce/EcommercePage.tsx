"use client";

import { FAQSection } from "@/components/seo/FAQSection";
import { EcommerceHero } from "@/components/ecommerce/EcommerceHero";
import { PricingSection } from "@/components/shared/PricingSection";
import { ResultsSection } from "@/components/shared/ResultsSection";
import { TechStack } from "@/components/websiteDesign/TechStack";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SectionCard } from "@/components/seo/SectionCard";
import { EcommerceComparison } from "@/components/ecommerce/EcommerceComparison";
import { EcommerceFeatures } from "@/components/ecommerce/EcommerceFeatures";
import { EcommercePortfolio } from "@/components/ecommerce/EcommercePortfolio";
import { EcommerceTestimonials } from "@/components/ecommerce/EcommerceTestimonials";
import { EcommerceCTA } from "@/components/ecommerce/EcommerceCTA";

import {
  ecommerceBenefits,
  ecommerceServices,
  ecommercePackages,
  ecommerceProjects,
  ecommerceTestimonials,
  ecommerceResults,
  ecommerceTechData,
  ecommerceFaqs,
  ecommerceComparison,
  ecommerceStoreFeatures,
} from "@/data/services/ecommerce";

export function EcommercePage() {
  return (
    <>
      <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1320px] space-y-4">
          
          {/* 1. Hero (Unchanged) */}
          <EcommerceHero benefits={ecommerceBenefits} />

          {/* 2. Business Growth Metrics */}
          <div className="grid gap-4">
            <ResultsSection results={ecommerceResults} />
          </div>

          {/* 3. Platforms We Build For */}
          <SectionCard className="p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[1.15rem] font-black text-white">E-Commerce Platforms We Master</h2>
                <p className="mt-1 text-[0.85rem] text-white/60">Tailored solutions built on the industry's best engines.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {ecommerceServices.slice(0, 5).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </SectionCard>

          {/* 4. Why Choose Simbolo */}
          <EcommerceComparison points={ecommerceComparison} />

          {/* 5. Store Features Showcase */}
          <SectionCard className="p-5 sm:p-8">
            <EcommerceFeatures features={ecommerceStoreFeatures} />
          </SectionCard>

          {/* 6. Portfolio Showcase */}
          <EcommercePortfolio works={ecommerceProjects} />

          {/* 7. Technology Stack */}
          <SectionCard className="p-1 sm:p-2">
            <TechStack technologies={ecommerceTechData} />
          </SectionCard>

          {/* 8. Packages (Wrapped for premium feel) */}
          <div className="grid gap-4 xl:grid-cols-1">
            <PricingSection title="E-Commerce Packages" packages={ecommercePackages} />
          </div>

          {/* 9. Testimonials */}
          <SectionCard className="p-5 sm:p-8">
            <EcommerceTestimonials testimonials={ecommerceTestimonials} />
          </SectionCard>

          {/* 10. FAQ */}
          <div className="mt-8">
            <FAQSection title="E-Commerce FAQs" faqs={ecommerceFaqs} />
          </div>

          {/* 11. Final CTA */}
          <div className="mt-8">
            <EcommerceCTA />
          </div>

        </div>
      </div>
    </>
  );
}
