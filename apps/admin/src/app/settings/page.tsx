"use client";

import { SectionEditor } from "@/components/editors/SectionEditor";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Settings, Save } from "lucide-react";
import { useState } from "react";

export default function ThemeSettings() {
  const [theme, setTheme] = useState({
    primary: "#FF8C1A",
    secondary: "#2dd4bf",
    accent: "#14B8A6",
    background: "#050816",
    card: "#0f172a",
    borderRadius: "0.5rem",
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Theme Settings
          </h1>
          <p className="text-sm text-gray-400">Configure global branding, colors, and typography.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
          <Save className="w-4 h-4" /> Save Theme
        </button>
      </div>

      <SectionEditor title="Branding (Logos)" defaultExpanded={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader label="Main Logo (Light)" />
          <ImageUploader label="Main Logo (Dark)" />
          <ImageUploader label="Favicon" />
        </div>
      </SectionEditor>

      <SectionEditor title="Global Colors" defaultExpanded={true}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.entries(theme).map(([key, val]) => (
            key !== "borderRadius" && (
              <div key={key} className="space-y-2">
                <label className="text-xs font-medium text-gray-400 capitalize">{key} Color</label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                  <input 
                    type="color" 
                    value={val}
                    onChange={(e) => setTheme({...theme, [key]: e.target.value})}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input 
                    type="text" 
                    value={val}
                    onChange={(e) => setTheme({...theme, [key]: e.target.value})}
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            )
          ))}
        </div>
      </SectionEditor>

      <SectionEditor title="Typography & UI Settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Heading Font</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white">
              <option>Montserrat</option>
              <option>Inter</option>
              <option>Roboto</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Body Font</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white">
              <option>Open Sans</option>
              <option>Inter</option>
              <option>Roboto</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Border Radius (Global)</label>
            <input 
              type="text" 
              value={theme.borderRadius}
              onChange={(e) => setTheme({...theme, borderRadius: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
            />
          </div>
        </div>
      </SectionEditor>
    </div>
  );
}
