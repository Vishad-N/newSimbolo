"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Package as PackageIcon } from "lucide-react";

interface PackageData {
  id: string;
  name: string;
  category: string;
  price: string;
  status: "Active" | "Draft" | "Archived";
}

const mockPackages: PackageData[] = [
  { id: "1", name: "Basic SEO", category: "SEO", price: "$499/mo", status: "Active" },
  { id: "2", name: "Pro SEO", category: "SEO", price: "$999/mo", status: "Active" },
  { id: "3", name: "Starter Website", category: "Web Dev", price: "$1,499", status: "Active" },
  { id: "4", name: "E-Commerce Pro", category: "Web Dev", price: "$4,999", status: "Draft" },
  { id: "5", name: "Social Media Basic", category: "Meta Ads", price: "$599/mo", status: "Archived" },
];

export default function PackagesPage() {
  const [data, setData] = useState<PackageData[]>(mockPackages);

  const columns = [
    {
      key: "name",
      header: "Package Name",
      render: (item: PackageData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">
            <PackageIcon className="w-4 h-4 text-gray-400" />
          </div>
          <span className="font-medium text-white">{item.name}</span>
        </div>
      )
    },
    { key: "category", header: "Category" },
    { key: "price", header: "Price" },
    {
      key: "status",
      header: "Status",
      render: (item: PackageData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
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
          <p className="text-sm text-gray-400">Create and manage your service packages and pricing.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
          <Plus className="w-4 h-4" />
          New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Total Packages</span>
          <span className="text-2xl font-bold text-white">{data.length}</span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Active Packages</span>
          <span className="text-2xl font-bold text-green-400">
            {data.filter(p => p.status === 'Active').length}
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
