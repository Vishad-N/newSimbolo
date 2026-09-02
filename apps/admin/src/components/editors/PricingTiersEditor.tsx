"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Save, Layers } from "lucide-react";
import { api, getDataArray } from "@/services/api";
import { SectionEditor } from "./SectionEditor";

interface TierFeature {
  id: string;
  name: string;
}

interface TierPricing {
  id: string;
  billingPeriod?: string;
  price?: number;
}

interface TierPackage {
  id: string;
  name: string;
  description?: string | null;
  basePrice?: number;
  isPopular?: boolean;
  serviceId?: string;
  service?: { id?: string; slug?: string };
  features?: TierFeature[];
  pricings?: TierPricing[];
}

interface ServiceRecord {
  id: string;
  slug: string;
  name: string;
}

const MAX_TIERS = 4;

const emptyTierForm = {
  name: "",
  description: "",
  monthlyPrice: 0,
  yearlyPrice: 0,
  isPopular: false,
};

export function PricingTiersEditor({ slug }: { slug: string }) {
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [tiers, setTiers] = useState<TierPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTierForm);
  const [tierFeatures, setTierFeatures] = useState<TierFeature[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingFeature, setIsSavingFeature] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [serviceRes, packagesRes] = await Promise.all([
        api.services.getBySlug(slug),
        api.packages.getAll(),
      ]);

      const serviceRecord = (serviceRes as { data?: ServiceRecord } | ServiceRecord | null);
      const resolvedService = serviceRecord && "data" in serviceRecord && serviceRecord.data ? serviceRecord.data : (serviceRecord as ServiceRecord | null);
      setService(resolvedService || null);

      const allPackages = getDataArray<TierPackage>(packagesRes);
      const serviceTiers = allPackages
        .filter((pkg: any) => pkg.isAddon && (pkg.serviceId === resolvedService?.id || pkg.service?.id === resolvedService?.id))
        .sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
      setTiers(serviceTiers);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load pricing tiers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const openCreateModal = () => {
    setEditingTierId(null);
    setForm(emptyTierForm);
    setTierFeatures([]);
    setFeatureInput("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tier: TierPackage) => {
    const monthly = tier.pricings?.find((p) => p.billingPeriod === "monthly")?.price ?? tier.basePrice ?? 0;
    const yearly = tier.pricings?.find((p) => p.billingPeriod === "yearly")?.price ?? 0;
    setEditingTierId(tier.id);
    setForm({
      name: tier.name,
      description: tier.description || "",
      monthlyPrice: monthly,
      yearlyPrice: yearly,
      isPopular: tier.isPopular || false,
    });
    setTierFeatures(tier.features || []);
    setFeatureInput("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDeleteTier = async (id: string) => {
    if (!confirm("Delete this pricing tier? It will disappear from the live page.")) return;
    try {
      await api.packages.delete(id);
      fetchData();
    } catch (err: any) {
      alert(`Failed to delete tier: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) {
      setModalError("Service could not be resolved for this page.");
      return;
    }
    if (!editingTierId && tiers.length >= MAX_TIERS) {
      setModalError(`Only ${MAX_TIERS} pricing tiers are supported on this page.`);
      return;
    }

    setIsSaving(true);
    setModalError(null);
    try {
      let tierId = editingTierId;
      const basePayload = {
        name: form.name,
        description: form.description.trim() || undefined,
        basePrice: Number(form.monthlyPrice),
        isPopular: form.isPopular,
      };

      if (editingTierId) {
        await api.packages.update(editingTierId, basePayload);
      } else {
        const created = await api.packages.create({
          ...basePayload,
          serviceId: service.id,
          isAddon: true,
        }) as TierPackage;
        tierId = created.id;
      }

      if (tierId) {
        await api.packages.upsertPricing({
          packageId: tierId,
          currency: "INR",
          price: Number(form.monthlyPrice),
          billingPeriod: "monthly",
        });
        if (form.yearlyPrice) {
          await api.packages.upsertPricing({
            packageId: tierId,
            currency: "INR",
            price: Number(form.yearlyPrice),
            billingPeriod: "yearly",
          });
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setModalError(`Failed to save tier: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = async () => {
    const name = featureInput.trim();
    if (!name || !editingTierId) return;

    setIsSavingFeature(true);
    setModalError(null);
    try {
      const created = await api.packages.addFeature({
        name,
        packageId: editingTierId,
        sortOrder: tierFeatures.length,
      }) as TierFeature;
      setTierFeatures((current) => [...current, created]);
      setFeatureInput("");
    } catch (err: any) {
      setModalError(`Failed to add feature: ${err.message}`);
    } finally {
      setIsSavingFeature(false);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    try {
      await api.packages.deleteFeature(featureId);
      setTierFeatures((current) => current.filter((f) => f.id !== featureId));
    } catch (err: any) {
      setModalError(`Failed to remove feature: ${err.message}`);
    }
  };

  if (isLoading) return <div className="text-gray-400 text-sm">Loading pricing tiers...</div>;

  return (
    <SectionEditor
      title="Pricing Tiers"
      description={`Up to ${MAX_TIERS} standalone plans shown on this service page's pricing grid. Purchasable directly — no other package is required first.`}
      defaultExpanded={true}
    >
      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{tiers.length} / {MAX_TIERS} tiers configured</p>
            <button
              type="button"
              onClick={openCreateModal}
              disabled={tiers.length >= MAX_TIERS}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Tier
            </button>
          </div>

          {tiers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
              No pricing tiers yet. The page currently falls back to placeholder pricing until tiers are added here.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tiers.map((tier) => {
                const monthly = tier.pricings?.find((p) => p.billingPeriod === "monthly")?.price ?? tier.basePrice ?? 0;
                const yearly = tier.pricings?.find((p) => p.billingPeriod === "yearly")?.price;
                return (
                  <div key={tier.id} className="relative rounded-xl border border-white/10 bg-white/5 p-4">
                    {tier.isPopular && (
                      <span className="absolute -top-2 right-4 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white">
                        Popular
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-white">{tier.name}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => openEditModal(tier)} className="text-xs text-primary hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDeleteTier(tier.id)} className="p-1 text-red-400 hover:bg-red-400/10 rounded-md">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{tier.description}</p>
                    <p className="mt-2 text-lg font-black text-white">
                      ₹{monthly.toLocaleString("en-IN")}<span className="text-xs font-medium text-gray-400">/mo</span>
                      {yearly ? <span className="ml-2 text-xs font-medium text-gray-500">₹{yearly.toLocaleString("en-IN")}/yr</span> : null}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{(tier.features || []).length} feature bullet(s)</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-background shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-xl font-bold text-white">{editingTierId ? "Edit Tier" : "Add Pricing Tier"}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tier Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Starter" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Audience Line</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. For Small Businesses" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Monthly Price (INR)</label>
                    <input required type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: Number(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Yearly Price (Optional)</label>
                    <input type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" value={form.yearlyPrice} onChange={(e) => setForm({ ...form, yearlyPrice: Number(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="tier-popular" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary/20" />
                  <label htmlFor="tier-popular" className="text-sm text-gray-400">Mark as Most Popular</label>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Feature Bullet Points</label>
                  {editingTierId ? (
                    <div className="space-y-2">
                      {tierFeatures.length > 0 && (
                        <ul className="space-y-1.5">
                          {tierFeatures.map((feature) => (
                            <li key={feature.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                              <span className="text-sm text-white">{feature.name}</span>
                              <button type="button" onClick={() => handleDeleteFeature(feature.id)} className="p-1 text-gray-400 hover:text-red-400" aria-label={`Remove ${feature.name}`}>
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
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddFeature();
                            }
                          }}
                          placeholder="e.g. Weekly Optimization"
                        />
                        <button type="button" onClick={handleAddFeature} disabled={isSavingFeature || !featureInput.trim()} className="px-4 py-2 bg-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm font-medium rounded-lg shrink-0">
                          {isSavingFeature ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Save this tier first, then reopen it to add feature bullet points.</p>
                  )}
                </div>

                {modalError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{modalError}</div>
                )}
              </div>
              <div className="flex shrink-0 justify-end gap-3 border-t border-white/10 p-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-medium rounded-lg">
                  <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionEditor>
  );
}
