"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { PackageIllustrationSelect } from "@/components/packages/PackageIllustrationSelect";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Plus, Package as PackageIcon, RefreshCw, Trash, X } from "lucide-react";
import { api } from "@/services/api";

type PackageFeatureKind = "FEATURE" | "DELIVERABLE";

interface ServiceOption {
  id: string;
  name: string;
  shortDescription?: string;
}

interface PackageFeatureItem {
  id: string;
  name: string;
  kind?: PackageFeatureKind;
}

interface PackageApiRecord {
  id: string;
  name: string;
  description?: string | null;
  illustration?: string | null;
  thumbnailUrl?: string | null;
  type?: PackageTier;
  basePrice?: number;
  isPopular?: boolean;
  isAddon?: boolean;
  serviceId?: string;
  service?: {
    id?: string;
    name?: string;
  };
  features?: PackageFeatureItem[];
}

type PackageTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE" | "CUSTOM";
type ServiceType = "RETAINER" | "ONE_TIME" | "HOURLY" | "CONSULTING" | "CUSTOM";

interface PackageData {
  id: string;
  name: string;
  description: string;
  illustration: string;
  thumbnailUrl: string;
  type: string;
  price: string;
  serviceName: string;
  featured: boolean;
  serviceId: string;
  basePrice: number;
  isAddon: boolean;
  features: PackageFeatureItem[];
}

interface PackageFormData {
  name: string;
  description: string;
  illustration: string;
  thumbnailUrl: string;
  serviceId: string;
  basePrice: number;
  type: PackageTier;
  isPopular: boolean;
}

interface ServiceFormData {
  name: string;
  shortDescription: string;
  type: ServiceType;
  basePrice: number;
}

const emptyPackageForm: PackageFormData = {
  name: "",
  description: "",
  illustration: "",
  thumbnailUrl: "",
  serviceId: "",
  basePrice: 0,
  type: "STARTER",
  isPopular: false,
};
const emptyServiceForm: ServiceFormData = { name: "", shortDescription: "", type: "RETAINER", basePrice: 0 };

