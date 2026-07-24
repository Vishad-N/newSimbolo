"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Cpu, X, Save } from "lucide-react";
import { ImageUploader } from "@/components/forms/ImageUploader";

interface TechData {
  id: string;
  name: string;
  category: string;
  website: string;
  description: string;
  logo: string;
  color: string;
}

const mockTech: TechData[] = [
  { id: "1", name: "Next.js", category: "Framework", website: "nextjs.org", description: "React Framework", logo: "", color: "#ffffff" },
];

export default function TechnologiesManager() {
  const [data, setData] = useState<TechData[]>(mockTech);
  const [isEditing, setIsEditing] = useState<TechData | null>(null);

  const columns = [
    {
      key: "name",
      header: "Technology",
      render: (item: TechData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {item.logo ? <img src={item.logo} alt={item.name} /> : <span style={{ color: item.color }}>●</span>}
          </div>
          <span className="font-medium text-white">{item.name}</span>
        </div>
      )
    },
    { key: "category", header: "Category" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2"><Cpu className="w-6 h-6 text-primary" /> Tech Stack</h1>
        <button onClick={() => setIsEditing({ id: Date.now().toString(), name: "", category: "", website: "", description: "", logo: "", color: "#ffffff" })} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg">
          <Plus className="w-4 h-4" /> Add Tech
        </button>
      </div>

      <DataTable columns={columns} data={data} onEdit={(item) => setIsEditing(item)} onDelete={(item) => setData(data.filter(d => d.id !== item.id))} />

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold text-white">{isEditing.name ? "Edit Tech" : "New Tech"}</h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Name</label>
                  <input type="text" value={isEditing.name} onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Category</label>
                  <input type="text" value={isEditing.category} onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white" />
                </div>
              </div>
              <ImageUploader label="Logo SVG/PNG" value={isEditing.logo} onChange={(url) => setIsEditing({ ...isEditing, logo: url })} />
            </div>
            <div className="border-t border-white/10 p-4 flex justify-end gap-3">
              <button onClick={() => setIsEditing(null)} className="px-4 py-2 bg-transparent text-gray-300">Cancel</button>
              <button onClick={() => {
                setData(data.find(d => d.id === isEditing.id) ? data.map(d => d.id === isEditing.id ? isEditing : d) : [...data, isEditing]);
                setIsEditing(null);
              }} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
