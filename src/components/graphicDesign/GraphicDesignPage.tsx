"use client";

import { useState } from "react";
import { FAQSection } from "@/components/seo/FAQSection";
import { GraphicDesignHero } from "@/components/graphicDesign/GraphicDesignHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RecentWorksGallery } from "@/components/shared/RecentWorksGallery";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SectionCard } from "@/components/seo/SectionCard";
import {
  graphicDesignBenefits,
  graphicDesignStats,
  graphicDesignServices,
  graphicDesignPackages,
  graphicDesignProjects,
  graphicDesignTestimonials,
} from "@/data/services/graphicDesign";
import { seoFaqs } from "@/mock/seo"; // Reusing FAQs for now
import type { BillingCycle } from "@/types/shared";

export function GraphicDesignPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative lg:pl-[250px]">
        <Navbar />
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

            <div className="grid gap-4 xl:grid-cols-[2.5fr_0.9fr]">
              <PricingSection title="Graphic Design Packages" packages={graphicDesignPackages} billing={billing} onBillingChange={setBilling} />
              <div className="h-full">
                <LeadForm title="Request Custom Design" description="Tell us your requirements and we will create the perfect design solution for you." buttonText="Request Custom Design">
                  <input
                    aria-label="Your Name"
                    placeholder="Your Name"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60"
                  />
                  <input
                    aria-label="Email Address"
                    placeholder="Email Address"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60"
                  />
                  <input
                    aria-label="Phone Number"
                    placeholder="Phone Number"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60"
                  />
                  <select
                    aria-label="Design Requirement"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-[var(--surface)]">Design Requirement</option>
                    <option value="logo" className="bg-[var(--surface)]">Logo & Branding</option>
                    <option value="social_media" className="bg-[var(--surface)]">Social Media Posts</option>
                    <option value="marketing_collateral" className="bg-[var(--surface)]">Marketing Collateral</option>
                    <option value="ui_ux" className="bg-[var(--surface)]">UI/UX Design</option>
                    <option value="other" className="bg-[var(--surface)]">Other Custom Design</option>
                  </select>
                  <select
                    aria-label="Budget"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-[var(--surface)]">Estimated Budget</option>
                    <option value="under_10k" className="bg-[var(--surface)]">Under ₹10,000</option>
                    <option value="10k_25k" className="bg-[var(--surface)]">₹10,000 - ₹25,000</option>
                    <option value="25k_50k" className="bg-[var(--surface)]">₹25,000 - ₹50,000</option>
                    <option value="above_50k" className="bg-[var(--surface)]">Above ₹50,000</option>
                  </select>
                  <textarea
                    aria-label="Project Description"
                    placeholder="Briefly describe your design needs..."
                    className="h-24 w-full resize-none rounded-[8px] border border-white/10 bg-[var(--background)]/44 p-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60"
                  />
                </LeadForm>
              </div>
            </div>

            <RecentWorksGallery works={graphicDesignProjects} />

            <div className="grid gap-4 mt-8 xl:grid-cols-[1fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={graphicDesignTestimonials} />
            </div>

            <div className="mt-8">
              <FAQSection faqs={seoFaqs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
