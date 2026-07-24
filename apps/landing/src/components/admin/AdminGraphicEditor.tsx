"use client";

import { useState } from "react";
import { X, Save, Plus } from "lucide-react";
import { useGraphicDesignServices } from "@/hooks/useGraphicDesignServices";
import type { DesignCategory } from "@/types/graphic-design";

type AdminGraphicEditorProps = {
  category: DesignCategory | null;
  onClose: () => void;
};

export function AdminGraphicEditor({ category, onClose }: AdminGraphicEditorProps) {
  const { addCategory, updateCategory } = useGraphicDesignServices();
  
  const [formData, setFormData] = useState<Partial<DesignCategory>>(
    category || {
      title: "",
      thumbnail: "",
      shortDescription: "",
      deliverables: [],
      skills: [],
      badge: "",
      ctaText: "",
      ctaLink: "",
      featured: false,
      status: "published",
    }
  );

  const [deliverableInput, setDeliverableInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddDeliverable = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (deliverableInput.trim()) {
        setFormData(prev => ({ ...prev, deliverables: [...(prev.deliverables || []), deliverableInput.trim()] }));
        setDeliverableInput("");
      }
    }
  };

  const removeDeliverable = (itemToRemove: string) => {
    setFormData(prev => ({ ...prev, deliverables: (prev.deliverables || []).filter(i => i !== itemToRemove) }));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (skillInput.trim()) {
        setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), skillInput.trim()] }));
        setSkillInput("");
      }
    }
  };

  const removeSkill = (itemToRemove: string) => {
    setFormData(prev => ({ ...prev, skills: (prev.skills || []).filter(i => i !== itemToRemove) }));
  };

  const handleSave = () => {
    if (category) {
      updateCategory(category.id, formData);
    } else {
      addCategory(formData as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[16px] border border-[var(--accent)]/30 bg-[var(--surface)] shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[var(--background)]">
          <h2 className="text-[1.2rem] font-bold text-white">
            {category ? "Edit Design Category" : "Create Design Category"}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-[var(--accent)] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Category Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="e.g. Social Media Creatives"
                />
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full min-h-[100px] rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  placeholder="Describe this category's primary value..."
                />
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Deliverables</label>
                <div className="flex gap-2">
                  <input
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={handleAddDeliverable}
                    className="flex-1 rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="e.g. Instagram Posts"
                  />
                  <button type="button" onClick={handleAddDeliverable} className="rounded-[6px] bg-white/10 px-3 hover:bg-[var(--accent)] hover:text-black transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {(formData.deliverables || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-[4px] bg-white/5 px-3 py-1.5 text-[0.85rem] text-white/80">
                      <span>• {item}</span>
                      <button type="button" onClick={() => removeDeliverable(item)} className="text-white/40 hover:text-red-400"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Thumbnail Image URL</label>
                <input
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="https://..."
                />
                {formData.thumbnail && (
                  <div className="mt-2 aspect-[4/3] w-full max-w-[200px] overflow-hidden rounded-[6px] bg-black/50 border border-white/10">
                    <img src={formData.thumbnail} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Skills & Tools</label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="e.g. Figma, Photoshop"
                  />
                  <button type="button" onClick={handleAddSkill} className="rounded-[6px] bg-white/10 px-3 hover:bg-[var(--accent)] hover:text-black transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(formData.skills || []).map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-[4px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2 py-1 text-[0.75rem] font-semibold">
                      {item}
                      <button type="button" onClick={() => removeSkill(item)} className="hover:text-white"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 mt-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Highlight Badge</label>
                  <input
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="e.g. Best Choice"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                  >
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">CTA Text</label>
                  <input
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="Request Design"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] font-medium text-white/70">CTA Link</label>
                  <input
                    name="ctaLink"
                    value={formData.ctaLink}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/30 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)] transition-colors"
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-[var(--background)] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[6px] px-4 py-2 text-[0.9rem] font-bold text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-[6px] bg-[var(--accent)] px-6 py-2 text-[0.9rem] font-bold text-black hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)] transition-all"
          >
            <Save className="h-4 w-4" />
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}
