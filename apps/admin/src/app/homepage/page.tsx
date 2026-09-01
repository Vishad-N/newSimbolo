"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionEditor } from "@/components/editors/SectionEditor";
import { HeroEditor } from "@/components/editors/HeroEditor";
import { SEOEditor } from "@/components/editors/SEOEditor";
import { StatsEditor } from "@/components/editors/StatsEditor";
import { GallerySelector } from "@/components/editors/GallerySelector";
import { Home, Eye, Loader2 } from "lucide-react";
import { getWebsiteUrl } from "@/utils/utils";
import { api } from "@/services/api";

type SectionKey = "hero" | "featuredServices" | "whyChooseUs" | "trustedBrands" | "seo";

export default function HomepageEditor() {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [draft, setDraft] = useState<Partial<Record<SectionKey, any>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.homepage
      .get()
      .then((data: unknown) => {
        if (active) setSections((data as Record<string, any>) || {});
      })
      .catch((error) => {
        console.error("Failed to load homepage content", error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateDraft = useCallback((key: SectionKey, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async (key: SectionKey) => {
    setSavingKey(key);
    setStatusMessage(null);
    try {
      const value = draft[key] !== undefined ? draft[key] : sections[key];
      const updated = await api.homepage.update({ [key]: value });
      setSections((updated as Record<string, any>) || {});
      setStatusMessage("Section saved.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? `Failed to save: ${error.message}` : "Failed to save section");
    } finally {
      setSavingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading homepage content…
      </div>
    );
  }

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
        <a href={getWebsiteUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <Eye className="w-4 h-4" /> Preview Live
        </a>
      </div>

      {statusMessage && (
        <p role="status" className="text-sm text-gray-300">
          {statusMessage}
        </p>
      )}

      <SectionEditor
        title="Hero Section"
        description="The main top section of the homepage."
        defaultExpanded={true}
        onSave={() => handleSave("hero")}
      >
        <HeroEditor initialData={sections.hero} onChange={(data) => updateDraft("hero", data)} />
        {savingKey === "hero" && <SavingIndicator />}
      </SectionEditor>

      <SectionEditor
        title="Featured Services"
        description="Select services to highlight on the homepage."
        onSave={() => handleSave("featuredServices")}
      >
        <GallerySelector
          label="Select Services"
          initialData={sections.featuredServices}
          onChange={(data) => updateDraft("featuredServices", data)}
        />
        {savingKey === "featuredServices" && <SavingIndicator />}
      </SectionEditor>

      <SectionEditor
        title="Why Choose Us (Benefits)"
        description="List of benefits shown with icons."
        onSave={() => handleSave("whyChooseUs")}
      >
        <StatsEditor initialData={sections.whyChooseUs} onChange={(data) => updateDraft("whyChooseUs", data)} />
        {savingKey === "whyChooseUs" && <SavingIndicator />}
      </SectionEditor>

      <SectionEditor
        title="Trusted Brands"
        description="Client logos displayed in the marquee."
        onSave={() => handleSave("trustedBrands")}
      >
        <GallerySelector
          label="Brand Logos"
          initialData={sections.trustedBrands}
          onChange={(data) => updateDraft("trustedBrands", data)}
        />
        {savingKey === "trustedBrands" && <SavingIndicator />}
      </SectionEditor>

      <SectionEditor
        title="SEO Settings"
        description="Page-level SEO tags for the homepage."
        onSave={() => handleSave("seo")}
      >
        <SEOEditor initialData={sections.seo} onChange={(data) => updateDraft("seo", data)} />
        {savingKey === "seo" && <SavingIndicator />}
      </SectionEditor>
    </div>
  );
}

function SavingIndicator() {
  return (
    <p className="flex items-center gap-2 text-xs text-gray-400 mt-2">
      <Loader2 className="w-3 h-3 animate-spin" /> Saving…
    </p>
  );
}
