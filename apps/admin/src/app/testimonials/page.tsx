"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, MessageSquare, X, Save, RefreshCw, Trash } from "lucide-react";
import { api, getDataArray } from "@/services/api";

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  featured: boolean;
  status: string;
}

export default function TestimonialsManager() {
  const [data, setData] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: "",
    clientTitle: "",
    companyName: "",
    content: "",
    rating: 5,
    status: "APPROVED",
    isFeatured: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.testimonials.getAll() as any;
      const mappedData: TestimonialData[] = getDataArray<any>(response).map((t: any) => ({
        id: t.id,
        name: t.clientName,
        role: t.clientTitle || "",
        company: t.companyName || "",
        quote: t.content,
        rating: t.rating || 5,
        featured: t.isFeatured || false,
        status: t.status || "APPROVED"
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.testimonials.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete testimonial: " + err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.testimonials.create(newTestimonial);
      setIsModalOpen(false);
      setNewTestimonial({ clientName: "", clientTitle: "", companyName: "", content: "", rating: 5, status: "APPROVED", isFeatured: false });
      fetchData();
    } catch (err: any) {
      alert("Failed to create testimonial: " + err.message);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Client",
      render: (item: TestimonialData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
             <span className="text-xs font-bold text-gray-400">{item.name.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.name}</div>
            <div className="text-xs text-gray-500">{item.role}{item.role && item.company ? ', ' : ''}{item.company}</div>
          </div>
        </div>
      )
    },
    { 
      key: "rating", 
      header: "Rating",
      render: (item: TestimonialData) => (
        <span className="text-yellow-400 text-sm">{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</span>
      )
    },
    {
      key: "featured",
      header: "Featured",
      render: (item: TestimonialData) => (
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
      render: (item: TestimonialData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: TestimonialData) => (
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
            <MessageSquare className="w-6 h-6 text-primary" />
            Testimonials
          </h1>
          <p className="text-sm text-gray-400">Manage client reviews and social proof.</p>
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
            Add Testimonial
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading Testimonials...</div>
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
              <h2 className="text-xl font-bold text-white">Add Testimonial</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newTestimonial.clientName} onChange={e => setNewTestimonial({...newTestimonial, clientName: e.target.value})} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newTestimonial.companyName} onChange={e => setNewTestimonial({...newTestimonial, companyName: e.target.value})} placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newTestimonial.clientTitle} onChange={e => setNewTestimonial({...newTestimonial, clientTitle: e.target.value})} placeholder="CEO" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rating (1-5)</label>
                  <input required type="number" min="1" max="5" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newTestimonial.rating} onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value) || 5})} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Testimonial Quote</label>
                <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newTestimonial.content} onChange={e => setNewTestimonial({...newTestimonial, content: e.target.value})} placeholder="What did the client say?"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newTestimonial.status} onChange={e => setNewTestimonial({...newTestimonial, status: e.target.value})}>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="flex flex-col justify-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newTestimonial.isFeatured} onChange={e => setNewTestimonial({...newTestimonial, isFeatured: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                    <span className="text-sm text-white">Feature on Homepage</span>
                  </label>
                </div>
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
