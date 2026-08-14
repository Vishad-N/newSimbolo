"use client";

import { SectionEditor } from "@/components/editors/SectionEditor";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Settings, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface ThemeResponse {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  lightModeLogoUrl?: string;
  darkModeLogoUrl?: string;
  fontFamily?: string;
}

export default function ThemeSettings() {
  const [theme, setTheme] = useState({
    primary: "#FF8C1A",
    secondary: "#2dd4bf",
    accent: "#14B8A6",
    background: "#050816",
    card: "#0f172a",
    borderRadius: "0.5rem",
    fontFamily: "Inter",
  });
  const [lightLogo, setLightLogo] = useState("");
  const [darkLogo, setDarkLogo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.settings.getTheme()
      .then((response) => {
        const savedTheme = response as ThemeResponse;
        setTheme((current) => ({
          ...current,
          primary: savedTheme.primaryColor || current.primary,
          secondary: savedTheme.secondaryColor || current.secondary,
          accent: savedTheme.accentColor || current.accent,
          fontFamily: savedTheme.fontFamily || current.fontFamily,
        }));
        setLightLogo(savedTheme.lightModeLogoUrl || "");
        setDarkLogo(savedTheme.darkModeLogoUrl || "");
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Failed to load theme"));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await api.settings.updateTheme({
        primaryColor: theme.primary,
        secondaryColor: theme.secondary,
        accentColor: theme.accent,
        lightModeLogoUrl: lightLogo || null,
        darkModeLogoUrl: darkLogo || null,
        fontFamily: theme.fontFamily,
      });
      setMessage("Theme saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

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
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)] disabled:cursor-not-allowed disabled:opacity-60">
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Theme"}
        </button>
      </div>

      {message && <p role="status" className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-300">{message}</p>}

      <SectionEditor title="Branding (Logos)" defaultExpanded={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader label="Main Logo (Light)" value={lightLogo} onChange={setLightLogo} />
          <ImageUploader label="Main Logo (Dark)" value={darkLogo} onChange={setDarkLogo} />
        </div>
      </SectionEditor>

      <SectionEditor title="Global Colors" defaultExpanded={true}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.entries(theme).map(([key, val]) => (
            !["borderRadius", "fontFamily"].includes(key) && (
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
            <select value={theme.fontFamily} onChange={(event) => setTheme({ ...theme, fontFamily: event.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white">
              <option>Montserrat</option><option>Inter</option><option>Roboto</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">Body Font</label>
            <select value={theme.fontFamily} onChange={(event) => setTheme({ ...theme, fontFamily: event.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white">
              <option>Montserrat</option><option>Inter</option><option>Roboto</option>
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
