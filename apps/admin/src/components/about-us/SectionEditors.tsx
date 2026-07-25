"use client";

import { Building2 } from "lucide-react";

export function SectionEditors() {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50" defaultValue="Helping Businesses Grow Through Digital Innovation" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 h-24" defaultValue="We are a team of passionate digital marketers, designers, and developers committed to transforming your business with modern, scalable, and data-driven solutions." />
          </div>
        </div>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Our Story</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50" defaultValue="Our Story" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Subtitle</label>
            <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50" defaultValue="Built on Innovation and Trust" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Content</label>
            <textarea className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 h-32" defaultValue="The Simbolo was founded with a single mission: to empower businesses..." />
          </div>
        </div>
      </div>
      <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
        Save Changes
      </button>
    </div>
  );
}
