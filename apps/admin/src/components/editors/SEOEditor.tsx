"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Search } from "lucide-react";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  noIndex: boolean;
}

interface SEOEditorProps {
  initialData?: Partial<SEOData>;
  onChange?: (data: SEOData) => void;
}

export function SEOEditor({ initialData, onChange }: SEOEditorProps) {
  const [data, setData] = useState<SEOData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    keywords: initialData?.keywords || "",
    canonical: initialData?.canonical || "",
    ogImage: initialData?.ogImage || "",
    noIndex: initialData?.noIndex || false,
  });

  const updateField = (field: keyof SEOData, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange?.(newData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Meta Tags */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 mb-2">
          <Search className="w-4 h-4" />
          Meta Tags
        </h3>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Meta Title (Max 60 chars)</label>
          <input 
            type="text" 
            value={data.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
            placeholder="e.g. Best Digital Marketing Agency"
          />
          <div className="text-right text-[10px] text-gray-500 mt-1">{data.title.length}/60</div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Meta Description (Max 160 chars)</label>
          <textarea 
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white min-h-[100px] resize-y"
            placeholder="A brief description of the page content for search engines..."
          />
          <div className="text-right text-[10px] text-gray-500 mt-1">{data.description.length}/160</div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Keywords (Comma separated)</label>
          <input 
            type="text" 
            value={data.keywords}
            onChange={(e) => updateField("keywords", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
            placeholder="seo, marketing, design, etc"
          />
        </div>
      </div>

      {/* Advanced SEO & Social */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Social Sharing (OpenGraph)</h3>
          <ImageUploader 
            label="OpenGraph Image (1200x630px)" 
            value={data.ogImage}
            onChange={(val) => updateField("ogImage", val)}
          />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Advanced</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Canonical URL</label>
            <input 
              type="text" 
              value={data.canonical}
              onChange={(e) => updateField("canonical", e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              placeholder="https://www.simbolo.com/page-slug"
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors">
            <input 
              type="checkbox" 
              checked={data.noIndex}
              onChange={(e) => updateField("noIndex", e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary focus:ring-primary/50"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Hide from Search Engines (noindex)</span>
              <span className="text-xs text-gray-500">Enable this to prevent Google from indexing this page.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
