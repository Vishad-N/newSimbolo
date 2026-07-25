"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { SectionEditors } from "@/components/about-us/SectionEditors";
import { TeamManager } from "@/components/about-us/TeamManager";
import { TimelineManager } from "@/components/about-us/TimelineManager";
import { StatisticsManager } from "@/components/about-us/StatisticsManager";
import { CoreValuesManager } from "@/components/about-us/CoreValuesManager";
import { TechnologiesManager } from "@/components/about-us/TechnologiesManager";

const tabs = [
  { id: "sections", label: "Sections Content" },
  { id: "team", label: "Team Members" },
  { id: "timeline", label: "Company Timeline" },
  { id: "statistics", label: "Statistics" },
  { id: "values", label: "Core Values" },
  { id: "technologies", label: "Technologies" },
];

export default function AboutUsManagerPage() {
  const [activeTab, setActiveTab] = useState("sections");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            About Us Content
          </h1>
          <p className="text-muted-foreground mt-1">Manage all the content displayed on the About Us page.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 pb-px hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "sections" && <SectionEditors />}
        {activeTab === "team" && <TeamManager />}
        {activeTab === "timeline" && <TimelineManager />}
        {activeTab === "statistics" && <StatisticsManager />}
        {activeTab === "values" && <CoreValuesManager />}
        {activeTab === "technologies" && <TechnologiesManager />}
      </div>
    </div>
  );
}
