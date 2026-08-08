"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { RichTextEditor } from "@/components/forms/RichTextEditor";

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";

  // Basic Info State
  const [title, setTitle] = useState(isNew ? "" : "Scaling a D2C Fashion Brand by 300%");
  const [slug, setSlug] = useState(isNew ? "" : "scaling-ecommerce-brand");
  const [clientName, setClientName] = useState(isNew ? "" : "Aura Apparel");
  const [industry, setIndustry] = useState(isNew ? "" : "E-Commerce");
  const [summary, setSummary] = useState(isNew ? "" : "How we leveraged full-funnel Meta Ads...");

  // Arrays State
  const [metrics, setMetrics] = useState(
    isNew ? [] : [
      { id: "1", label: "Revenue", value: "300", prefix: "+", suffix: "%", accent: "green" }
    ]
  );
  
  const [timeline, setTimeline] = useState(
    isNew ? [] : [
      { id: "1", title: "Discovery & Audit", description: "Deep dive into accounts." }
    ]
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 -my-4 mb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/case-studies')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? "Create Case Study" : "Edit Case Study"}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors border border-white/10">
            Save Draft
          </button>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
            <Save className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Basic Info Section */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Slug</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Client Name</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Industry</label>
            <select 
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none appearance-none"
            >
              <option>E-Commerce</option>
              <option>B2B SaaS</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-gray-400">Short Summary</label>
          <textarea 
            rows={3}
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none resize-none"
          />
        </div>
      </section>

      {/* Rich Text Editors */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Editorial Content</h2>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-400">The Challenge</label>
          <div className="h-48 border border-white/10 rounded-lg bg-background p-4 flex items-center justify-center text-muted-foreground italic">
            [Rich Text Editor Component Placeholder]
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <label className="text-sm font-medium text-gray-400">Our Strategy</label>
          <div className="h-48 border border-white/10 rounded-lg bg-background p-4 flex items-center justify-center text-muted-foreground italic">
            [Rich Text Editor Component Placeholder]
          </div>
        </div>
      </section>

      {/* KPI Metrics */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-white">KPI Dashboard Metrics</h2>
          <button 
            onClick={() => setMetrics([...metrics, { id: Date.now().toString(), label: "", value: "", prefix: "", suffix: "", accent: "primary" }])}
            className="text-sm flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" /> Add Metric
          </button>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={metric.id} className="flex items-center gap-4 bg-background p-4 rounded-lg border border-white/5 group">
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />
              <input placeholder="Label (e.g. Revenue)" value={metric.label} onChange={(e) => { const newM = [...metrics]; newM[index].label = e.target.value; setMetrics(newM); }} className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
              <input placeholder="Value (e.g. 300)" value={metric.value} onChange={(e) => { const newM = [...metrics]; newM[index].value = e.target.value; setMetrics(newM); }} className="w-24 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
              <input placeholder="Prefix (+)" value={metric.prefix} onChange={(e) => { const newM = [...metrics]; newM[index].prefix = e.target.value; setMetrics(newM); }} className="w-16 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
              <input placeholder="Suffix (%)" value={metric.suffix} onChange={(e) => { const newM = [...metrics]; newM[index].suffix = e.target.value; setMetrics(newM); }} className="w-16 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
              <select value={metric.accent} onChange={(e) => { const newM = [...metrics]; newM[index].accent = e.target.value; setMetrics(newM); }} className="bg-transparent border-b border-white/10 px-2 py-1 text-white outline-none">
                <option value="primary">Primary</option>
                <option value="cyan">Cyan</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </select>
              <button onClick={() => setMetrics(metrics.filter((_, i) => i !== index))} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {metrics.length === 0 && <p className="text-gray-500 italic text-sm text-center py-4">No metrics added yet.</p>}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-white">Execution Timeline</h2>
          <button 
            onClick={() => setTimeline([...timeline, { id: Date.now().toString(), title: "", description: "" }])}
            className="text-sm flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" /> Add Phase
          </button>
        </div>

        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4 bg-background p-4 rounded-lg border border-white/5 group">
              <div className="pt-2"><GripVertical className="w-5 h-5 text-gray-600 cursor-grab" /></div>
              <div className="flex-1 space-y-3">
                <input placeholder="Phase Title" value={item.title} onChange={(e) => { const newT = [...timeline]; newT[index].title = e.target.value; setTimeline(newT); }} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white font-bold focus:border-primary outline-none" />
                <textarea placeholder="Description" rows={2} value={item.description} onChange={(e) => { const newT = [...timeline]; newT[index].description = e.target.value; setTimeline(newT); }} className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-gray-300 text-sm focus:border-primary outline-none resize-none" />
              </div>
              <button onClick={() => setTimeline(timeline.filter((_, i) => i !== index))} className="mt-2 p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {timeline.length === 0 && <p className="text-gray-500 italic text-sm text-center py-4">No timeline phases added yet.</p>}
        </div>
      </section>

      {/* Media & Images */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Cover Image (Grid)</label>
            <div className="h-32 border-2 border-dashed border-white/10 rounded-xl bg-background flex flex-col items-center justify-center text-gray-500 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
              <ImageIcon className="w-6 h-6 mb-2" />
              <span className="text-sm">Click to upload</span>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Hero Image (Banner)</label>
            <div className="h-32 border-2 border-dashed border-white/10 rounded-xl bg-background flex flex-col items-center justify-center text-gray-500 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
              <ImageIcon className="w-6 h-6 mb-2" />
              <span className="text-sm">Click to upload</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
