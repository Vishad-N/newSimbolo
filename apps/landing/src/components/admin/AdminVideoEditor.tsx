"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { useVideoServices } from "@/hooks/useVideoServices";
import type { VideoEditingService } from "@/types/video-editing";

type AdminVideoEditorProps = {
  service: VideoEditingService | null;
  onClose: () => void;
};

export function AdminVideoEditor({ service, onClose }: AdminVideoEditorProps) {
  const { categories, addService, updateService } = useVideoServices();
  
  // Local state for the form
  const [formData, setFormData] = useState<Partial<VideoEditingService>>(
    service || {
      title: "",
      slug: "",
      categoryIds: [],
      thumbnail: "",
      previewType: "youtube",
      previewUrl: "",
      shortDescription: "",
      hourlyRate: 1000,
      currency: "INR",
      estimatedDelivery: "3-5 Days",
      recommendedDuration: "1-3 Minutes",
      complexity: "Medium",
      tags: [],
      badge: "",
      status: "published",
      featured: false,
    }
  );

  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tagToRemove) }));
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => {
      const cats = prev.categoryIds || [];
      if (cats.includes(categoryId)) {
        return { ...prev, categoryIds: cats.filter(id => id !== categoryId) };
      } else {
        return { ...prev, categoryIds: [...cats, categoryId] };
      }
    });
  };

  const handleSave = () => {
    if (service) {
      updateService(service.id, formData);
    } else {
      addService(formData as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[16px] border border-[var(--accent)]/30 bg-[var(--surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[var(--background)]">
          <h2 className="text-[1.2rem] font-bold text-white">
            {service ? "Edit Service" : "Create New Service"}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[0.8rem] text-white/60">Service Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  placeholder="e.g. YouTube Long-form Videos"
                />
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] text-white/60">Slug (URL)</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  placeholder="e.g. youtube-long-form"
                />
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] text-white/60">Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full min-h-[80px] rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] text-white/60">Hourly Rate</label>
                  <input
                    name="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] text-white/60">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] text-white/60">Categories</label>
                <div className="flex flex-wrap gap-2 rounded-[6px] border border-white/10 p-3 bg-black/10">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-[0.8rem] text-white/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.categoryIds || []).includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="accent-[var(--accent)]"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[0.8rem] text-white/60">Thumbnail Image URL</label>
                <input
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  placeholder="https://..."
                />
                {formData.thumbnail && (
                  <div className="mt-2 h-24 w-40 overflow-hidden rounded-[6px] bg-black">
                    <img src={formData.thumbnail} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] text-white/60">Preview Type</label>
                  <select
                    name="previewType"
                    value={formData.previewType}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="direct">Direct MP4</option>
                    <option value="instagram">Instagram Reel</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] text-white/60">Preview URL</label>
                  <input
                    name="previewUrl"
                    value={formData.previewUrl}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[0.8rem] text-white/60">Complexity Level</label>
                  <select
                    name="complexity"
                    value={formData.complexity}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[0.8rem] text-white/60">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  >
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[0.8rem] text-white/60">Tags (Press Enter to add)</label>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full rounded-[6px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white outline-none focus:border-[var(--accent)]"
                  placeholder="e.g. Creator, Fast Delivery..."
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(formData.tags || []).map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-[4px] bg-white/10 px-2 py-1 text-[0.75rem] text-white">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-white/40 hover:text-white"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-[var(--background)] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[6px] px-4 py-2 text-[0.9rem] font-bold text-white/60 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-[6px] bg-[var(--accent)] px-6 py-2 text-[0.9rem] font-bold text-black hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)]"
          >
            <Save className="h-4 w-4" />
            Save Service
          </button>
        </div>
      </div>
    </div>
  );
}
