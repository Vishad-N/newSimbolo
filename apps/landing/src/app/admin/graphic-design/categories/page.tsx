"use client";

import { useState } from "react";
import { Plus, GripVertical, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useGraphicDesignServices } from "@/hooks/useGraphicDesignServices";
import { AdminGraphicEditor } from "@/components/admin/AdminGraphicEditor";
import type { DesignCategory } from "@/types/graphic-design";

export default function AdminGraphicCategoriesPage() {
  const { categories, loading, deleteCategory, updateCategory } = useGraphicDesignServices();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DesignCategory | null>(null);

  if (loading) return <div className="text-white">Loading...</div>;

  const handleEdit = (category: DesignCategory) => {
    setEditingCategory(category);
    setIsEditorOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    setIsEditorOpen(true);
  };

  const toggleVisibility = (category: DesignCategory) => {
    const newStatus = category.status === "published" ? "hidden" : "published";
    updateCategory(category.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.8rem] font-black text-white">Graphic Design Categories</h1>
          <p className="text-[0.9rem] text-white/60">Manage your showcase of design capabilities.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-4 py-2 font-bold text-black transition hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)]"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] overflow-hidden shadow-xl">
        <div className="grid grid-cols-[auto_1fr_120px_140px] items-center gap-4 border-b border-white/10 bg-white/5 px-6 py-4 text-[0.85rem] font-bold text-white/60">
          <div className="w-8"></div>
          <div>Category Detail</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {categories.sort((a, b) => a.displayOrder - b.displayOrder).map((category) => (
            <div key={category.id} className="grid grid-cols-[auto_1fr_120px_140px] items-center gap-4 px-6 py-4 transition hover:bg-white/[0.02]">
              {/* Drag Handle */}
              <button className="flex h-8 w-8 items-center justify-center text-white/20 hover:text-white cursor-grab">
                <GripVertical className="h-4 w-4" />
              </button>

              {/* Category Info */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-20 overflow-hidden rounded-[6px] bg-black/50 border border-white/10">
                  <img src={category.thumbnail} alt={category.title} className="h-full w-full object-cover opacity-80" />
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-bold text-white">{category.title}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[0.7rem] text-white/40">{category.deliverables.length} Deliverables</span>
                    <span className="text-[0.7rem] text-white/40">•</span>
                    <span className="text-[0.7rem] text-white/40">{category.skills.length} Skills</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider ${
                  category.status === "published" ? "bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30" : "bg-white/10 text-white/50 border border-white/10"
                }`}>
                  {category.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => toggleVisibility(category)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/40 hover:bg-white/10 hover:text-white transition"
                  title={category.status === "published" ? "Hide Category" : "Publish Category"}
                >
                  {category.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(category)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/40 hover:bg-white/10 hover:text-[var(--accent)] transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${category.title}?`)) {
                      deleteCategory(category.id);
                    }
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/40 hover:bg-red-500/20 hover:text-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <AdminGraphicEditor
          category={editingCategory}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
