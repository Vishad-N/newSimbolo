"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { CaseStudy } from "@/types/case-studies";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";

const filters = [
  "All",
  "SEO",
  "Google Ads",
  "Meta Ads",
  "Website Design",
  "Shopify",
  "Branding",
  "E-Commerce",
];

interface CaseStudiesClientPageProps {
  initialCaseStudies?: CaseStudy[];
}

import { caseStudies as mockCaseStudies } from "@/mock/case-studies";

export function CaseStudiesClientPage({ initialCaseStudies }: CaseStudiesClientPageProps) {
  const caseStudies = initialCaseStudies && initialCaseStudies.length > 0 ? initialCaseStudies : mockCaseStudies;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredStudies = caseStudies.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || study.services.includes(activeFilter) || study.industry.includes(activeFilter);

    return matchesSearch && matchesFilter && study.status === "Published";
  });

  const featuredStudy = filteredStudies.find((s) => s.featured) || filteredStudies[0];
  const gridStudies = filteredStudies.filter((s) => s.id !== featuredStudy?.id);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative lg:min-h-[65vh] flex flex-col justify-center pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300 mb-3 backdrop-blur-md">
            <TrendingUp className="w-3 h-3 text-[var(--primary)]" />
            Proven Business Growth
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
            Real Results.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-cyan-400">
              Real Growth.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-5 leading-snug">
            Explore how we've helped businesses increase traffic, generate leads, improve conversions, and scale revenue through strategic digital solutions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">250+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Projects Delivered</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">95%</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Client Retention</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-0.5">₹50Cr+</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Revenue Influenced</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-yellow-500 mb-0.5">4.9★</div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Average Rating</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client, industry, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/50 transition-all"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeFilter === filter
                      ? "bg-[var(--primary)] text-white shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Grid Section */}
      <section className="px-6 pb-32">
        <div className="container mx-auto max-w-7xl">
          {featuredStudy && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[var(--primary)] rounded-full"></span>
                Featured Success Story
              </h2>
              <CaseStudyCard study={featuredStudy} featured />
            </div>
          )}

          {gridStudies.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[var(--primary)] rounded-full"></span>
                More Case Studies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridStudies.map((study) => (
                  <CaseStudyCard key={study.id} study={study} />
                ))}
              </div>
            </div>
          )}
          
          {filteredStudies.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
              <button onClick={() => { setSearchQuery(""); setActiveFilter("All"); }} className="mt-6 text-[var(--primary)] hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
