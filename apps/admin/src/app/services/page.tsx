"use client";

import { SectionEditor } from "@/components/editors/SectionEditor";
import { HeroEditor } from "@/components/editors/HeroEditor";
import { SEOEditor } from "@/components/editors/SEOEditor";
import { TimelineEditor } from "@/components/editors/TimelineEditor";
import { StatsEditor } from "@/components/editors/StatsEditor";
import { GallerySelector } from "@/components/editors/GallerySelector";
import { Layers, Eye } from "lucide-react";

export default function ServicesOverviewEditor() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Services Overview Editor
          </h1>
          <p className="text-sm text-gray-400">Configure the main services index page.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <Eye className="w-4 h-4" /> Preview Live
        </button>
      </div>

      <SectionEditor title="Hero Section" defaultExpanded={true}>
        <HeroEditor />
      </SectionEditor>

      <SectionEditor title="Business Goal Cards" description="Small stat cards representing goals.">
        <StatsEditor />
      </SectionEditor>

      <SectionEditor title="How It Works (Timeline)">
        <TimelineEditor />
      </SectionEditor>

      <SectionEditor title="Core Services">
        <GallerySelector label="Select Sub-Services to Display" />
      </SectionEditor>

      <SectionEditor title="SEO Settings">
        <SEOEditor />
      </SectionEditor>
    </div>
  );
}
