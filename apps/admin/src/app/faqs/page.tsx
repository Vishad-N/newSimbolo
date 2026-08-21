"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, HelpCircle, X, Save, RefreshCw, Trash } from "lucide-react";
import { api, getDataArray } from "@/services/api";

interface FAQData {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
}

export default function FAQManager() {
  const [data, setData] = useState<FAQData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", categoryId: "", status: "PUBLISHED" });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Need to use raw fetch for categories since it's not explicitly in api.ts
      const [faqsRes, catRes] = await Promise.all([
        api.faqs.getAll(),
        fetch(`${api.config.baseURL}/faqs/categories`).then(r => r.json())
      ]) as [any, any];
      
      setCategories(getDataArray(catRes));

      const mappedData: FAQData[] = getDataArray<any>(faqsRes).map((faq: any) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category?.name || "General",
        status: faq.status || "PUBLISHED"
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await api.faqs.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete FAQ: " + err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.faqs.create({
        question: newFaq.question,
        answer: newFaq.answer,
        categoryId: newFaq.categoryId || undefined,
        status: newFaq.status
      });
      setIsModalOpen(false);
      setNewFaq({ question: "", answer: "", categoryId: "", status: "PUBLISHED" });
      fetchData();
    } catch (err: any) {
      alert("Failed to create FAQ: " + err.message);
    }
  };

  const columns = [
    { key: "question", header: "Question" },
    { key: "category", header: "Category" },
    {
      key: "status",
      header: "Status",
      render: (item: FAQData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: FAQData) => (
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
            <HelpCircle className="w-6 h-6 text-primary" />
            FAQ Manager
          </h1>
          <p className="text-sm text-gray-400">Manage frequently asked questions.</p>
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
            Add FAQ
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading FAQs...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
        />
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create New FAQ</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Question</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} placeholder="e.g. How long does SEO take?" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Answer</label>
                <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} placeholder="Enter answer here..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newFaq.categoryId} onChange={e => setNewFaq({...newFaq, categoryId: e.target.value})}>
                    <option value="">General (No Category)</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newFaq.status} onChange={e => setNewFaq({...newFaq, status: e.target.value})}>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">Create FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
