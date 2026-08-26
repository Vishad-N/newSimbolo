"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Briefcase, X, Save, RefreshCw, Trash, Upload, Loader2 } from "lucide-react";
import { api, getDataArray } from "@/services/api";

interface CaseStudyData {
  id: string;
  title: string;
  client: string;
  industry: string;
  status: string;
}

export default function CaseStudiesManagerPage() {
  const [data, setData] = useState<CaseStudyData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCaseStudy, setNewCaseStudy] = useState({
    title: "",
    summary: "",
    challenge: "",
    solution: "",
    results: "",
    clientName: "",
    industry: "",
    categoryId: "",
    status: "PUBLISHED"
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [csRes, catRes] = await Promise.all([
        api.caseStudies.getAll(),
        fetch(`${api.config.baseURL}/case-studies/categories`).then(r => r.json())
      ]) as [any, any];
      
      setCategories(getDataArray(catRes));

      const mappedData: CaseStudyData[] = getDataArray<any>(csRes).map((cs: any) => ({
        id: cs.id,
        title: cs.title,
        client: cs.clientName || "Unknown Client",
        industry: cs.industry || "General",
        status: cs.status || "PUBLISHED"
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch case studies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await api.caseStudies.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete case study: " + err.message);
    }
  };

  const resetForm = () => {
    setNewCaseStudy({ title: "", summary: "", challenge: "", solution: "", results: "", clientName: "", industry: "", categoryId: "", status: "PUBLISHED" });
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const handleImageSelect = (file: File | null) => {
    setCoverImageFile(file);
    setCoverImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let coverImageId: string | undefined;
      if (coverImageFile) {
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append("file", coverImageFile);
        formData.append("folder", "case-studies");
        const media = (await api.media.upload(formData)) as { id: string };
        coverImageId = media.id;
        setIsUploadingImage(false);
      }

      await api.caseStudies.create({
        title: newCaseStudy.title,
        summary: newCaseStudy.summary,
        challenge: newCaseStudy.challenge,
        solution: newCaseStudy.solution,
        results: newCaseStudy.results,
        clientName: newCaseStudy.clientName,
        industry: newCaseStudy.industry,
        categoryId: newCaseStudy.categoryId || undefined,
        status: newCaseStudy.status,
        coverImageId,
      });
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setIsUploadingImage(false);
      alert("Failed to create case study: " + err.message);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Case Study",
      render: (item: CaseStudyData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.title}</div>
            <div className="text-xs text-gray-500">{item.client}</div>
          </div>
        </div>
      )
    },
    { key: "industry", header: "Industry" },
    {
      key: "status",
      header: "Status",
      render: (item: CaseStudyData) => (
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
      render: (item: CaseStudyData) => (
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
            <Briefcase className="w-6 h-6 text-primary" />
            Case Studies
          </h1>
          <p className="text-sm text-gray-400">Manage client success stories and metrics.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
          >
            <Plus className="w-4 h-4" />
            Add Case Study
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading Case Studies...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
        />
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add Case Study</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newCaseStudy.title} onChange={e => setNewCaseStudy({...newCaseStudy, title: e.target.value})} placeholder="e.g. Scaling FinTech by 400%" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
                  {coverImagePreview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleImageSelect(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-lg border border-dashed border-white/20 bg-white/5 text-gray-400 hover:bg-white/10 cursor-pointer transition-colors">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Click to upload a cover image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageSelect(e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newCaseStudy.clientName} onChange={e => setNewCaseStudy({...newCaseStudy, clientName: e.target.value})} placeholder="Acme FinTech" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Industry</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newCaseStudy.industry} onChange={e => setNewCaseStudy({...newCaseStudy, industry: e.target.value})} placeholder="Finance" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Executive Summary</label>
                <textarea required rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newCaseStudy.summary} onChange={e => setNewCaseStudy({...newCaseStudy, summary: e.target.value})} placeholder="Brief overview of the project..."></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">The Challenge</label>
                <textarea required rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newCaseStudy.challenge} onChange={e => setNewCaseStudy({...newCaseStudy, challenge: e.target.value})} placeholder="What was the problem?"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">The Solution</label>
                <textarea required rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newCaseStudy.solution} onChange={e => setNewCaseStudy({...newCaseStudy, solution: e.target.value})} placeholder="What did we do?"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">The Results</label>
                <textarea required rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newCaseStudy.results} onChange={e => setNewCaseStudy({...newCaseStudy, results: e.target.value})} placeholder="Measurable outcomes..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newCaseStudy.categoryId} onChange={e => setNewCaseStudy({...newCaseStudy, categoryId: e.target.value})}>
                    <option value="">Uncategorized</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newCaseStudy.status} onChange={e => setNewCaseStudy({...newCaseStudy, status: e.target.value})}>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button
                  disabled={isUploadingImage}
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isUploadingImage ? "Uploading image..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
