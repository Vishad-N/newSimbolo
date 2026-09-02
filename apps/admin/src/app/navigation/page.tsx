"use client";

import { useState, useEffect } from "react";
import { SectionEditor } from "@/components/editors/SectionEditor";
import { NavItemsEditor } from "@/components/editors/NavItemsEditor";
import { Navigation as NavIcon, Loader2 } from "lucide-react";
import { api } from "@/services/api";

type SectionKey = "exploreMenu" | "marketingMenu" | "growMenu";

export default function NavigationManager() {
  const [sections, setSections] = useState<Record<string, any>>({});
  const [draft, setDraft] = useState<Partial<Record<SectionKey, any>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.navigation
      .get()
      .then((data: unknown) => {
        if (active) setSections((data as Record<string, any>) || {});
      })
      .catch((error) => {
        console.error("Failed to load navigation content", error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateDraft = (key: SectionKey, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: SectionKey) => {
    setSavingKey(key);
    setStatusMessage(null);
    try {
      const value = draft[key] !== undefined ? draft[key] : sections[key];
      const updated = await api.navigation.update({ [key]: value });
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
        <Loader2 className="w-5 h-5 animate-spin" /> Loading navigation content…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <NavIcon className="w-6 h-6 text-primary" />
            Navigation Manager
          </h1>
          <p className="text-sm text-gray-400">Edit the label, link, and icon for each item in the website's sidebar menus.</p>
        </div>
      </div>

      {statusMessage && (
        <p role="status" className="text-sm text-gray-300">
          {statusMessage}
        </p>
      )}

      <SectionEditor
        title="Explore Menu (Sidebar)"
        description="Services, Packages, Case Studies, Blogs."
        defaultExpanded={true}
        onSave={() => handleSave("exploreMenu")}
      >
        <NavItemsEditor initialData={sections.exploreMenu} onChange={(data) => updateDraft("exploreMenu", data)} />
        {savingKey === "exploreMenu" && <SavingIndicator />}
      </SectionEditor>

      <SectionEditor
        title="Marketing Menu (Sidebar)"
        description="Individual service links: SEO, Google Ads, Meta Ads, etc."
        onSave={() => handleSave("marketingMenu")}
      >
        <NavItemsEditor initialData={sections.marketingMenu} onChange={(data) => updateDraft("marketingMenu", data)} />
        {savingKey === "marketingMenu" && <SavingIndicator />}
      </SectionEditor>

      <SectionEditor
        title="Grow Menu (Sidebar)"
        description="Affiliate Program, Help Center."
        onSave={() => handleSave("growMenu")}
      >
        <NavItemsEditor initialData={sections.growMenu} onChange={(data) => updateDraft("growMenu", data)} />
        {savingKey === "growMenu" && <SavingIndicator />}
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
