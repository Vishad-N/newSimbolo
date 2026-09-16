"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Briefcase, X, Save, RefreshCw, Trash, Pencil } from "lucide-react";
import { api, getDataArray } from "@/services/api";
import { MediaSelector } from "@/components/shared/MediaSelector";

interface ProjectData {
  id: string;
  title: string;
  clientName: string;
  category: string;
  service: string;
  thumbnail: string;
  status: string;
  featured: boolean;
}

const emptyProject = {
  title: "",
  clientName: "",
  categoryId: "",
  serviceId: "",
  status: "PUBLISHED",
  isFeatured: false,
  liveUrl: "",
  coverImageId: "",
  coverImageUrl: "",
};

export default function PortfolioManager() {
  const [data, setData] = useState<ProjectData[]>([]);
  const [rawProjects, setRawProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState(emptyProject);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projRes, catRes, svcRes] = await Promise.all([
        api.portfolio.getAll(),
        fetch(`${api.config.baseURL}/portfolio/categories`).then(r => r.json()),
        api.services.getAll(),
      ]) as [any, any, any];

      setCategories(getDataArray(catRes));
      setServices(getDataArray(svcRes));

      const projects = getDataArray<any>(projRes);
      setRawProjects(projects);

      const mappedData: ProjectData[] = projects.map((proj: any) => ({
        id: proj.id,
        title: proj.title,
        clientName: proj.clientName || "Unknown Client",
        category: proj.category?.name || "Uncategorized",
        service: proj.service?.name || "Not linked to a service",
        thumbnail: proj.coverImage?.secureUrl || proj.coverImage?.url || "",
        status: proj.status || "PUBLISHED",
        featured: proj.isFeatured || false
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch portfolio projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.portfolio.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setNewProject(emptyProject);
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    const proj = rawProjects.find(p => p.id === id);
    if (!proj) return;
    setEditingId(id);
    setNewProject({
      title: proj.title || "",
      clientName: proj.clientName || "",
      categoryId: proj.categoryId || proj.category?.id || "",
      serviceId: proj.serviceId || proj.service?.id || "",
      status: proj.status || "PUBLISHED",
      isFeatured: proj.isFeatured || false,
      liveUrl: proj.liveUrl || "",
      coverImageId: proj.coverImageId || proj.coverImage?.id || "",
      coverImageUrl: proj.coverImage?.secureUrl || proj.coverImage?.url || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newProject.title,
      clientName: newProject.clientName,
      categoryId: newProject.categoryId || undefined,
      serviceId: newProject.serviceId || undefined,
      status: newProject.status,
      isFeatured: newProject.isFeatured,
      liveUrl: newProject.liveUrl,
      coverImageId: newProject.coverImageId || undefined,
    };
    try {
      if (editingId) {
        await api.portfolio.update(editingId, payload);
      } else {
        await api.portfolio.create(payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setNewProject(emptyProject);
      fetchData();
    } catch (err: any) {
      alert(`Failed to ${editingId ? "update" : "create"} project: ` + err.message);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Project",
      render: (item: ProjectData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Briefcase className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.title}</div>
            <div className="text-xs text-gray-500">{item.clientName}</div>
          </div>
        </div>
      )
    },
    { key: "category", header: "Category" },
    { key: "service", header: "Service" },
    {
      key: "featured",
      header: "Featured",
      render: (item: ProjectData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.featured ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.featured ? "Yes" : "No"}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item: ProjectData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: ProjectData) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEditModal(item.id)} className="p-2 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Portfolio
          </h1>
          <p className="text-sm text-gray-400">Manage case studies and past work.</p>
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
            Add Project
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading Portfolio Projects...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
        />
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit Project" : "Add Project"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} placeholder="TechCorp Rebrand" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} placeholder="TechCorp" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Live URL (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newProject.liveUrl} onChange={e => setNewProject({...newProject, liveUrl: e.target.value})} placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newProject.categoryId} onChange={e => setNewProject({...newProject, categoryId: e.target.value})}>
                    <option value="">Uncategorized</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newProject.serviceId} onChange={e => setNewProject({...newProject, serviceId: e.target.value})}>
                    <option value="">Not linked to a service page</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Determines which service page (e.g. Graphic Design) shows this in its "Recent Our Work" gallery.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})}>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="flex flex-col justify-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newProject.isFeatured} onChange={e => setNewProject({...newProject, isFeatured: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-white">Feature Project</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Thumbnail</label>
                {newProject.coverImageUrl ? (
                  <div className="relative rounded-xl overflow-hidden group aspect-video bg-black/50 border border-white/10">
                    <img src={newProject.coverImageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                      <MediaSelector
                        triggerText="Replace"
                        folder="portfolio"
                        onSelect={(asset) => setNewProject({ ...newProject, coverImageId: asset.id, coverImageUrl: asset.secureUrl || asset.url })}
                      />
                      <button
                        type="button"
                        onClick={() => setNewProject({ ...newProject, coverImageId: "", coverImageUrl: "" })}
                        className="bg-red-500/20 text-red-300 hover:bg-red-500/40 px-3 py-2 rounded-md font-medium text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.02]">
                    <MediaSelector
                      triggerText="Browse Cloudinary Library"
                      folder="portfolio"
                      onSelect={(asset) => setNewProject({ ...newProject, coverImageId: asset.id, coverImageUrl: asset.secureUrl || asset.url })}
                    />
                    <p className="text-xs text-gray-500 mt-4">Select an existing asset or upload a new one. Shown as the card image in the public gallery.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
                  <Save className="w-4 h-4" /> {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
