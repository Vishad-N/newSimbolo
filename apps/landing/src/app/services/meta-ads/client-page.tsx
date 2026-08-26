"use client";

import { DynamicIcon } from "@/utils/icon-mapper";
import { MetaAdsHero } from "@/components/metaAds/MetaAdsHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { ResultsSection } from "@/components/shared/ResultsSection";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { FAQSection } from "@/components/shared/FAQSection";
import { metaAdsBenefits, metaAdsResults, metaAdsStats } from "@/mock/metaAds";
import { metaAdsFaqs } from "@/mock/metaAdsFaq";
import { metaAdsPackages } from "@/mock/metaAdsPackages";
import { metaAdsTestimonials } from "@/mock/metaAdsTestimonials";
import { SharedPackage } from "@/types/shared";

interface MetaAdsClientPageProps {
  livePackages?: SharedPackage[];
  liveConfig?: any;
}

export function MetaAdsClientPage({ livePackages, liveConfig }: MetaAdsClientPageProps) {
  // Use live packages from backend if available, fallback to mock
  const packages = livePackages && livePackages.length > 0 ? livePackages : metaAdsPackages;
  const benefits = liveConfig?.heroBenefits?.length > 0 ? liveConfig.heroBenefits : metaAdsBenefits;
  
  const stats = liveConfig?.statsBar?.length > 0 ? liveConfig.statsBar.map((s: any, i: number) => ({
    id: `stat-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />
  })) : metaAdsStats;

  const results = liveConfig?.resultMetrics?.length > 0 ? liveConfig.resultMetrics.map((r: any, i: number) => ({
    id: `res-${i}`,
    value: r.value,
    label: r.label,
  })) : metaAdsResults;

  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <MetaAdsHero benefits={benefits} />
            <StatsBar stats={stats} />
            <div className="grid gap-4 xl:grid-cols-[2.6fr_1fr]">
              <PricingSection packages={packages} title="Meta Ads Packages" />
              <div className="space-y-4">
                <LeadForm title="Get Your Free Meta Ads Audit" />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <ResultsSection results={results} />
              <TestimonialSection testimonials={metaAdsTestimonials} />
            </div>
            <FAQSection faqs={metaAdsFaqs} title="Meta Ads FAQs" />
          </div>
        </div>
      </>
  );
}
