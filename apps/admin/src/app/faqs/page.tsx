"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, HelpCircle, X, Save } from "lucide-react";

interface FAQData {
  id: string;
  question: string;
  answer: string;
  category: string;
  visibility: "Visible" | "Hidden";
}

const mockFaqs: FAQData[] = [
  { id: "1", question: "How long does SEO take?", answer: "Usually 3-6 months...", category: "SEO", visibility: "Visible" },
  { id: "2", question: "Do you offer refunds?", answer: "No, but we guarantee...", category: "General", visibility: "Visible" },
];

export default function FAQManager() {
  const [data, setData] = useState<FAQData[]>(mockFaqs);
  const [isEditing, setIsEditing] = useState<FAQData | null>(null);

  const columns = [
    { key: "question", header: "Question" },
    { key: "category", header: "Category" },
    {
      key: "visibility",
      header: "Visibility",
      render: (item: FAQData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.visibility === 'Visible' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
        }`}>
          {item.visibility}
        </span>
      )
    },
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
        <button 
          onClick={() => setIsEditing({ id: Date.now().toString(), question: "", answer: "", category: "General", visibility: "Visible" })}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
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
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold text-white">
                {isEditing.question ? "Edit FAQ" : "New FAQ"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Question</label>
                <input 
                  type="text" 
                  value={isEditing.question}
                  onChange={(e) => setIsEditing({ ...isEditing, question: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Answer</label>
                <textarea 
                  value={isEditing.answer}
                  onChange={(e) => setIsEditing({ ...isEditing, answer: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Category</label>
                  <select 
                    value={isEditing.category}
                    onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  >
                    <option value="General">General</option>
                    <option value="SEO">SEO</option>
                    <option value="Web Dev">Web Dev</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Visibility</label>
                  <select 
                    value={isEditing.visibility}
                    onChange={(e) => setIsEditing({ ...isEditing, visibility: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                  >
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 p-4 flex justify-end gap-3">
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
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
