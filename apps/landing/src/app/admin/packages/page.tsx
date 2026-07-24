"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { usePackages } from "@/hooks/usePackages";
import { AdminPackageEditor } from "@/components/admin/AdminPackageEditor";
import type { MarketingPackage } from "@/types/packages";

export default function AdminPackagesPage() {
  const { packages, loading, deletePackage, updatePackage } = usePackages();
  const [editingPackage, setEditingPackage] = useState<MarketingPackage | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  const handleEdit = (pkg: MarketingPackage) => {
    setEditingPackage(pkg);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setIsEditorOpen(true);
  };

  const toggleStatus = (pkg: MarketingPackage) => {
    const newStatus = pkg.status === "published" ? "draft" : "published";
    updatePackage(pkg.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.8rem] font-bold text-white tracking-tight">Packages Setup</h1>
          <p className="mt-1 text-[0.9rem] text-white/50">Manage marketing packages, features, and pricing.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-4 py-2.5 text-[0.9rem] font-bold text-black transition-transform hover:scale-[1.02] hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)]"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </button>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-white/10 bg-[var(--surface)]">
        <table className="w-full text-left text-[0.9rem]">
          <thead className="bg-black/20 text-[0.75rem] font-bold uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Monthly Price</th>
              <th className="px-6 py-4">Yearly Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                      {/* Using first letter as a placeholder icon for admin table */}
                      {pkg.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        {pkg.name}
                        {pkg.featured && (
                          <span className="rounded bg-[var(--accent)] px-1.5 py-0.5 text-[0.6rem] text-black">Featured</span>
                        )}
                      </div>
                      <div className="text-[0.75rem] text-white/50">{pkg.subtitle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-white/70">
                  {pkg.priceMonthly ? `₹${pkg.priceMonthly.toLocaleString()}` : "Custom"}
                </td>
                <td className="px-6 py-4 font-medium text-white/70">
                  {pkg.priceYearly ? `₹${pkg.priceYearly.toLocaleString()}` : "Custom"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${
                      pkg.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {pkg.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleStatus(pkg)}
                      className="rounded-[6px] p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
                      title={pkg.status === "published" ? "Hide" : "Publish"}
                    >
                      {pkg.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="rounded-[6px] p-2 text-white/40 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${pkg.name}?`)) {
                          deletePackage(pkg.id);
                        }
                      }}
                      className="rounded-[6px] p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {packages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                  No packages found. Create your first package to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditorOpen && (
        <AdminPackageEditor
          pkg={editingPackage}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
