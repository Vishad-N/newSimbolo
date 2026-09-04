"use client";

import { useState } from "react";
import { HelpCenterHero } from "@/components/helpCenter/HelpCenterHero";
import { QuickActions } from "@/components/helpCenter/QuickActions";
import { HelpCategories } from "@/components/helpCenter/HelpCategories";
import { HelpWorkflow } from "@/components/helpCenter/HelpWorkflow";
import { TrustLocation } from "@/components/helpCenter/TrustLocation";
import { KnowledgeBase } from "@/components/helpCenter/KnowledgeBase";
import { ClientResources } from "@/components/helpCenter/ClientResources";
import { HelpCTA } from "@/components/helpCenter/HelpCTA";
import { FAQSection } from "@/components/seo/FAQSection";
import { ResultsSection } from "@/components/shared/ResultsSection";
import { helpFaqs, footerTrustStats } from "@/data/helpCenter";
import type { MappedFaq } from "@/lib/content-mapper";

interface HelpCenterPageProps {
  liveFaqs?: MappedFaq[];
}

const scrollToKnowledgeBase = () => {
  document.getElementById("knowledge-base")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function HelpCenterPage({ liveFaqs }: HelpCenterPageProps) {
  const allFaqs = liveFaqs && liveFaqs.length > 0 ? liveFaqs : helpFaqs;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const query = searchQuery.trim().toLowerCase();
  const faqs = query
    ? allFaqs.filter((faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query))
    : allFaqs;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 1. Hero Section */}
      <HelpCenterHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={scrollToKnowledgeBase}
      />

      <div className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-8 lg:px-10 space-y-6">
        {/* 2. Quick Actions */}
        <QuickActions />

        {/* 3. Browse by Category */}
        <HelpCategories
          activeCategory={activeCategory}
          onSelectCategory={(title) => {
            setActiveCategory((prev) => (prev === title ? null : title));
            scrollToKnowledgeBase();
          }}
        />

        {/* 4. Our Workflow */}
        <HelpWorkflow />

        {/* 5. Google Map & Trust Section */}
        <TrustLocation />

        {/* 7. Knowledge Base */}
        <KnowledgeBase searchQuery={searchQuery} activeCategory={activeCategory} />

        {/* 8. Client Resources */}
        <ClientResources />

        {/* 6. Frequently Asked Questions */}
        {faqs.length > 0 && (
          <div className="pt-8">
            <FAQSection title="Frequently Asked Questions" faqs={faqs} />
          </div>
        )}

        {/* 9. Still Need Help (CTA) */}
        <HelpCTA />

        {/* 10. Footer Trust Stats */}
        <div className="pt-4">
          <ResultsSection results={footerTrustStats} />
        </div>
      </div>
    </div>
  );
}
