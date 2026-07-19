"use client";

import { useState } from "react";
import { FAQSection } from "@/components/seo/FAQSection";
import { VideoEditingHero } from "@/components/videoEditing/VideoEditingHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RecentWorks } from "@/components/videoEditing/RecentWorks";
import { ToolsWeUse } from "@/components/videoEditing/ToolsWeUse";
import { SectionCard } from "@/components/seo/SectionCard";
import {
  videoEditingBenefits,
  videoEditingStats,
  videoEditingPackages,
  portfolioWorks,
  videoEditingTestimonials,
  toolsWeUse,
  toolsStats,
} from "@/data/services/videoEditing";
import { seoFaqs } from "@/mock/seo"; // Reusing FAQs for now as a fallback or you can create mock/videoEditingFaq.ts
import type { BillingCycle } from "@/types/shared";

export function VideoEditingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative lg:pl-[250px]">
        <Navbar />
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <VideoEditingHero benefits={videoEditingBenefits} />
            <StatsBar stats={videoEditingStats} />
            
            <div className="grid gap-4 xl:grid-cols-[2.5fr_0.9fr]">
              <PricingSection title="Our Video Editing Packages" packages={videoEditingPackages} billing={billing} onBillingChange={setBilling} />
              <div className="h-full">
                <LeadForm title="Need a Custom Video?" description="Share your requirements and we'll create the perfect plan for you." buttonText="Request Custom Quote">
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
                    aria-label="What type of video?"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-[var(--surface)]">What type of video?</option>
                    <option value="youtube" className="bg-[var(--surface)]">YouTube Video</option>
                    <option value="reels" className="bg-[var(--surface)]">Instagram Reel / Short</option>
                    <option value="promo" className="bg-[var(--surface)]">Promotional Video</option>
                    <option value="podcast" className="bg-[var(--surface)]">Podcast Editing</option>
                  </select>
                  <select
                    aria-label="How long should it be?"
                    className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-[var(--surface)]">How long should it be?</option>
                    <option value="under_1m" className="bg-[var(--surface)]">Under 1 minute</option>
                    <option value="1_to_3m" className="bg-[var(--surface)]">1 - 3 minutes</option>
                    <option value="3_to_10m" className="bg-[var(--surface)]">3 - 10 minutes</option>
                    <option value="over_10m" className="bg-[var(--surface)]">Over 10 minutes</option>
                  </select>
                </LeadForm>
              </div>
            </div>

            <RecentWorks works={portfolioWorks} />

            <div className="grid gap-4 lg:grid-cols-3">
              <TestimonialSection title="What Our Clients Say" testimonials={videoEditingTestimonials} />
              <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                <ToolsWeUse tools={toolsWeUse} />
                <SectionCard className="p-5 h-full grid grid-cols-2 gap-4">
                  {toolsStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.id} className="flex flex-col items-center justify-center text-center p-2">
                        <Icon className="h-6 w-6 text-[var(--primary-light)] mb-2" />
                        <div className="text-[1.5rem] font-black text-white">{stat.value}</div>
                        <div className="text-[0.75rem] text-white/70 font-medium">{stat.label}</div>
                      </div>
                    );
                  })}
                </SectionCard>
              </div>
            </div>

            <FAQSection faqs={seoFaqs} />
          </div>
        </div>
      </main>
    </div>
  );
}
