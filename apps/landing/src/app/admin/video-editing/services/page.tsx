"use client";

import { useState } from "react";
import { Plus, GripVertical, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useVideoServices } from "@/hooks/useVideoServices";
import { AdminVideoEditor } from "@/components/admin/AdminVideoEditor";
import type { VideoEditingService } from "@/types/video-editing";

export default function AdminVideoServicesPage() {
  const { services, loading, deleteService, updateService } = useVideoServices();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<VideoEditingService | null>(null);

  if (loading) return <div className="text-white">Loading...</div>;

  const handleEdit = (service: VideoEditingService) => {
    setEditingService(service);
    setIsEditorOpen(true);
  };

  const handleCreateNew = () => {
    setEditingService(null);
    setIsEditorOpen(true);
  };

  const toggleVisibility = (service: VideoEditingService) => {
    const newStatus = service.status === "published" ? "hidden" : "published";
    updateService(service.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.8rem] font-black text-white">Video Editing Services</h1>
          <p className="text-[0.9rem] text-white/60">Manage your catalog of video editing services.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-4 py-2 font-bold text-black transition hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-5 w-5" />
          Add New Service
        </button>
      </div>

      <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_120px_100px_140px] items-center gap-4 border-b border-white/10 bg-white/5 px-6 py-4 text-[0.85rem] font-bold text-white/60">
          <div className="w-8"></div>
          <div>Service Detail</div>
          <div>Hourly Rate</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {services.sort((a, b) => a.displayOrder - b.displayOrder).map((service) => (
            <div key={service.id} className="grid grid-cols-[auto_1fr_120px_100px_140px] items-center gap-4 px-6 py-4 transition hover:bg-white/[0.02]">
              {/* Drag Handle */}
              <button className="flex h-8 w-8 items-center justify-center text-white/20 hover:text-white cursor-grab">
                <GripVertical className="h-4 w-4" />
              </button>

              {/* Service Info */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-20 overflow-hidden rounded-[6px] bg-black">
                  <img src={service.thumbnail} alt={service.title} className="h-full w-full object-cover opacity-80" />
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-bold text-white">{service.title}</h4>
                  <p className="text-[0.75rem] text-white/50">{service.slug}</p>
                </div>
              </div>

              {/* Price */}
              <div className="font-mono text-[0.9rem] text-white">
                {service.currency === "INR" ? "₹" : "$"}{service.hourlyRate}/hr
              </div>

              {/* Status */}
              <div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ${
                  service.status === "published" ? "bg-[#25D366]/20 text-[#25D366]" : "bg-white/10 text-white/50"
                }`}>
                  {service.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => toggleVisibility(service)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/40 hover:bg-white/10 hover:text-white transition"
                  title={service.status === "published" ? "Hide Service" : "Publish Service"}
                >
                  {service.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/40 hover:bg-white/10 hover:text-white transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this service?")) {
                      deleteService(service.id);
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
        <AdminVideoEditor
          service={editingService}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
