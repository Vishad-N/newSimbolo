"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, MessageSquare, X, Save } from "lucide-react";
import { ImageUploader } from "@/components/forms/ImageUploader";

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image: string;
  featured: boolean;
}

const mockTestimonials: TestimonialData[] = [
  { id: "1", name: "Rohit Sharma", role: "CEO", company: "FitLife Gym", quote: "Amazing work!", rating: 5, image: "", featured: true },
  { id: "2", name: "Neha Gupta", role: "Founder", company: "Glow Skincare", quote: "Increased our sales by 200%.", rating: 5, image: "", featured: true },
];

export default function TestimonialsManager() {
  const [data, setData] = useState<TestimonialData[]>(mockTestimonials);
  const [isEditing, setIsEditing] = useState<TestimonialData | null>(null);

  const columns = [
    {
      key: "name",
      header: "Client",
      render: (item: TestimonialData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-gray-400">{item.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.name}</div>
            <div className="text-xs text-gray-500">{item.role}, {item.company}</div>
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
          {item.featured ? "Featured" : "Standard"}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Testimonials
          </h1>
          <p className="text-sm text-gray-400">Manage client reviews and success stories.</p>
        </div>
        <button 
          onClick={() => setIsEditing({ id: Date.now().toString(), name: "", role: "", company: "", quote: "", rating: 5, image: "", featured: false })}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        onEdit={(item) => setIsEditing(item)}
        onDelete={(item) => setData(data.filter(d => d.id !== item.id))}
      />

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold text-white">
                {isEditing.name ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Client Name</label>
                  <input 
                    type="text" 
                    value={isEditing.name}
                    onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Rating (1-5)</label>
                  <input 
                    type="number" 
                    min="1" max="5"
                    value={isEditing.rating}
                    onChange={(e) => setIsEditing({ ...isEditing, rating: parseInt(e.target.value) || 5 })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Role / Title</label>
                  <input 
                    type="text" 
                    value={isEditing.role}
                    onChange={(e) => setIsEditing({ ...isEditing, role: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Company Name</label>
                  <input 
                    type="text" 
                    value={isEditing.company}
                    onChange={(e) => setIsEditing({ ...isEditing, company: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Review / Quote</label>
                <textarea 
                  value={isEditing.quote}
                  onChange={(e) => setIsEditing({ ...isEditing, quote: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white min-h-[100px] resize-y"
                />
              </div>

              <ImageUploader 
                label="Client Photo" 
                value={isEditing.image}
                onChange={(url) => setIsEditing({ ...isEditing, image: url })}
              />

              <label className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors">
                <input 
                  type="checkbox" 
                  checked={isEditing.featured}
                  onChange={(e) => setIsEditing({ ...isEditing, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary"
                />
                <span className="text-sm font-medium text-white">Featured Review (Shows on homepage)</span>
              </label>
            </div>
            
            <div className="sticky bottom-0 bg-surface/95 backdrop-blur z-10 border-t border-white/10 p-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditing(null)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const isExisting = data.find(d => d.id === isEditing.id);
                  if (isExisting) {
                    setData(data.map(d => d.id === isEditing.id ? isEditing : d));
                  } else {
                    setData([isEditing, ...data]);
                  }
                  setIsEditing(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
              >
                <Save className="w-4 h-4" />
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
