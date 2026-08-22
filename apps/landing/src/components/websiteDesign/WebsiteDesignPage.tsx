"use client";

import { DynamicIcon } from "@/utils/icon-mapper";
import { FAQSection } from "@/components/seo/FAQSection";
import { WebsiteDesignHero } from "@/components/websiteDesign/WebsiteDesignHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { RecentWorksGallery } from "@/components/shared/RecentWorksGallery";
import { TechStack } from "@/components/websiteDesign/TechStack";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SectionCard } from "@/components/seo/SectionCard";
import {
  websiteDesignBenefits,
  websiteDesignStats,
  websiteServices,
  websitePackages,
  websiteProjects,
  websiteTestimonials,
  technologiesData,
  websiteDesignFaqs,
} from "@/data/services/websiteDesign";
import { SharedPackage } from "@/types/shared";

interface WebsiteDesignPageProps {
  livePackages?: SharedPackage[];
  liveProjects?: any[];
  liveConfig?: any;
}

export function WebsiteDesignPage({ livePackages, liveProjects, liveConfig }: WebsiteDesignPageProps) {
  const packages = livePackages && livePackages.length > 0 ? livePackages : websitePackages;
  const projects = liveProjects && liveProjects.length > 0 ? liveProjects : websiteProjects;
  
  const benefits = liveConfig?.heroBenefits?.length > 0 ? liveConfig.heroBenefits : websiteDesignBenefits;
  
  const stats = liveConfig?.statsBar?.length > 0 ? liveConfig.statsBar.map((s: any, i: number) => ({
    id: `stat-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />
  })) : websiteDesignStats;

  const services = liveConfig?.servicesList?.length > 0 ? liveConfig.servicesList.map((s: any, i: number) => ({
    id: `svc-${i}`,
    title: s.title,
    description: s.description,
    icon: (props: any) => <DynamicIcon name={s.iconName} {...props} />,
    startingPrice: s.startingPrice,
  })) : websiteServices;

  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <WebsiteDesignHero benefits={benefits} />
            <StatsBar stats={stats} />
            
            <SectionCard className="p-5">
               <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                 <h2 className="text-[1.15rem] font-black text-white">Our Website Design Services</h2>
               </div>
               <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                 {services.map((service: any, index: number) => (
                   <ServiceCard key={service.id} service={service} index={index} />
                 ))}
               </div>
            </SectionCard>

            <div className="grid gap-4 xl:grid-cols-[2.5fr_0.9fr]">
              <PricingSection title="Website Maintenance Packages" packages={packages}  />
              <div className="h-full">
                <LeadForm
                  title="Request Free Consultation"
                  description="Submit your project details and we will get back to you with a custom plan."
                  buttonText="Request Free Consultation"
                  extraFields={[
                    {
                      id: "businessType",
                      label: "Business Type",
                      type: "select",
                      options: ["E-Commerce", "SaaS", "Agency / Service", "Portfolio"],
                    },
                    {
                      id: "budget",
                      label: "Estimated Budget",
                      type: "select",
                      options: ["Under ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹5,00,000", "Above ₹5,00,000"],
                    },
                    {
                      id: "projectDescription",
                      label: "Project Description",
                      type: "textarea",
                      placeholder: "Briefly describe your project...",
                    },
                  ]}
                />
              </div>
            </div>

            <RecentWorksGallery works={projects} />
            
            <TechStack technologies={technologiesData} />

            <div className="grid gap-4 mt-8 xl:grid-cols-[1fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={websiteTestimonials} />
            </div>

            <div className="mt-8">
              <FAQSection faqs={websiteDesignFaqs} />
            </div>
          </div>
        </div>
      </>
  );
}
