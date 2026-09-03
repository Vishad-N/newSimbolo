"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, X } from "lucide-react";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { MediaSelector } from "@/components/shared/MediaSelector";
import { api, getDataArray } from "@/services/api";

interface CategoryOption {
  id: string;
  name: string;
}

interface MetricRow {
  id: string;
  label: string;
  value: string;
  changePercentage: string;
  prefix: string;
  suffix: string;
  accent: string;
  saved: boolean;
}

const emptyMetricRow = (): MetricRow => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  label: "",
  value: "",
  changePercentage: "",
  prefix: "",
  suffix: "",
  accent: "primary",
  saved: false,
});

interface TransformationRow {
  id: string;
  metric: string;
  beforeValue: string;
  afterValue: string;
  saved: boolean;
}

const emptyTransformationRow = (): TransformationRow => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  metric: "",
  beforeValue: "",
  afterValue: "",
  saved: false,
});

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [summary, setSummary] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [readTime, setReadTime] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("DRAFT");

  const [coverImageId, setCoverImageId] = useState<string | undefined>(undefined);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const [caseStudyId, setCaseStudyId] = useState<string | null>(isNew ? null : resolvedParams.id);
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [transformations, setTransformations] = useState<TransformationRow[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const catRes = await api.caseStudies.getCategories();
        setCategories(getDataArray<CategoryOption>(catRes));

        if (!isNew) {
          const listRes = await api.caseStudies.getAll();
          const all = getDataArray<any>(listRes);
          const cs = all.find((c) => c.id === resolvedParams.id);
          if (!cs) {
            setLoadError("Case study not found.");
            return;
          }
          setTitle(cs.title || "");
          setClientName(cs.clientName || "");
          setIndustry(cs.industry || "");
          setCategoryId(cs.categoryId || cs.category?.id || "");
          setSummary(cs.summary || "");
          setChallenge(cs.challenge || "");
          setSolution(cs.solution || "");
          setResults(cs.results || "");
          setReadTime(cs.readTime || "");
          setStatus(cs.status || "DRAFT");
          setCoverImageId(cs.coverImageId || cs.coverImage?.id || undefined);
          setCoverImagePreview(cs.coverImage?.secureUrl || cs.coverImage?.url || null);
          setMetrics(
            (cs.metrics || []).map((m: any) => ({
              id: m.id,
              label: m.label || "",
              value: m.value || "",
              changePercentage: m.changePercentage || "",
              prefix: m.prefix || "",
              suffix: m.suffix || "",
              accent: m.accent || "primary",
              saved: true,
            })),
          );
          setTransformations(
            (cs.beforeAfters || []).map((ba: any) => ({
              id: ba.id,
              metric: ba.metric || "",
              beforeValue: ba.beforeValue || "",
              afterValue: ba.afterValue || "",
              saved: true,
            })),
          );
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load case study");
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const handleSave = async (nextStatus: "DRAFT" | "PUBLISHED") => {
    if (![title, summary, challenge, solution, results, clientName].every((field) => field.trim())) {
      setSaveMessage("Complete the title, client, summary, challenge, solution, and results before saving.");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    const payload = {
      title,
      summary,
      challenge,
      solution,
      results,
      clientName,
      industry: industry || undefined,
      categoryId: categoryId || undefined,
      coverImageId: coverImageId || undefined,
      readTime: readTime.trim() || undefined,
      status: nextStatus,
    };
    try {
      if (isNew) {
        const created = (await api.caseStudies.create(payload)) as { id: string };
        setCaseStudyId(created.id);
        setStatus(nextStatus);
        setSaveMessage("Case study created. You can now add KPI metrics below.");
        router.replace(`/case-studies/edit/${created.id}`);
      } else {
        await api.caseStudies.update(resolvedParams.id, payload);
        setStatus(nextStatus);
        setSaveMessage(nextStatus === "PUBLISHED" ? "Case study published." : "Draft saved.");
      }
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Failed to save case study");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setIsCreatingCategory(true);
    try {
      const created = (await api.caseStudies.createCategory({ name })) as CategoryOption;
      setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryId(created.id);
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const updateMetric = (index: number, patch: Partial<MetricRow>) => {
    setMetrics((current) => current.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  };

  const handleAddMetricRow = () => setMetrics((current) => [...current, emptyMetricRow()]);

  const handleSaveMetric = async (index: number) => {
    const metric = metrics[index];
    if (!caseStudyId || !metric.label.trim() || !metric.value.trim()) return;
    try {
      const created = (await api.caseStudies.addMetric({
        label: metric.label.trim(),
        value: metric.value.trim(),
        changePercentage: metric.changePercentage.trim() || undefined,
        prefix: metric.prefix.trim() || undefined,
        suffix: metric.suffix.trim() || undefined,
        accent: metric.accent || undefined,
        caseStudyId,
        sortOrder: index,
      })) as { id: string };
      updateMetric(index, { id: created.id, saved: true });
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Failed to save metric");
    }
  };

  const handleDeleteMetric = async (index: number) => {
    const metric = metrics[index];
    if (metric.saved) {
      try {
        await api.caseStudies.deleteMetric(metric.id);
      } catch (err) {
        setSaveMessage(err instanceof Error ? err.message : "Failed to remove metric");
        return;
      }
    }
    setMetrics((current) => current.filter((_, i) => i !== index));
  };

  const updateTransformation = (index: number, patch: Partial<TransformationRow>) => {
    setTransformations((current) => current.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };

  const handleAddTransformationRow = () => setTransformations((current) => [...current, emptyTransformationRow()]);

  const handleSaveTransformation = async (index: number) => {
    const row = transformations[index];
    if (!caseStudyId || !row.metric.trim() || !row.beforeValue.trim() || !row.afterValue.trim()) return;
    try {
      const created = (await api.caseStudies.addBeforeAfter({
        metric: row.metric.trim(),
        beforeValue: row.beforeValue.trim(),
        afterValue: row.afterValue.trim(),
        caseStudyId,
        sortOrder: index,
      })) as { id: string };
      updateTransformation(index, { id: created.id, saved: true });
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Failed to save transformation stat");
    }
  };

  const handleDeleteTransformation = async (index: number) => {
    const row = transformations[index];
    if (row.saved) {
      try {
        await api.caseStudies.deleteBeforeAfter(row.id);
      } catch (err) {
        setSaveMessage(err instanceof Error ? err.message : "Failed to remove transformation stat");
        return;
      }
    }
    setTransformations((current) => current.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading case study...</div>;
  }

  if (loadError) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{loadError}</div>
        <button onClick={() => router.push("/case-studies")} className="mt-4 text-sm text-primary hover:underline">
          Back to Case Studies
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 -my-4 mb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/case-studies")} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-white">{isNew ? "Create Case Study" : "Edit Case Study"}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => handleSave("DRAFT")} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors border border-white/10 disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button onClick={() => handleSave("PUBLISHED")} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50">
            <Save className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {saveMessage && <p role="status" className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-300">{saveMessage}</p>}

      {/* Basic Info Section */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none" placeholder="e.g. Scaling a D2C Fashion Brand by 300%" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Client Name</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none" placeholder="e.g. Aura Apparel" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Industry</label>
            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none" placeholder="e.g. E-Commerce" />
          </div>
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-400">Category</label>
              <button type="button" onClick={() => setIsAddingCategory((v) => !v)} className="text-xs font-medium text-primary hover:text-primary/80">
                {isAddingCategory ? "Cancel" : "+ Add New Category"}
              </button>
            </div>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none appearance-none">
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {isAddingCategory && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                  placeholder="e.g. E-Commerce"
                  className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreatingCategory || !newCategoryName.trim()}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingCategory ? "Adding..." : "Add"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-gray-400">Short Summary</label>
          <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-400">Read Time</label>
            <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none" placeholder="e.g. 5 min read" />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-gray-400">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-full max-w-xs bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none appearance-none">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </section>

      {/* Rich Text Editors */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Editorial Content</h2>
        <p className="text-xs text-gray-500 -mt-2">Use the toolbar's bullet/numbered list buttons for lists — they render as real HTML lists on the live page.</p>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-400">The Challenge</label>
          <RichTextEditor value={challenge} onChange={setChallenge} placeholder="Describe the client's challenge..." />
        </div>

        <div className="space-y-4 pt-4">
          <label className="text-sm font-medium text-gray-400">Our Strategy</label>
          <RichTextEditor value={solution} onChange={setSolution} placeholder="Describe the strategy and solution..." />
        </div>

        <div className="space-y-4 pt-4">
          <label className="text-sm font-medium text-gray-400">Results</label>
          <RichTextEditor value={results} onChange={setResults} placeholder="Describe the measurable outcomes..." />
        </div>
      </section>

      {/* KPI Metrics */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-white">KPI Dashboard Metrics</h2>
          <button onClick={handleAddMetricRow} disabled={!caseStudyId} className="text-sm flex items-center gap-2 text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" /> Add Metric
          </button>
        </div>

        {!caseStudyId && <p className="text-gray-500 italic text-sm text-center py-4">Save the case study first, then add KPI metrics here.</p>}

        {caseStudyId && (
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={metric.id} className="flex items-center gap-3 bg-background p-4 rounded-lg border border-white/5 group flex-wrap">
                <GripVertical className="w-5 h-5 text-gray-600 cursor-grab shrink-0" />
                <input placeholder="Label (e.g. Revenue)" value={metric.label} onChange={(e) => updateMetric(index, { label: e.target.value })} className="flex-1 min-w-[120px] bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <input placeholder="Prefix (+)" value={metric.prefix} onChange={(e) => updateMetric(index, { prefix: e.target.value })} className="w-16 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <input placeholder="Value (300)" value={metric.value} onChange={(e) => updateMetric(index, { value: e.target.value })} className="w-24 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <input placeholder="Suffix (%)" value={metric.suffix} onChange={(e) => updateMetric(index, { suffix: e.target.value })} className="w-16 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <input placeholder="Change (+400%)" value={metric.changePercentage} onChange={(e) => updateMetric(index, { changePercentage: e.target.value })} className="w-28 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <select value={metric.accent} onChange={(e) => updateMetric(index, { accent: e.target.value })} className="bg-transparent border-b border-white/10 px-2 py-1 text-white outline-none">
                  <option value="primary">Primary</option>
                  <option value="cyan">Cyan</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </select>
                {!metric.saved && (
                  <button onClick={() => handleSaveMetric(index)} disabled={!metric.label.trim() || !metric.value.trim()} className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    Save
                  </button>
                )}
                <button onClick={() => handleDeleteMetric(index)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {metrics.length === 0 && <p className="text-gray-500 italic text-sm text-center py-4">No metrics added yet.</p>}
          </div>
        )}
      </section>

      {/* The Transformation */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">The Transformation</h2>
            <p className="mt-1 text-xs text-gray-500">Before / after stat comparisons shown in "The Transformation" section on the case study page.</p>
          </div>
          <button onClick={handleAddTransformationRow} disabled={!caseStudyId} className="text-sm flex items-center gap-2 text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>

        {!caseStudyId && <p className="text-gray-500 italic text-sm text-center py-4">Save the case study first, then add transformation stats here.</p>}

        {caseStudyId && (
          <div className="space-y-4">
            {transformations.map((row, index) => (
              <div key={row.id} className="flex items-center gap-3 bg-background p-4 rounded-lg border border-white/5 group flex-wrap">
                <GripVertical className="w-5 h-5 text-gray-600 cursor-grab shrink-0" />
                <input placeholder="Metric (e.g. Organic Traffic)" value={row.metric} onChange={(e) => updateTransformation(index, { metric: e.target.value })} className="flex-1 min-w-[160px] bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <input placeholder="Before (e.g. 500 / mo)" value={row.beforeValue} onChange={(e) => updateTransformation(index, { beforeValue: e.target.value })} className="w-36 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                <input placeholder="After (e.g. 5,000 / mo)" value={row.afterValue} onChange={(e) => updateTransformation(index, { afterValue: e.target.value })} className="w-36 bg-transparent border-b border-white/10 px-2 py-1 text-white focus:border-primary outline-none" />
                {!row.saved && (
                  <button onClick={() => handleSaveTransformation(index)} disabled={!row.metric.trim() || !row.beforeValue.trim() || !row.afterValue.trim()} className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    Save
                  </button>
                )}
                <button onClick={() => handleDeleteTransformation(index)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {transformations.length === 0 && <p className="text-gray-500 italic text-sm text-center py-4">No transformation stats added yet.</p>}
          </div>
        )}
      </section>

      {/* Media */}
      <section className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Cover Image</h2>

        {coverImagePreview ? (
          <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <MediaSelector
                triggerText="Replace"
                folder="case-studies"
                onSelect={(asset) => {
                  setCoverImageId(asset.id);
                  setCoverImagePreview(asset.url);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImageId(undefined);
                  setCoverImagePreview(null);
                }}
                className="flex items-center gap-1 bg-red-500/20 text-red-300 hover:bg-red-500/40 px-3 py-2 rounded-md font-medium text-sm transition-colors"
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.02]">
            <MediaSelector
              triggerText="Upload or Browse Cover Image"
              folder="case-studies"
              onSelect={(asset) => {
                setCoverImageId(asset.id);
                setCoverImagePreview(asset.url);
              }}
            />
            <p className="text-xs text-gray-500 mt-4">Shown on the case study card and detail page hero.</p>
          </div>
        )}
      </section>
    </div>
  );
}
