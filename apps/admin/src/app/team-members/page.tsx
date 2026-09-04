"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DataTable } from "@/components/DataTable";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Plus, Users, X, Save, RefreshCw, Trash } from "lucide-react";
import { api, getDataArray } from "@/services/api";

interface TeamMemberData {
  id: string;
  name: string;
  designation: string;
  image: string;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  designation: "",
  bio: "",
  image: "",
  linkedin: "",
  email: "",
  isActive: true,
  displayOrder: 0,
};

function getRequestMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  if (error.message.includes("401")) {
    return "Team members could not be loaded because the API requires authorization. Please redeploy the backend with the public team-member read fix.";
  }
  return error.message || fallback;
}

export default function TeamMembersManager() {
  const [data, setData] = useState<TeamMemberData[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.websiteTeam.getAll() as any;
      const list = getDataArray<any>(response);
      setRawData(list);
      const mappedData: TeamMemberData[] = list.map((member: any) => ({
        id: member.id,
        name: member.name,
        designation: member.designation,
        image: member.image || "",
        isActive: member.isActive ?? true
      }));
      setData(mappedData);
    } catch (err) {
      console.error(err);
      setError(getRequestMessage(err, "Failed to fetch team members"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await api.websiteTeam.delete(id);
      fetchData();
    } catch (err) {
      alert(getRequestMessage(err, "Failed to delete team member"));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (row: TeamMemberData) => {
    const member = rawData.find((m) => m.id === row.id);
    if (!member) return;
    setEditingId(member.id);
    setForm({
      name: member.name || "",
      designation: member.designation || "",
      bio: member.bio || "",
      image: member.image || "",
      linkedin: member.socialLinks?.linkedin || "",
      email: member.socialLinks?.email || "",
      isActive: member.isActive ?? true,
      displayOrder: member.displayOrder || 0,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    const socialLinks: Record<string, string> = {};
    if (form.linkedin.trim()) socialLinks.linkedin = form.linkedin.trim();
    if (form.email.trim()) socialLinks.email = form.email.trim();

    const payload = {
      name: form.name,
      designation: form.designation,
      bio: form.bio || undefined,
      image: form.image || undefined,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      isActive: form.isActive,
      displayOrder: Number(form.displayOrder),
    };

    try {
      if (editingId) {
        await api.websiteTeam.update(editingId, payload);
      } else {
        await api.websiteTeam.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(getRequestMessage(err, `Failed to ${editingId ? "update" : "create"} team member`));
    }
  };

  const columns = [
    {
      key: "name",
      header: "Member",
      render: (item: TeamMemberData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-gray-400">{item.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.name}</div>
            <div className="text-xs text-primary">{item.designation}</div>
          </div>
        </div>
      )
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: TeamMemberData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.isActive ? 'Active' : 'Hidden'}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: TeamMemberData) => (
        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <Trash className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Team Members
          </h1>
          <p className="text-sm text-gray-400">Manage the public-facing website team directory.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading Team Members...</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={openEditModal}
        />
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit Team Member" : "Add Team Member"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Photo</label>
                <ImageUploader value={form.image} onChange={(image) => setForm({ ...form, image })} folder="team" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role / Designation</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} placeholder="Creative Director" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Short Bio</label>
                <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Brief bio..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">LinkedIn URL (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email (Optional)</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@simbolo.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Display Order</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.displayOrder} onChange={e => setForm({...form, displayOrder: parseInt(e.target.value) || 0})} />
                </div>
                <div className="flex flex-col justify-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-white">Active (Visible on Site)</span>
                  </label>
                </div>
              </div>

              {modalError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{modalError}</div>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
