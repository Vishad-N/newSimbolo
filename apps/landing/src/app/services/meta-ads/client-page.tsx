"use client";

import { MetaAdsHero } from "@/components/metaAds/MetaAdsHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { ResultsSection } from "@/components/shared/ResultsSection";
import { ServiceList } from "@/components/shared/ServiceList";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { FAQSection } from "@/components/shared/FAQSection";
import { metaAdsBenefits, metaAdsResults, metaAdsServices, metaAdsStats } from "@/mock/metaAds";
import { metaAdsFaqs } from "@/mock/metaAdsFaq";
import { metaAdsPackages } from "@/mock/metaAdsPackages";
import { metaAdsTestimonials } from "@/mock/metaAdsTestimonials";

export function MetaAdsClientPage() {
  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <MetaAdsHero benefits={metaAdsBenefits} />
            <StatsBar stats={metaAdsStats} />
            <div className="grid gap-4 xl:grid-cols-[0.66fr_1.92fr_0.78fr]">
              <ServiceList services={metaAdsServices} title="What We Do" />
              <PricingSection packages={metaAdsPackages} title="Meta Ads Packages" />
              <div className="space-y-4">
                <LeadForm title="Get Your Free Meta Ads Audit" />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <ResultsSection results={metaAdsResults} />
              <TestimonialSection testimonials={metaAdsTestimonials} />
            </div>
            <FAQSection faqs={metaAdsFaqs} title="Meta Ads FAQs" />
          </div>
        </div>
      </>
  );
}
