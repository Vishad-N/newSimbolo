"use client";

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

export function GraphicDesignPage() {
  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <GraphicDesignHero benefits={graphicDesignBenefits} />
            <StatsBar stats={graphicDesignStats} />
            
            <SectionCard className="p-5">
               <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                 <h2 className="text-[1.15rem] font-black text-white">Our Graphic Design Services</h2>
               </div>
               <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4">
                 {graphicDesignServices.map((service, index) => (
                   <ServiceCard key={service.id} service={service} index={index} />
                 ))}
               </div>
            </SectionCard>

            <div className="w-full">
              <DesignShowcase />
            </div>

            <RecentWorksGallery works={graphicDesignProjects} />

            <div className="grid gap-4 mt-8 xl:grid-cols-[1fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={graphicDesignTestimonials} />
            </div>

            <div className="mt-8">
              <FAQSection faqs={graphicDesignFaqs} />
            </div>
          </div>
        </div>
      </>
  );
}
