"use client";

import { FAQSection } from "@/components/seo/FAQSection";
import { GoogleAdsHero } from "@/components/googleAds/GoogleAdsHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { ProcessTimeline } from "@/components/googleAds/ProcessTimeline";
import { ResultsSection } from "@/components/shared/ResultsSection";
import { ServiceList } from "@/components/shared/ServiceList";
import { StatsBar } from "@/components/shared/StatsBar";
import { WhyChooseUs } from "@/components/googleAds/WhyChooseUs";
import { googleAdsBenefits, googleAdsProcess, googleAdsResults, googleAdsServices, googleAdsStats, whyChooseItems } from "@/mock/googleAds";
import { googleAdsFaqs } from "@/mock/googleAdsFaq";
import { googleAdsPackages } from "@/mock/googleAdsPackages";
import { googleAdsTestimonials } from "@/mock/googleAdsTestimonials";

export function GoogleAdsPage() {
  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <GoogleAdsHero benefits={googleAdsBenefits} />
            <StatsBar stats={googleAdsStats} />
            <div className="grid gap-4 xl:grid-cols-[0.66fr_1.92fr_0.78fr]">
              <ServiceList services={googleAdsServices} />
              <PricingSection packages={googleAdsPackages}  />
              <div className="space-y-4">
                <LeadForm />
                <WhyChooseUs items={whyChooseItems} testimonials={googleAdsTestimonials} />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <ProcessTimeline steps={googleAdsProcess} />
              <ResultsSection results={googleAdsResults} />
            </div>
            <FAQSection faqs={googleAdsFaqs} />
          </div>
        </div>
      </>
  );
}
