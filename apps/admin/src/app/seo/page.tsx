"use client";

import { SectionEditor } from "@/components/editors/SectionEditor";
import { SEOEditor as SEOComponent } from "@/components/editors/SEOEditor";
import { Search } from "lucide-react";

export default function GlobalSEOSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            Global SEO Settings
          </h1>
          <p className="text-sm text-gray-400">Configure default fallback SEO tags for the entire website.</p>
        </div>
      </div>

      <SectionEditor title="Global Defaults" defaultExpanded={true}>
        <SEOComponent />
      </SectionEditor>
    </div>
  );
}
