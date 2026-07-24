"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { cn } from "@/utils/utils";

interface HeroData {
  title: string;
  highlightedText: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  illustrationImage?: string;
}

interface HeroEditorProps {
  initialData?: Partial<HeroData>;
  onChange?: (data: HeroData) => void;
}

export function HeroEditor({ initialData, onChange }: HeroEditorProps) {
  const [data, setData] = useState<HeroData>({
    title: initialData?.title || "",
    highlightedText: initialData?.highlightedText || "",
    subtitle: initialData?.subtitle || "",
    primaryButtonText: initialData?.primaryButtonText || "",
    primaryButtonLink: initialData?.primaryButtonLink || "",
    secondaryButtonText: initialData?.secondaryButtonText || "",
    secondaryButtonLink: initialData?.secondaryButtonLink || "",
    backgroundImage: initialData?.backgroundImage || "",
    illustrationImage: initialData?.illustrationImage || "",
  });

  const updateField = (field: keyof HeroData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange?.(newData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Text Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Typography & Content</h3>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Main Title</label>
          <input 
            type="text" 
            value={data.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            placeholder="e.g. AI-Powered Digital Marketing"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">Highlighted Text (Gradient)</label>
          <input 
            type="text" 
            value={data.highlightedText}
            onChange={(e) => updateField("highlightedText", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            placeholder="e.g. Matchmaking"
          />
        </div>

        <RichTextEditor 
          label="Subtitle / Description" 
          value={data.subtitle}
          onChange={(val) => updateField("subtitle", val)}
        />
        
        <div className="pt-4 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Call To Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Primary Button Text</label>
              <input 
                type="text" 
                value={data.primaryButtonText}
                onChange={(e) => updateField("primaryButtonText", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Primary Button URL</label>
              <input 
                type="text" 
                value={data.primaryButtonLink}
                onChange={(e) => updateField("primaryButtonLink", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Secondary Button Text</label>
              <input 
                type="text" 
                value={data.secondaryButtonText}
                onChange={(e) => updateField("secondaryButtonText", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Secondary Button URL</label>
              <input 
                type="text" 
                value={data.secondaryButtonLink}
                onChange={(e) => updateField("secondaryButtonLink", e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Media & Assets</h3>
        
        <ImageUploader 
          label="Background Image / Video" 
          value={data.backgroundImage}
          onChange={(val) => updateField("backgroundImage", val)}
        />
        
        <ImageUploader 
          label="Hero Illustration (Optional)" 
          value={data.illustrationImage}
          onChange={(val) => updateField("illustrationImage", val)}
        />
      </div>
    </div>
  );
}
