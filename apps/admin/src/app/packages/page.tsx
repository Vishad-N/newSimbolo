"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Package as PackageIcon, Star, StarOff } from "lucide-react";

interface PackageData {
  id: string;
  name: string;
  illustration: string;
  price: string;
  rating: number;
  compactHighlights: string[];
  displayOrder: number;
  featured: boolean;
  status: "Published" | "Draft" | "Archived";
}

const mockPackages: PackageData[] = [
  { id: "pkg_seo", name: "SEO", illustration: "/images/services/seo.png", price: "₹7,999/mo", rating: 4.8, compactHighlights: ["Technical SEO", "Local SEO", "Keyword Research"], displayOrder: 1, featured: true, status: "Published" },
  { id: "pkg_meta", name: "Meta Ads", illustration: "/images/services/meta-ads.png", price: "₹4,999/mo", rating: 4.9, compactHighlights: ["Facebook Ads", "Instagram Ads", "Lead Generation"], displayOrder: 2, featured: true, status: "Published" },
  { id: "pkg_web", name: "Website Design", illustration: "/images/services/website-design.png", price: "₹14,999", rating: 4.9, compactHighlights: ["Custom Design", "Mobile Responsive", "Fast Loading"], displayOrder: 4, featured: false, status: "Published" },
];

export default function PackagesPage() {
  const [data, setData] = useState<PackageData[]>(mockPackages);

  const columns = [
    {
      key: "name",
      header: "Service Name",
      render: (item: PackageData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center overflow-hidden">
             {item.illustration ? (
                <img src={item.illustration} alt={item.name} className="w-full h-full object-cover" />
             ) : (
                <PackageIcon className="w-4 h-4 text-gray-400" />
             )}
          </div>
          <div>
            <span className="font-medium text-white block">{item.name}</span>
            <span className="text-xs text-gray-400 truncate max-w-[200px] block">{item.compactHighlights.join(", ")}</span>
          </div>
        </div>
      )
    },
    { key: "price", header: "Starting Price" },
    { 
      key: "rating", 
      header: "Rating",
      render: (item: PackageData) => (
        <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
          <Star className="w-3 h-3 fill-current" /> {item.rating}
        </span>
      )
    },
    { key: "displayOrder", header: "Order" },
    {
      key: "featured",
      header: "Featured",
      render: (item: PackageData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.featured ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.featured ? "Yes" : "No"}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item: PackageData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'Published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          item.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Packages Manager</h1>
          <p className="text-sm text-gray-400">Manage service cards, illustrations, and pricing.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Total Services</span>
          <span className="text-2xl font-bold text-white">{data.length}</span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Published</span>
          <span className="text-2xl font-bold text-green-400">
            {data.filter(p => p.status === 'Published').length}
          </span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Featured</span>
          <span className="text-2xl font-bold text-blue-400">
            {data.filter(p => p.featured).length}
          </span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Drafts</span>
          <span className="text-2xl font-bold text-yellow-400">
            {data.filter(p => p.status === 'Draft').length}
          </span>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        onEdit={(item) => console.log("Edit", item)}
        onDuplicate={(item) => {
          const newItem = { ...item, id: Date.now().toString(), name: `${item.name} (Copy)`, status: "Draft" as const };
          setData([...data, newItem]);
        }}
        onDelete={(item) => setData(data.filter(d => d.id !== item.id))}
      />
    </div>
  );
}
