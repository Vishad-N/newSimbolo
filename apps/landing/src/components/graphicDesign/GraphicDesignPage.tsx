"use client";

import { DynamicIcon } from "@/utils/icon-mapper";
import { FAQSection } from "@/components/seo/FAQSection";
import { GraphicDesignHero } from "@/components/graphicDesign/GraphicDesignHero";
import { DesignShowcase } from "@/components/graphicDesign/DesignShowcase";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { RecentWorksGallery } from "@/components/shared/RecentWorksGallery";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SectionCard } from "@/components/seo/SectionCard";
import {
  graphicDesignBenefits,
  graphicDesignStats,
  graphicDesignServices,
  graphicDesignProjects,
  graphicDesignTestimonials,
  graphicDesignFaqs,
} from "@/data/services/graphicDesign";

interface GraphicDesignPageProps {
  liveConfig?: any;
  liveFaqs?: any[];
  liveTestimonials?: any[];
}

export function GraphicDesignPage({ liveConfig, liveFaqs, liveTestimonials }: GraphicDesignPageProps) {
  const benefits = liveConfig?.heroBenefits?.length > 0 ? liveConfig.heroBenefits : graphicDesignBenefits;
  const faqs = liveFaqs && liveFaqs.length > 0 ? liveFaqs : graphicDesignFaqs;
  const testimonials = liveTestimonials && liveTestimonials.length > 0 ? liveTestimonials : graphicDesignTestimonials;
  
  const stats = liveConfig?.statsBar?.length > 0 ? liveConfig.statsBar.map((s: any, i: number) => ({
    id: `stat-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />
  })) : graphicDesignStats;

  const services = liveConfig?.servicesList?.length > 0 ? liveConfig.servicesList.map((s: any, i: number) => ({
    id: `svc-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />,
    startingPrice: s.startingPrice,
  })) : graphicDesignServices;

  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <GraphicDesignHero benefits={benefits} />
            <div className="hidden sm:block">
              <StatsBar stats={stats} />
            </div>

            <SectionCard className="p-5">
               <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                 <h2 className="text-[1.15rem] font-black text-white">Our Graphic Design Services</h2>
               </div>
               <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4">
                 {services.map((service: any, index: number) => (
                   <ServiceCard key={service.id} service={service} index={index} whatsappNumber="918982948199" />
                 ))}
               </div>
            </SectionCard>

            <div className="w-full">
              <DesignShowcase />
            </div>

            <RecentWorksGallery works={graphicDesignProjects} />

            <div className="grid gap-4 mt-8 xl:grid-cols-[1fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={testimonials} />
            </div>

            <div className="mt-8">
              <FAQSection faqs={faqs} />
            </div>
          </div>
        </div>
      </>
  );
}
