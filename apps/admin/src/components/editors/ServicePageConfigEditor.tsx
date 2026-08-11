"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { api } from "@/services/api";
import { availableIcons, DynamicIcon } from "@/utils/icon-mapper";
import { SectionEditor } from "./SectionEditor";
import Link from "next/link";

interface ServicePageConfigData {
  heroBenefits?: string[];
  statsBar?: Array<{ title: string; description: string; iconName: string }>;
  servicesList?: Array<{ title: string; description: string; iconName: string; startingPrice: string }>;
  resultMetrics?: Array<{ value: string; label: string; iconName: string }>;
}

export function ServicePageConfigEditor({ slug }: { slug: string }) {
  const [data, setData] = useState<ServicePageConfigData>({
    heroBenefits: [],
    statsBar: [],
    servicesList: [],
    resultMetrics: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await api.servicePageConfig.get(slug);
        if (config) {
          setData({
            heroBenefits: config.heroBenefits || [],
            statsBar: config.statsBar || [],
            servicesList: config.servicesList || [],
            resultMetrics: config.resultMetrics || [],
          });
        }
      } catch (err) {
        console.error("Failed to load config", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, [slug]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.servicePageConfig.update(slug, data);
      alert("Configuration saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading configuration...</div>;

  const IconSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-2 items-center">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
        <DynamicIcon name={value || 'HelpCircle'} className="w-4 h-4 text-primary" />
      </div>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
      >
        <option value="">Select Icon...</option>
        {availableIcons.map(icon => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Benefits */}
      <SectionEditor title="Hero Benefits (Bullet Points)" defaultExpanded={true}>
        <div className="space-y-4">
          {data.heroBenefits?.map((benefit, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={benefit}
                onChange={(e) => {
                  const newB = [...(data.heroBenefits || [])];
                  newB[idx] = e.target.value;
                  setData({ ...data, heroBenefits: newB });
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Benefit text..."
              />
              <button 
                onClick={() => setData({ ...data, heroBenefits: data.heroBenefits?.filter((_, i) => i !== idx) })}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setData({ ...data, heroBenefits: [...(data.heroBenefits || []), ""] })}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="w-4 h-4" /> Add Benefit
          </button>
        </div>
      </SectionEditor>

      {/* Stats Bar */}
      <SectionEditor title="Stats Bar (Below Hero)">
        <div className="space-y-4">
          {data.statsBar?.map((stat, idx) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 relative">
              <button 
                onClick={() => setData({ ...data, statsBar: data.statsBar?.filter((_, i) => i !== idx) })}
                className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-4 mr-10">
                <input
                  type="text"
                  value={stat.title}
                  onChange={(e) => {
                    const newStats = [...(data.statsBar || [])];
                    newStats[idx].title = e.target.value;
                    setData({ ...data, statsBar: newStats });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Title (e.g. 500+ Projects)"
                />
                <input
                  type="text"
                  value={stat.description}
                  onChange={(e) => {
                    const newStats = [...(data.statsBar || [])];
                    newStats[idx].description = e.target.value;
                    setData({ ...data, statsBar: newStats });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Description"
                />
              </div>
              <div className="w-1/2">
                <IconSelector 
                  value={stat.iconName} 
                  onChange={(v) => {
                    const newStats = [...(data.statsBar || [])];
                    newStats[idx].iconName = v;
                    setData({ ...data, statsBar: newStats });
                  }} 
                />
              </div>
            </div>
          ))}
          <button 
            onClick={() => setData({ ...data, statsBar: [...(data.statsBar || []), { title: '', description: '', iconName: 'Star' }] })}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
      </SectionEditor>

      {/* Services List (Pricing Cards) */}
      <SectionEditor title="Service Items & Unit Pricing">
        <div className="space-y-4">
          {data.servicesList?.map((svc, idx) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 relative">
              <button 
                onClick={() => setData({ ...data, servicesList: data.servicesList?.filter((_, i) => i !== idx) })}
                className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-4 mr-10">
                <input
                  type="text"
                  value={svc.title}
                  onChange={(e) => {
                    const newSvc = [...(data.servicesList || [])];
                    newSvc[idx].title = e.target.value;
                    setData({ ...data, servicesList: newSvc });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Service Title (e.g. Logo Design)"
                />
                <input
                  type="text"
                  value={svc.startingPrice}
                  onChange={(e) => {
                    const newSvc = [...(data.servicesList || [])];
                    newSvc[idx].startingPrice = e.target.value;
                    setData({ ...data, servicesList: newSvc });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-primary"
                  placeholder="Price (e.g. ₹699 / thumbnail)"
                />
                <input
                  type="text"
                  value={svc.description}
                  onChange={(e) => {
                    const newSvc = [...(data.servicesList || [])];
                    newSvc[idx].description = e.target.value;
                    setData({ ...data, servicesList: newSvc });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white col-span-2"
                  placeholder="Description..."
                />
              </div>
              <div className="w-1/2">
                <IconSelector 
                  value={svc.iconName} 
                  onChange={(v) => {
                    const newSvc = [...(data.servicesList || [])];
                    newSvc[idx].iconName = v;
                    setData({ ...data, servicesList: newSvc });
                  }} 
                />
              </div>
            </div>
          ))}
          <button 
            onClick={() => setData({ ...data, servicesList: [...(data.servicesList || []), { title: '', description: '', iconName: 'Layers', startingPrice: '' }] })}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="w-4 h-4" /> Add Service Item
          </button>
        </div>
      </SectionEditor>

      {/* Result Metrics */}
      <SectionEditor title="Result Metrics (Case Studies preview)">
        <div className="space-y-4">
          {data.resultMetrics?.map((metric, idx) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 relative">
              <button 
                onClick={() => setData({ ...data, resultMetrics: data.resultMetrics?.filter((_, i) => i !== idx) })}
                className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-4 mr-10">
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => {
                    const newMetrics = [...(data.resultMetrics || [])];
                    newMetrics[idx].value = e.target.value;
                    setData({ ...data, resultMetrics: newMetrics });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-2xl font-bold"
                  placeholder="Value (e.g. 230%)"
                />
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => {
                    const newMetrics = [...(data.resultMetrics || [])];
                    newMetrics[idx].label = e.target.value;
                    setData({ ...data, resultMetrics: newMetrics });
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  placeholder="Label (e.g. Increase in Conversions)"
                />
              </div>
              <div className="w-1/2">
                <IconSelector 
                  value={metric.iconName} 
                  onChange={(v) => {
                    const newMetrics = [...(data.resultMetrics || [])];
                    newMetrics[idx].iconName = v;
                    setData({ ...data, resultMetrics: newMetrics });
                  }} 
                />
              </div>
            </div>
          ))}
          <button 
            onClick={() => setData({ ...data, resultMetrics: [...(data.resultMetrics || []), { value: '', label: '', iconName: 'TrendingUp' }] })}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="w-4 h-4" /> Add Metric
          </button>
        </div>
      </SectionEditor>

      <SectionEditor title="Packages & Add-ons">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-gray-300">
          <p className="mb-4">Base packages and add-ons are managed centrally in the Packages module.</p>
          <Link href="/packages" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-colors">
            <LinkIcon className="w-4 h-4" /> Manage Packages
          </Link>
        </div>
      </SectionEditor>

      <SectionEditor title="FAQs">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-gray-300">
          <p className="mb-4">FAQs for this service are managed centrally in the FAQs module.</p>
          <Link href="/faqs" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-colors">
            <LinkIcon className="w-4 h-4" /> Manage FAQs
          </Link>
        </div>
      </SectionEditor>

      <div className="flex justify-end pt-4 border-t border-white/10">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
