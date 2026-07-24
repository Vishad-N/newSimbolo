"use client";

import { useState } from "react";
import { X, Save, Plus } from "lucide-react";
import { usePackages } from "@/hooks/usePackages";
import type { MarketingPackage } from "@/types/packages";

type AdminPackageEditorProps = {
  pkg: MarketingPackage | null;
  onClose: () => void;
};

export function AdminPackageEditor({ pkg, onClose }: AdminPackageEditorProps) {
  const { addPackage, updatePackage } = usePackages();
  
  const [formData, setFormData] = useState<Partial<MarketingPackage>>(
    pkg || {
      name: "",
      subtitle: "",
      shortDescription: "",
      compactHighlights: [],
      priceMonthly: 0,
      priceYearly: 0,
      currency: "INR",
      badge: "",
      rating: 5.0,
      icon: "send",
      illustration: "",
      features: [],
      deliverables: [],
      idealFor: [],
      featured: false,
      status: "published",
      displayOrder: 1,
      buttonText: "Get Started",
      buttonLink: "/contact",
      themeColor: "teal",
    }
  );

  const [highlightInput, setHighlightInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [deliverableInput, setDeliverableInput] = useState("");
  const [idealForInput, setIdealForInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayAdd = (
    e: React.KeyboardEvent | React.MouseEvent,
    input: string,
    setInput: (v: string) => void,
    field: "compactHighlights" | "features" | "deliverables" | "idealFor"
  ) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (input.trim()) {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), input.trim()] }));
        setInput("");
      }
    }
  };

  const removeArrayItem = (field: "compactHighlights" | "features" | "deliverables" | "idealFor", itemToRemove: string) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter(i => i !== itemToRemove) }));
  };

  const handleSave = () => {
    if (pkg) {
      updatePackage(pkg.id, formData);
    } else {
      const newPkg = { ...formData, id: `pkg_${Date.now()}` } as MarketingPackage;
      addPackage(newPkg);
    }
    onClose();
  };

  const renderArrayField = (
    label: string,
    field: "compactHighlights" | "features" | "deliverables" | "idealFor",
    input: string,
    setInput: (v: string) => void,
    placeholder: string
  ) => (
    <div className="col-span-1">
      <label className="mb-1 block text-[0.8rem] font-medium text-white/70">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleArrayAdd(e, input, setInput, field)}
          className="flex-1 rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
          placeholder={placeholder}
        />
        <button type="button" onClick={(e) => handleArrayAdd(e, input, setInput, field)} className="rounded-[6px] bg-white/10 px-3 hover:bg-[var(--accent)] hover:text-black transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {(formData[field] || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-[4px] bg-white/5 px-3 py-1.5 text-[0.85rem] text-white/80">
            <span>• {item}</span>
            <button type="button" onClick={() => removeArrayItem(field, item)} className="text-white/40 hover:text-red-400"><X className="h-3 w-3" /></button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[16px] border border-[var(--accent)]/30 bg-[var(--surface)] shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[var(--background)]">
          <h2 className="text-[1.2rem] font-bold text-white">
            {pkg ? "Edit Package" : "Create Package"}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-[var(--accent)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Package Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" placeholder="e.g. Enterprise" />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Theme Color</label>
                  <select name="themeColor" value={formData.themeColor} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]">
                    <option value="teal">Teal</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Subtitle</label>
                <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" placeholder="For businesses ready to scale" />
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Short Description</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full min-h-[80px] rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] resize-none" placeholder="Everything you need..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Monthly Price (₹)</label>
                  <input type="number" name="priceMonthly" value={formData.priceMonthly || ""} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Yearly Price (₹)</label>
                  <input type="number" name="priceYearly" value={formData.priceYearly || ""} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" />
                </div>
              </div>

              {renderArrayField("Compact Highlights (For Card)", "compactHighlights", highlightInput, setHighlightInput, "e.g. Dedicated Manager")}
              {renderArrayField("Included Deliverables", "deliverables", deliverableInput, setDeliverableInput, "e.g. Monthly Report")}

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Icon Name</label>
                  <input name="icon" value={formData.icon} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" placeholder="send, rocket, etc." />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Rating (e.g. 4.9)</label>
                  <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Illustration URL (Expanded Modal)</label>
                <input name="illustration" value={formData.illustration} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" placeholder="/images/packaging.jpg" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Badge</label>
                  <input name="badge" value={formData.badge} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]" placeholder="MOST POPULAR" />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4" />
                  <label htmlFor="featured" className="text-[0.8rem] font-medium text-white/70">Featured</label>
                </div>
              </div>

              {renderArrayField("Full Feature List", "features", featureInput, setFeatureInput, "e.g. Unlimited revisions")}
              {renderArrayField("Ideal For (Badges)", "idealFor", idealForInput, setIdealForInput, "e.g. Startups")}

            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-[var(--background)] px-6 py-4">
          <button onClick={onClose} className="rounded-[6px] px-4 py-2 text-[0.9rem] font-bold text-white/60 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-[6px] bg-[var(--accent)] px-6 py-2 text-[0.9rem] font-bold text-black hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)] transition-all">
            <Save className="h-4 w-4" />
            Save Package
          </button>
        </div>
      </div>
    </div>
  );
}
