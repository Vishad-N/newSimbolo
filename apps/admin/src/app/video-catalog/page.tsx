"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Video, X, Save, RefreshCw, Trash, Tag } from "lucide-react";
import { api, getDataArray } from "@/services/api";

interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

interface VideoItemRow {
  id: string;
  title: string;
  thumbnail: string;
  categories: string;
  hourlyRate: number;
  currency: string;
  status: string;
  featured: boolean;
}

const emptyForm = {
  title: "",
  thumbnail: "",
  previewType: "YOUTUBE",
  previewUrl: "",
  shortDescription: "",
  fullDescription: "",
  hourlyRate: 0,
  currency: "INR",
  estimatedDelivery: "",
  recommendedDuration: "",
  complexity: "MEDIUM",
  tags: "",
  badge: "",
  status: "PUBLISHED",
  featured: false,
  displayOrder: 0,
  ctaText: "",
  ctaLink: "",
  categoryIds: [] as string[],
};

export default function VideoCatalogManager() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [itemsRes, catRes] = await Promise.all([
        api.videoCatalog.getAll(),
        api.videoCatalog.getCategories(),
      ]);
      setItems(getDataArray<any>(itemsRes));
      setCategories(getDataArray<VideoCategory>(catRes));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch video catalog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      thumbnail: item.thumbnail || "",
      previewType: item.previewType || "YOUTUBE",
      previewUrl: item.previewUrl || "",
      shortDescription: item.shortDescription || "",
      fullDescription: item.fullDescription || "",
      hourlyRate: item.hourlyRate || 0,
      currency: item.currency || "INR",
      estimatedDelivery: item.estimatedDelivery || "",
      recommendedDuration: item.recommendedDuration || "",
      complexity: item.complexity || "MEDIUM",
      tags: (item.tags || []).join(", "),
      badge: item.badge || "",
      status: item.status || "PUBLISHED",
      featured: item.featured || false,
      displayOrder: item.displayOrder || 0,
      ctaText: item.ctaText || "",
      ctaLink: item.ctaLink || "",
      categoryIds: (item.categories || []).map((c: any) => c.id),
    });
    setIsModalOpen(true);
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      thumbnail: form.thumbnail,
      previewType: form.previewType,
      previewUrl: form.previewUrl,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription || undefined,
      hourlyRate: Number(form.hourlyRate),
      currency: form.currency,
      estimatedDelivery: form.estimatedDelivery || undefined,
      recommendedDuration: form.recommendedDuration || undefined,
      complexity: form.complexity,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      badge: form.badge || undefined,
      status: form.status,
      featured: form.featured,
      displayOrder: Number(form.displayOrder),
      ctaText: form.ctaText || undefined,
      ctaLink: form.ctaLink || undefined,
      categoryIds: form.categoryIds,
    };

    try {
      if (editingId) {
        await api.videoCatalog.update(editingId, payload);
      } else {
        await api.videoCatalog.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`Failed to save video service: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video service card?")) return;
    try {
      await api.videoCatalog.delete(id);
      fetchData();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.videoCatalog.createCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      fetchData();
    } catch (err: any) {
      alert(`Failed to create category: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Cards in it will become uncategorized.")) return;
    try {
      await api.videoCatalog.deleteCategory(id);
      fetchData();
    } catch (err: any) {
      alert(`Failed to delete category: ${err.message}`);
    }
  };

  const rows: VideoItemRow[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    categories: (item.categories || []).map((c: any) => c.name).join(", ") || "Uncategorized",
    hourlyRate: item.hourlyRate,
    currency: item.currency,
    status: item.status,
    featured: item.featured,
  }));

  const columns = [
    {
      key: "title",
      header: "Service Card",
      render: (item: VideoItemRow) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-9 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {item.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Video className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="font-medium text-white text-sm">{item.title}</div>
        </div>
      ),
    },
    { key: "categories", header: "Categories" },
    {
      key: "hourlyRate",
      header: "Rate",
      render: (item: VideoItemRow) => (
        <span className="font-mono text-primary">
          {item.currency === "INR" ? "₹" : "$"}
          {item.hourlyRate}/hr
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (item: VideoItemRow) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.featured
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
          }`}
        >
          {item.featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: VideoItemRow) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === "PUBLISHED"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Video Editing Catalog
          </h1>
          <p className="text-sm text-gray-400">Manage the service cards shown on the /services/video-editing page.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            <Tag className="w-4 h-4" />
            Categories
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
          >
            <Plus className="w-4 h-4" />
            Add Service Card
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">Error: {error}</div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading video catalog...</div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          onEdit={(row) => openEditModal(items.find((i) => i.id === row.id))}
          onDelete={(row) => handleDelete(row.id)}
          emptyMessage="No video service cards yet. Add your first one."
        />
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-3xl shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit Service Card" : "Add Service Card"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Instagram Reels & TikToks" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Thumbnail Image URL</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Preview Type</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={form.previewType} onChange={(e) => setForm({ ...form, previewType: e.target.value })}>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="VIMEO">Vimeo</option>
                    <option value="DIRECT">Direct MP4</option>
                    <option value="INSTAGRAM">Instagram Reel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Preview URL</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.previewUrl} onChange={(e) => setForm({ ...form, previewUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                  <textarea required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white min-h-[70px]" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Full Description (Optional)</label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white min-h-[70px]" value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Hourly Rate</label>
                  <input type="number" min={0} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Currency</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estimated Delivery</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.estimatedDelivery} onChange={(e) => setForm({ ...form, estimatedDelivery: e.target.value })} placeholder="24-48 Hours" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Recommended Duration</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.recommendedDuration} onChange={(e) => setForm({ ...form, recommendedDuration: e.target.value })} placeholder="15-60 Seconds" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Complexity</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={form.complexity} onChange={(e) => setForm({ ...form, complexity: e.target.value })}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Badge (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Popular" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Trending, Fast Delivery, Social Media" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Categories</label>
                  <div className="flex flex-wrap gap-3 rounded-lg border border-white/10 p-3 bg-black/10">
                    {categories.length === 0 && <span className="text-sm text-gray-500">No categories yet — add one from the Categories button.</span>}
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                        <input type="checkbox" checked={form.categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="PUBLISHED">Published</option>
                    <option value="HIDDEN">Hidden</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-white">Feature this card</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">CTA Text (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Request Quote" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CTA Link (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/contact?service=video-reels" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORIES MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
              <input type="text" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Short-form" />
              <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {categories.length === 0 && <p className="text-sm text-gray-500">No categories yet.</p>}
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-sm text-white">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
