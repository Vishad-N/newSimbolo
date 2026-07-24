"use client";

import { use } from "react";
import { SectionEditor } from "@/components/editors/SectionEditor";
import { HeroEditor } from "@/components/editors/HeroEditor";
import { SEOEditor } from "@/components/editors/SEOEditor";
import { StatsEditor } from "@/components/editors/StatsEditor";
import { GallerySelector } from "@/components/editors/GallerySelector";
import { LayoutTemplate, Eye } from "lucide-react";

export default function IndividualServiceEditor({ params }: { params: Promise<{ slug: string }> }) {
  // Use React.use() to unwrap the params promise since Next 15+ App Router passes params as a promise
  const resolvedParams = use(params);
  const title = resolvedParams.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-primary" />
            {title} Page Editor
          </h1>
          <p className="text-sm text-gray-400">Configure the individual service landing page.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <Eye className="w-4 h-4" /> Preview Live
        </button>
      </div>

      <SectionEditor title="Hero Section" defaultExpanded={true}>
        <HeroEditor />
      </SectionEditor>

      <SectionEditor title="Service Statistics / Badges">
        <StatsEditor />
      </SectionEditor>

      <SectionEditor title="Key Benefits">
        <StatsEditor />
      </SectionEditor>

      <SectionEditor title="Service Packages" description="Select pricing packages for this service.">
        <GallerySelector label="Packages" />
      </SectionEditor>

      <SectionEditor title="Recent Work / Portfolio" description="Select portfolio items for this service.">
        <GallerySelector label="Portfolio Items" />
      </SectionEditor>

      <SectionEditor title="SEO Settings">
        <SEOEditor />
      </SectionEditor>
    </div>
  );
}
