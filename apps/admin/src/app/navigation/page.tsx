"use client";

import { SectionEditor } from "@/components/editors/SectionEditor";
import { TimelineEditor } from "@/components/editors/TimelineEditor";
import { Navigation as NavIcon } from "lucide-react";

export default function NavigationManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <NavIcon className="w-6 h-6 text-primary" />
            Navigation Manager
          </h1>
          <p className="text-sm text-gray-400">Reorder, hide, or edit menus across the website.</p>
        </div>
      </div>

      <SectionEditor title="Top Navbar" defaultExpanded={true}>
        <TimelineEditor />
      </SectionEditor>

      <SectionEditor title="Explore Menu (Sidebar)">
        <TimelineEditor />
      </SectionEditor>

      <SectionEditor title="Marketing Services Menu (Sidebar)">
        <TimelineEditor />
      </SectionEditor>

      <SectionEditor title="Footer Links">
        <TimelineEditor />
      </SectionEditor>
    </div>
  );
}
