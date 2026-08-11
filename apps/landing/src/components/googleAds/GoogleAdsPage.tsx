"use client";

import { DynamicIcon } from "@/utils/icon-mapper";
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
import { SharedPackage } from "@/types/shared";

interface GoogleAdsPageProps {
  livePackages?: SharedPackage[];
  liveConfig?: any;
}

export function GoogleAdsPage({ livePackages, liveConfig }: GoogleAdsPageProps) {
  const packages = livePackages && livePackages.length > 0 ? livePackages : googleAdsPackages;
  const benefits = liveConfig?.heroBenefits?.length > 0 ? liveConfig.heroBenefits : googleAdsBenefits;
  
  const stats = liveConfig?.statsBar?.length > 0 ? liveConfig.statsBar.map((s: any, i: number) => ({
    id: `stat-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />
  })) : googleAdsStats;

  const services = liveConfig?.servicesList?.length > 0 ? liveConfig.servicesList.map((s: any, i: number) => ({
    id: `svc-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />
  })) : googleAdsServices;

  const results = liveConfig?.resultMetrics?.length > 0 ? liveConfig.resultMetrics.map((r: any, i: number) => ({
    id: `res-${i}`,
    value: r.value,
    label: r.label,
  })) : googleAdsResults;

  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <GoogleAdsHero benefits={benefits} />
            <StatsBar stats={stats} />
            <div className="grid gap-4 xl:grid-cols-[0.66fr_1.92fr_0.78fr]">
              <ServiceList services={services} />
              <PricingSection packages={packages}  />
              <div className="space-y-4">
                <LeadForm />
                <WhyChooseUs items={whyChooseItems} testimonials={googleAdsTestimonials} />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <ProcessTimeline steps={googleAdsProcess} />
              <ResultsSection results={results} />
            </div>
            <FAQSection faqs={googleAdsFaqs} />
          </div>
        </div>
      </>
  );
}
