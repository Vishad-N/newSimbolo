"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Search, X, Save, RefreshCw, Trash } from "lucide-react";
import { api } from "@/services/api";

interface SEOData {
  id: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
}

export default function GlobalSEOSettings() {
  const [data, setData] = useState<SEOData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeo, setNewSeo] = useState({
    path: "/",
    metaTitle: "",
    metaDescription: "",
    keywords: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.seo.getAll() as any;
      const mappedData: SEOData[] = (response.data || response).map((seo: any) => ({
        id: seo.id,
        path: seo.path,
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch SEO rules");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SEO rule?")) return;
    try {
      await api.seo.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete SEO rule: " + err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.seo.create(newSeo);
      setIsModalOpen(false);
      setNewSeo({ path: "/", metaTitle: "", metaDescription: "", keywords: "" });
      fetchData();
    } catch (err: any) {
      alert("Failed to create SEO rule: " + err.message);
    }
  };

  const columns = [
    {
      key: "path",
      header: "Path",
      render: (item: SEOData) => (
        <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">{item.path}</span>
      )
    },
    {
      key: "metaTitle",
      header: "Meta Title",
      render: (item: SEOData) => (
        <div className="font-medium text-white text-sm truncate max-w-xs">{item.metaTitle}</div>
      )
    },
    {
      key: "metaDescription",
      header: "Meta Description",
      render: (item: SEOData) => (
        <div className="text-gray-400 text-xs truncate max-w-md">{item.metaDescription}</div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: SEOData) => (
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
            <Search className="w-6 h-6 text-primary" />
            SEO Management
          </h1>
          <p className="text-sm text-gray-400">Manage SEO metadata tags per route.</p>
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
            Add SEO Rule
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading SEO Rules...</div>
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
              <h2 className="text-xl font-bold text-white">Add SEO Rule</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Route Path (e.g., /, /about, /services/seo)</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono" value={newSeo.path} onChange={e => setNewSeo({...newSeo, path: e.target.value})} placeholder="/" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Meta Title</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newSeo.metaTitle} onChange={e => setNewSeo({...newSeo, metaTitle: e.target.value})} placeholder="Title of the page" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
                <textarea required rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newSeo.metaDescription} onChange={e => setNewSeo({...newSeo, metaDescription: e.target.value})} placeholder="Brief description of the page content for search engines..."></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Keywords (Comma separated)</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newSeo.keywords} onChange={e => setNewSeo({...newSeo, keywords: e.target.value})} placeholder="seo, marketing, agency" />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
