"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Briefcase, X, Save } from "lucide-react";
import { ImageUploader } from "@/components/forms/ImageUploader";

interface ProjectData {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoLink?: string;
  status: "Active" | "Draft";
}

const mockProjects: ProjectData[] = [
  { id: "1", title: "TechCorp Rebrand", category: "Design", thumbnail: "", status: "Active" },
  { id: "2", title: "E-Commerce App", category: "Web Dev", thumbnail: "", status: "Active" },
  { id: "3", title: "Promo Video", category: "Video", thumbnail: "", status: "Draft" },
];

export default function PortfolioManager() {
  const [data, setData] = useState<ProjectData[]>(mockProjects);
  const [isEditing, setIsEditing] = useState<ProjectData | null>(null);

  const columns = [
    {
      key: "title",
      header: "Project Title",
      render: (item: ProjectData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Briefcase className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <span className="font-medium text-white">{item.title}</span>
        </div>
      )
    },
    { key: "category", header: "Category" },
    {
      key: "status",
      header: "Status",
      render: (item: ProjectData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Portfolio Manager</h1>
          <p className="text-sm text-gray-400">Manage your past projects and case studies.</p>
        </div>
        <button 
          onClick={() => setIsEditing({ id: Date.now().toString(), title: "", category: "", thumbnail: "", status: "Draft" })}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        onEdit={(item) => setIsEditing(item)}
        onDelete={(item) => setData(data.filter(d => d.id !== item.id))}
      />

      {/* Basic Modal for Editing */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold text-white">
                {isEditing.title ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Project Title</label>
                  <input 
                    type="text" 
                    value={isEditing.title}
                    onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Category</label>
                  <input 
                    type="text" 
                    value={isEditing.category}
                    onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Video Link (YouTube / Vimeo)</label>
                <input 
                  type="text" 
                  value={isEditing.videoLink || ""}
                  onChange={(e) => setIsEditing({ ...isEditing, videoLink: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <ImageUploader 
                label="Project Thumbnail" 
                value={isEditing.thumbnail}
                onChange={(url) => setIsEditing({ ...isEditing, thumbnail: url })}
              />
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
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
