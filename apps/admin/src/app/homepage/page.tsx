"use client";

import { SectionEditor } from "@/components/editors/SectionEditor";
import { HeroEditor } from "@/components/editors/HeroEditor";
import { SEOEditor } from "@/components/editors/SEOEditor";
import { StatsEditor } from "@/components/editors/StatsEditor";
import { GallerySelector } from "@/components/editors/GallerySelector";
import { Home, Eye } from "lucide-react";

export default function HomepageEditor() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            Homepage Editor
          </h1>
          <p className="text-sm text-gray-400">Configure the landing page of the website.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <Eye className="w-4 h-4" /> Preview Live
        </button>
      </div>

      <SectionEditor 
        title="Hero Section" 
        description="The main top section of the homepage." 
        defaultExpanded={true}
      >
        <HeroEditor />
      </SectionEditor>

      <SectionEditor 
        title="Featured Services" 
        description="Select services to highlight on the homepage."
      >
        <GallerySelector label="Select Services" />
      </SectionEditor>

      <SectionEditor 
        title="Why Choose Us (Benefits)" 
        description="List of benefits shown with icons."
      >
        <StatsEditor />
      </SectionEditor>

      <SectionEditor 
        title="Trusted Brands" 
        description="Client logos displayed in the marquee."
      >
        <GallerySelector label="Brand Logos" />
      </SectionEditor>

      <SectionEditor 
        title="SEO Settings" 
        description="Page-level SEO tags for the homepage."
      >
        <SEOEditor />
      </SectionEditor>
    </div>
  );
}
