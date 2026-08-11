"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Package as PackageIcon, RefreshCw, Trash, X } from "lucide-react";
import { api } from "@/services/api";

interface PackageData {
  id: string;
  name: string;
  type: string;
  price: string;
  serviceName: string;
  featured: boolean;
}

export default function PackagesPage() {
  const [data, setData] = useState<PackageData[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: "", serviceId: "", basePrice: 0, type: "STARTER", isPopular: false });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pkgRes, srvRes] = await Promise.all([
        api.packages.getAll(),
        api.services.getAll()
      ]) as [any, any];
      
      setServices(srvRes.data || srvRes);

      const mappedData: PackageData[] = (pkgRes.data || pkgRes).map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        type: pkg.type || "N/A",
        price: `₹${pkg.basePrice?.toLocaleString() || 0}`,
        serviceName: pkg.service?.name || "Unknown Service",
        featured: pkg.isPopular || false,
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.packages.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete package: " + err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.packages.create({
        name: newPkg.name,
        serviceId: newPkg.serviceId,
        basePrice: Number(newPkg.basePrice),
        type: newPkg.type,
        isPopular: newPkg.isPopular,
        billingInterval: "monthly"
      });
      setIsModalOpen(false);
      setNewPkg({ name: "", serviceId: "", basePrice: 0, type: "STARTER", isPopular: false });
      fetchData();
    } catch (err: any) {
      alert("Failed to create package: " + err.message);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Package Name",
      render: (item: PackageData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center overflow-hidden">
            <PackageIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-medium text-white block">{item.name}</span>
            <span className="text-xs text-gray-400 block">{item.serviceName}</span>
          </div>
        </div>
      )
    },
    { key: "type", header: "Tier" },
    { key: "price", header: "Base Price" },
    {
      key: "featured",
      header: "Popular",
      render: (item: PackageData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.featured ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.featured ? "Yes" : "No"}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: PackageData) => (
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
          <h1 className="text-2xl font-heading font-bold text-white">Packages Manager</h1>
          <p className="text-sm text-gray-400">Manage service pricing tiers and packages.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
            <Plus className="w-4 h-4" />
            New Package
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Total Packages</span>
          <span className="text-2xl font-bold text-white">{data.length}</span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Popular Packages</span>
          <span className="text-2xl font-bold text-blue-400">
            {data.filter(p => p.featured).length}
          </span>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading packages...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
          onEdit={(item) => alert("Edit package functionality coming soon")}
        />
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create New Package</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Package Name</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} placeholder="e.g. Growth Pro" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Linked Service</label>
                <select required className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newPkg.serviceId} onChange={e => setNewPkg({...newPkg, serviceId: e.target.value})}>
                  <option value="">-- Select Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Base Price (₹)</label>
                  <input required type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newPkg.basePrice} onChange={e => setNewPkg({...newPkg, basePrice: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tier</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newPkg.type} onChange={e => setNewPkg({...newPkg, type: e.target.value})}>
                    <option value="STARTER">Starter</option>
                    <option value="GROWTH">Growth</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ENTERPRISE">Enterprise</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="popular" checked={newPkg.isPopular} onChange={e => setNewPkg({...newPkg, isPopular: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                <label htmlFor="popular" className="text-sm text-gray-400">Mark as Popular</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">Create Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
