"use client";

import { useState } from "react";
import { api } from "@/services/api";

export function SectionEditors() {
  const [content, setContent] = useState({
    heroTitle: "Helping Businesses Grow Through Digital Innovation",
    heroDescription: "We are a team of passionate digital marketers, designers, and developers committed to transforming your business with modern, scalable, and data-driven solutions.",
    storyTitle: "Our Story",
    storySubtitle: "Built on Innovation and Trust",
    storyContent: "The Simbolo was founded with a single mission: to empower businesses...",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await api.aboutUs.update({
        hero: { title: content.heroTitle, description: content.heroDescription },
        story: { title: content.storyTitle, subtitle: content.storySubtitle, content: content.storyContent },
      });
      setMessage("About Us sections saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save About Us sections");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50" value={content.heroTitle} onChange={(event) => setContent({ ...content, heroTitle: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 h-24" value={content.heroDescription} onChange={(event) => setContent({ ...content, heroDescription: event.target.value })} />
          </div>
        </div>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Our Story</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50" value={content.storyTitle} onChange={(event) => setContent({ ...content, storyTitle: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Subtitle</label>
            <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50" value={content.storySubtitle} onChange={(event) => setContent({ ...content, storySubtitle: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Content</label>
            <textarea className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 h-32" value={content.storyContent} onChange={(event) => setContent({ ...content, storyContent: event.target.value })} />
          </div>
        </div>
      </div>
      {message && <p role="status" className="text-sm text-gray-300">{message}</p>}
      <button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50">
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