const normalizeApiList = <T,>(response: unknown): T[] => {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];

  const responseRecord = response as { data?: unknown; items?: unknown };
  if (Array.isArray(responseRecord.data)) return responseRecord.data as T[];
  if (Array.isArray(responseRecord.items)) return responseRecord.items as T[];

  if (responseRecord.data && typeof responseRecord.data === "object") {
    const dataRecord = responseRecord.data as { data?: unknown; items?: unknown };
    if (Array.isArray(dataRecord.data)) return dataRecord.data as T[];
    if (Array.isArray(dataRecord.items)) return dataRecord.items as T[];
  }

  return [];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function PackagesPage() {
  const [data, setData] = useState<PackageData[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [newPkg, setNewPkg] = useState<PackageFormData>(emptyPackageForm);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [newService, setNewService] = useState<ServiceFormData>(emptyServiceForm);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [packageFeatures, setPackageFeatures] = useState<PackageFeatureItem[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isSavingFeature, setIsSavingFeature] = useState(false);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [isSavingDeliverable, setIsSavingDeliverable] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pkgRes, srvRes] = await Promise.all([
        api.packages.getAll(),
        api.services.getAll()
      ]);
      
      setServices(normalizeApiList<ServiceOption>(srvRes));

      const mappedData: PackageData[] = normalizeApiList<PackageApiRecord>(pkgRes).map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description || "",
        illustration: pkg.illustration || "",
        thumbnailUrl: pkg.thumbnailUrl || "",
        type: pkg.type || "N/A",
        price: `INR ${pkg.basePrice?.toLocaleString() || 0}`,
        serviceName: pkg.service?.name || "Unknown Service",
        featured: pkg.isPopular || false,
        serviceId: pkg.serviceId || pkg.service?.id || "",
        basePrice: Number(pkg.basePrice) || 0,
        isAddon: pkg.isAddon || false,
        features: pkg.features || [],
      }));
      setData(mappedData);
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err, "Failed to fetch data"));
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
    } catch (err: unknown) {
      alert("Failed to delete package: " + getErrorMessage(err, "Unknown error"));
    }
  };

  const openCreateModal = () => {
    setEditingPackageId(null);
    setNewPkg(emptyPackageForm);
    setNewService(emptyServiceForm);
    setIsServiceFormOpen(services.length === 0);
    setModalError(null);
    setPackageFeatures([]);
    setFeatureInput("");
    setDeliverableInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: PackageData) => {
    setEditingPackageId(item.id);
    setNewPkg({
      name: item.name,
      description: item.description,
      illustration: item.illustration,
      thumbnailUrl: item.thumbnailUrl,
      serviceId: item.serviceId,
      basePrice: item.basePrice,
      type: item.type as PackageTier,
      isPopular: item.featured,
    });
    setNewService(emptyServiceForm);
    setIsServiceFormOpen(false);
    setModalError(null);
    setPackageFeatures(item.features);
    setFeatureInput("");
    setDeliverableInput("");
    setIsModalOpen(true);
  };

  const handleCreateService = async () => {
    if (!newService.name.trim() || !newService.shortDescription.trim()) {
      setModalError("Service name and short description are required.");
      return;
    }

    setIsCreatingService(true);
    setModalError(null);
    try {
      const createdService = await api.services.create({
        name: newService.name.trim(),
        shortDescription: newService.shortDescription.trim(),
        type: newService.type,
        basePrice: Number(newService.basePrice),
      }) as ServiceOption;

      setServices((currentServices) => [...currentServices, createdService].sort((a, b) => a.name.localeCompare(b.name)));
      setNewPkg((currentPackage) => ({ ...currentPackage, serviceId: createdService.id }));
      setNewService(emptyServiceForm);
      setIsServiceFormOpen(false);
    } catch (err: unknown) {
      setModalError(getErrorMessage(err, "Failed to create service"));
    } finally {
      setIsCreatingService(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkg.serviceId) {
      setModalError("Create or select a linked service before saving the package.");
      return;
    }
    if (!newPkg.thumbnailUrl && !newPkg.illustration) {
      setModalError("Upload a thumbnail image or select one of the available package illustrations before saving.");
      return;
    }

    setModalError(null);
    try {
      const payload = {
        name: newPkg.name,
        description: newPkg.description.trim(),
        illustration: newPkg.illustration || null,
        thumbnailUrl: newPkg.thumbnailUrl || null,
        serviceId: newPkg.serviceId,
        basePrice: Number(newPkg.basePrice),
        type: newPkg.type,
        isPopular: newPkg.isPopular,
        billingInterval: "monthly"
      };
      if (editingPackageId) {
        await api.packages.update(editingPackageId, payload);
      } else {
        await api.packages.create(payload);
      }
      setIsModalOpen(false);
      setEditingPackageId(null);
      setNewPkg(emptyPackageForm);
      setNewService(emptyServiceForm);
      setIsServiceFormOpen(false);
      fetchData();
    } catch (err: unknown) {
      setModalError(`Failed to ${editingPackageId ? "update" : "create"} package: ${getErrorMessage(err, "Unknown error")}`);
    }
  };

  const addPackageBullet = async (kind: PackageFeatureKind, name: string) => {
    if (!name || !editingPackageId) return;

    const setSaving = kind === "DELIVERABLE" ? setIsSavingDeliverable : setIsSavingFeature;
    const clearInput = kind === "DELIVERABLE" ? setDeliverableInput : setFeatureInput;
    const sortOrder = packageFeatures.filter((feature) => (feature.kind || "FEATURE") === kind).length;

    setSaving(true);
    setModalError(null);
    try {
      const created = await api.packages.addFeature({
        name,
        packageId: editingPackageId,
        kind,
        sortOrder,
      }) as PackageFeatureItem;
      setPackageFeatures((current) => [...current, created]);
      clearInput("");
      setData((current) =>
        current.map((pkg) =>
          pkg.id === editingPackageId ? { ...pkg, features: [...pkg.features, created] } : pkg,
        ),
      );
    } catch (err: unknown) {
      setModalError(getErrorMessage(err, `Failed to add ${kind === "DELIVERABLE" ? "deliverable" : "feature"}`));
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = () => addPackageBullet("FEATURE", featureInput.trim());
  const handleAddDeliverable = () => addPackageBullet("DELIVERABLE", deliverableInput.trim());

  const handleDeleteFeature = async (featureId: string) => {
    try {
      await api.packages.deleteFeature(featureId);
      setPackageFeatures((current) => current.filter((feature) => feature.id !== featureId));
      setData((current) =>
        current.map((pkg) =>
          pkg.id === editingPackageId
            ? { ...pkg, features: pkg.features.filter((feature) => feature.id !== featureId) }
            : pkg,
        ),
      );
    } catch (err: unknown) {
      setModalError(getErrorMessage(err, "Failed to remove feature"));
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
    {
      key: "isAddon",
      header: "Type",
      render: (item: PackageData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.isAddon ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {item.isAddon ? "Add-on" : "Base Plan"}
        </span>
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
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
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
          onEdit={openEditModal}
        />
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="package-modal-title" className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/10 bg-background shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-6">
              <h2 id="package-modal-title" className="text-xl font-bold text-white">{editingPackageId ? "Edit Package" : "Create New Package"}</h2>
              <button type="button" aria-label="Close package form" onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Package Name</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} placeholder="e.g. Growth Pro" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Package Description</label>
                <textarea rows={3} className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" value={newPkg.description} onChange={e => setNewPkg({...newPkg, description: e.target.value})} placeholder="This appears in the expanded package details." />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-400">Linked Service</label>
                  <button type="button" onClick={() => setIsServiceFormOpen((isOpen) => !isOpen)} className="text-xs font-medium text-primary hover:text-primary-hover">
                    {isServiceFormOpen ? "Hide service form" : "Add Service"}
                  </button>
                </div>
                <select required className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newPkg.serviceId} onChange={e => setNewPkg({...newPkg, serviceId: e.target.value})}>
                  <option value="">{services.length > 0 ? "-- Select Service --" : "No services yet - add one below"}</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              {isServiceFormOpen && (
                <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Service Name</label>
                    <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="e.g. SEO" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                    <textarea rows={2} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white resize-none" value={newService.shortDescription} onChange={e => setNewService({...newService, shortDescription: e.target.value})} placeholder="Briefly describe this service" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Service Type</label>
                      <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newService.type} onChange={e => setNewService({...newService, type: e.target.value as ServiceType})}>
                        <option value="RETAINER">Retainer</option>
                        <option value="ONE_TIME">One-time</option>
                        <option value="HOURLY">Hourly</option>
                        <option value="CONSULTING">Consulting</option>
                        <option value="CUSTOM">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Starting Price</label>
                      <input type="number" min="0" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white" value={newService.basePrice} onChange={e => setNewService({...newService, basePrice: parseInt(e.target.value) || 0})} />
                    </div>
                  </div>
                  <button type="button" onClick={handleCreateService} disabled={isCreatingService} className="w-full px-4 py-2 bg-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
                    {isCreatingService ? "Creating Service..." : "Create Service and Select"}
                  </button>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Package Thumbnail</label>
                <ImageUploader value={newPkg.thumbnailUrl} onChange={(thumbnailUrl) => setNewPkg({...newPkg, thumbnailUrl})} folder="packages" />
                <p className="mt-1 text-xs text-gray-500">Upload a new PNG or browse images already uploaded to the media library. Takes priority over the illustration below.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Package Illustration</label>
                <PackageIllustrationSelect value={newPkg.illustration} onChange={(illustration) => setNewPkg({...newPkg, illustration})} />
                <p className="mt-1 text-xs text-gray-500">Used only if no custom thumbnail image is set above.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Base Price (INR)</label>
                  <input required type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={newPkg.basePrice} onChange={e => setNewPkg({...newPkg, basePrice: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tier</label>
                  <select className="w-full bg-[#1A1F2E] border border-white/10 rounded-lg px-4 py-2 text-white appearance-none" value={newPkg.type} onChange={e => setNewPkg({...newPkg, type: e.target.value as PackageTier})}>
                    <option value="STARTER">Starter</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="ENTERPRISE">Enterprise</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="popular" checked={newPkg.isPopular} onChange={e => setNewPkg({...newPkg, isPopular: e.target.checked})} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                  <label htmlFor="popular" className="text-sm text-gray-400">Mark as Popular</label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Everything Included</label>
                <p className="mb-2 text-xs text-gray-500">Shown as the checkmark list on the expanded package details.</p>
                {editingPackageId ? (
                  <div className="space-y-2">
                    {packageFeatures.filter((feature) => (feature.kind || "FEATURE") === "FEATURE").length > 0 && (
                      <ul className="space-y-1.5">
                        {packageFeatures.filter((feature) => (feature.kind || "FEATURE") === "FEATURE").map((feature) => (
                          <li key={feature.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                            <span className="text-sm text-white">{feature.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(feature.id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              aria-label={`Remove feature ${feature.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                        value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        placeholder="e.g. Weekly Optimization"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        disabled={isSavingFeature || !featureInput.trim()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
                      >
                        {isSavingFeature ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Save the package first, then reopen it to add feature bullet points.</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Monthly Deliverables</label>
                <p className="mb-2 text-xs text-gray-500">Shown as the numbered list on the expanded package details.</p>
                {editingPackageId ? (
                  <div className="space-y-2">
                    {packageFeatures.filter((feature) => feature.kind === "DELIVERABLE").length > 0 && (
                      <ul className="space-y-1.5">
                        {packageFeatures.filter((feature) => feature.kind === "DELIVERABLE").map((feature) => (
                          <li key={feature.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                            <span className="text-sm text-white">{feature.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(feature.id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              aria-label={`Remove deliverable ${feature.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                        value={deliverableInput}
                        onChange={e => setDeliverableInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDeliverable();
                          }
                        }}
                        placeholder="e.g. 5 Reels per Month"
                      />
                      <button
                        type="button"
                        onClick={handleAddDeliverable}
                        disabled={isSavingDeliverable || !deliverableInput.trim()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
                      >
                        {isSavingDeliverable ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Save the package first, then reopen it to add monthly deliverables.</p>
                )}
              </div>
              {modalError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {modalError}
                </div>
              )}
              </div>
              <div className="flex shrink-0 justify-end gap-3 border-t border-white/10 p-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">{editingPackageId ? "Save Package" : "Create Package"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
