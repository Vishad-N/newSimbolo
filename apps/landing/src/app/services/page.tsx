import { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { GoalSelector } from "@/components/services/GoalSelector";
import { CoreServicesGrid } from "@/components/services/CoreServicesGrid";
import { ServiceCategories } from "@/components/services/ServiceCategories";
import { EverythingIncluded } from "@/components/services/EverythingIncluded";
import { IndustriesServed } from "@/components/services/IndustriesServed";
import { TechStackChips } from "@/components/services/TechStackChips";
import { ProcessTimeline } from "@/components/services/ProcessTimeline";
import { ServicesStats } from "@/components/services/ServicesStats";
import { BottomCTA } from "@/components/services/BottomCTA";

import { RecentWorksGallery } from "@/components/shared/RecentWorksGallery";
import { FAQSection } from "@/components/shared/FAQSection";

export const metadata: Metadata = {
  title: "Digital Marketing Services | The Simbolo",
  description: "Discover The Simbolo's complete digital marketing, SEO, Google Ads, website development, e-commerce, video editing, and graphic design services. Find the perfect solution to grow your business.",
  openGraph: {
    title: "Digital Marketing Services | The Simbolo",
    description: "Discover The Simbolo's complete digital marketing and development services.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Services | The Simbolo",
    description: "Discover The Simbolo's complete digital marketing and development services.",
  },
};

const recentProjects = [
  {
    id: "proj-1",
    title: "Apollo Hospital Campaign",
    category: "Meta Ads & Strategy",
    technologies: ["Meta Ads", "Creative Design", "Analytics"],
    thumbnail: "/images/services/meta-ads.png",
    link: "#",
  },
  {
    id: "proj-2",
    title: "Lenskart E-Commerce",
    category: "Website Optimization",
    technologies: ["Shopify", "UI/UX", "SEO"],
    thumbnail: "/images/services/website-design.png",
    link: "#",
  },
  {
    id: "proj-3",
    title: "Swiggy Growth Marketing",
    category: "Google Ads",
    technologies: ["Google Ads", "PPC", "Conversion Tracking"],
    thumbnail: "/images/services/seo.png",
    link: "#",
  }
];

const serviceFaqs = [
  {
    id: "faq-1",
    question: "How do I know which service is right for my business?",
    answer: "Our AI Marketing Match system and expert strategists analyze your business goals, target audience, and current digital presence to recommend the exact services that will drive the highest ROI for your specific needs."
  },
  {
    id: "faq-2",
    question: "Do you offer custom packages that combine multiple services?",
    answer: "Absolutely. Most of our clients benefit from an omnichannel approach. We create custom bundles (e.g., SEO + Content Writing + Website Development) tailored to your growth objectives and budget."
  },
  {
    id: "faq-3",
    question: "How long does it take to see results?",
    answer: "Timelines vary by service. Paid ads (Google/Meta) can generate leads within days. SEO and organic growth typically take 3-6 months for significant momentum. Website development projects usually take 4-8 weeks depending on complexity."
  },
  {
    id: "faq-4",
    question: "Will I get regular updates and reports?",
    answer: "Yes! We provide comprehensive monthly performance reports, real-time analytics access, and regular strategy calls with your dedicated account manager to ensure you always know exactly how your campaigns are performing."
  }
];

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)]">
      <ServicesHero />
      <GoalSelector />
      <CoreServicesGrid />
      <ServiceCategories />
      <EverythingIncluded />
      <IndustriesServed />
      <TechStackChips />
      <ProcessTimeline />
      
      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--sidebar)]">
        <div className="mx-auto max-w-[1290px]">
          <div className="mb-12 text-center">
            <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
              Featured <span className="text-[var(--primary)]">Projects</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-[1rem] text-[var(--muted)]">
              See how we've helped businesses like yours achieve extraordinary growth.
            </p>
          </div>
          <RecentWorksGallery works={recentProjects} />
        </div>
      </section>

      {/* Why Businesses Choose The Simbolo (Stats) */}
      <ServicesStats />

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--sidebar)]">
        <div className="mx-auto max-w-[800px]">
          <div className="mb-12 text-center">
            <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
              Frequently Asked <span className="text-[var(--primary)]">Questions</span>
            </h2>
          </div>
          <FAQSection faqs={serviceFaqs} title="" />
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
