"use client";

import { FAQSection } from "@/components/seo/FAQSection";
import { VideoEditingHero } from "@/components/videoEditing/VideoEditingHero";
import { VideoServiceCatalog } from "@/components/videoEditing/VideoServiceCatalog";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { RecentWorks } from "@/components/videoEditing/RecentWorks";
import { TechStack } from "@/components/websiteDesign/TechStack";
import { SectionCard } from "@/components/seo/SectionCard";
import {
  videoEditingBenefits,
  videoEditingStats,
  portfolioWorks,
  videoEditingTestimonials,
  videoEditingTech,
  toolsStats,
  videoEditingFaqs,
} from "@/data/services/videoEditing";

export function VideoEditingPage() {
  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <VideoEditingHero benefits={videoEditingBenefits} />
            <StatsBar stats={videoEditingStats} />
            
            <div className="mt-8">
              <VideoServiceCatalog />
            </div>

            <RecentWorks works={portfolioWorks} />

            <div className="mt-8">
              <TechStack title="TOOLS WE USE" technologies={videoEditingTech} />
            </div>

            <div className="grid gap-4 mt-8 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.5fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={videoEditingTestimonials} />
              <SectionCard className="p-5 h-full flex flex-col justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {toolsStats.map((stat) => {
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

            <FAQSection faqs={videoEditingFaqs} />
          </div>
        </div>
      </>
  );
}
