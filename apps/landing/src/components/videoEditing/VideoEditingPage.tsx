"use client";

import { DynamicIcon } from "@/utils/icon-mapper";
import { FAQSection } from "@/components/seo/FAQSection";
import { VideoEditingHero } from "@/components/videoEditing/VideoEditingHero";
import { VideoServiceCatalog } from "@/components/videoEditing/VideoServiceCatalog";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { TechStack } from "@/components/websiteDesign/TechStack";
import { SectionCard } from "@/components/seo/SectionCard";
import {
  videoEditingBenefits,
  videoEditingStats,
  videoEditingTestimonials,
  videoEditingTech,
  toolsStats,
  videoEditingFaqs,
} from "@/data/services/videoEditing";

interface VideoEditingPageProps {
  liveConfig?: any;
  liveFaqs?: any[];
  liveTestimonials?: any[];
  liveVideoServices?: any[];
  liveVideoCategories?: any[];
}

export function VideoEditingPage({ liveConfig, liveFaqs, liveTestimonials, liveVideoServices, liveVideoCategories }: VideoEditingPageProps) {
  // Map config arrays back to the SharedStat / feature format expected by components
  const benefits = liveConfig?.heroBenefits?.length > 0 ? liveConfig.heroBenefits : videoEditingBenefits;
  const faqs = liveFaqs && liveFaqs.length > 0 ? liveFaqs : videoEditingFaqs;
  const testimonials = liveTestimonials && liveTestimonials.length > 0 ? liveTestimonials : videoEditingTestimonials;
  
  const stats = liveConfig?.statsBar?.length > 0 ? liveConfig.statsBar.map((s: any, i: number) => ({
    id: `stat-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />
  })) : videoEditingStats;

  const results = liveConfig?.resultMetrics?.length > 0 ? liveConfig.resultMetrics.map((r: any, i: number) => ({
    id: `res-${i}`,
    value: r.value,
    label: r.label,
    icon: (props: any) => <DynamicIcon name={r.iconName} {...props} />
  })) : toolsStats;

  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <VideoEditingHero benefits={benefits} />
            <div className="hidden sm:block">
              <StatsBar stats={stats} />
            </div>

            <div className="mt-8">
              <VideoServiceCatalog liveServices={liveVideoServices} liveCategories={liveVideoCategories} />
            </div>

            <div className="mt-8">
              <TechStack title="TOOLS WE USE" technologies={videoEditingTech} />
            </div>

            <div className="grid gap-4 mt-8 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.5fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={testimonials} />
              <SectionCard className="p-5 h-full flex flex-col justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {results.map((stat: any) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.id} className="flex flex-col items-center justify-center text-center p-2 group">
                        <Icon className="h-7 w-7 text-[var(--accent)] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                        <div className="text-[1.8rem] font-black text-white">{stat.value}</div>
                        <div className="text-[0.8rem] text-white/70 font-medium mt-1">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>

            <FAQSection faqs={faqs} />
          </div>
        </div>
      </>
  );
}
