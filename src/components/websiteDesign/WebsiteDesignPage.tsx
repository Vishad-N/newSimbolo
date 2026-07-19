"use client";

import { useState } from "react";
import { FAQSection } from "@/components/seo/FAQSection";
import { WebsiteDesignHero } from "@/components/websiteDesign/WebsiteDesignHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
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
} from "@/data/services/websiteDesign";
import { seoFaqs } from "@/mock/seo"; // Reusing FAQs for now
import type { BillingCycle } from "@/types/shared";

export function WebsiteDesignPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative lg:pl-[250px]">
        <Navbar />
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <WebsiteDesignHero benefits={websiteDesignBenefits} />
            <StatsBar stats={websiteDesignStats} />
            
            <SectionCard className="p-5">
               <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                 <h2 className="text-[1.15rem] font-black text-white">Our Website Design Services</h2>
               </div>
               <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                 {websiteServices.map((service, index) => (
                   <ServiceCard key={service.id} service={service} index={index} />
                 ))}
               </div>
            </SectionCard>

            <div className="grid gap-4 xl:grid-cols-[2.5fr_0.9fr]">
              <PricingSection title="Website Packages" packages={websitePackages} billing={billing} onBillingChange={setBilling} />
              <div className="h-full">
                <LeadForm title="Request Free Consultation" description="Submit your project details and we will get back to you with a custom plan." buttonText="Request Free Consultation">
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
                    aria-label="Business Type"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-[var(--surface)]">Business Type</option>
                    <option value="ecommerce" className="bg-[var(--surface)]">E-Commerce</option>
                    <option value="saas" className="bg-[var(--surface)]">SaaS</option>
                    <option value="agency" className="bg-[var(--surface)]">Agency / Service</option>
                    <option value="portfolio" className="bg-[var(--surface)]">Portfolio</option>
                  </select>
                  <select
                    aria-label="Budget"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-[var(--surface)]">Estimated Budget</option>
                    <option value="under_50k" className="bg-[var(--surface)]">Under ₹50,000</option>
                    <option value="50k_100k" className="bg-[var(--surface)]">₹50,000 - ₹1,00,000</option>
                    <option value="100k_500k" className="bg-[var(--surface)]">₹1,00,000 - ₹5,00,000</option>
                    <option value="above_500k" className="bg-[var(--surface)]">Above ₹5,00,000</option>
                  </select>
                  <textarea
                    aria-label="Project Description"
                    placeholder="Briefly describe your project..."
                    className="h-24 w-full resize-none rounded-[8px] border border-white/10 bg-[var(--background)]/44 p-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60"
                  />
                </LeadForm>
              </div>
            </div>

            <RecentWorksGallery works={websiteProjects} />
            
            <TechStack technologies={technologiesData} />

            <div className="grid gap-4 mt-8 xl:grid-cols-[1fr]">
              <TestimonialSection title="What Our Clients Say" testimonials={websiteTestimonials} />
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
