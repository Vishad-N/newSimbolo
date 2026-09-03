"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { toSecureCloudinaryUrl } from "@/lib/utils";
import { useVideoServices } from "@/hooks/useVideoServices";
import { VideoServiceCard } from "@/components/videoEditing/VideoServiceCard";
import { VideoPreviewModal } from "@/components/videoEditing/VideoPreviewModal";
import type { VideoEditingService, VideoServiceCategory, PreviewType } from "@/types/video-editing";

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// The backend stores previewType/complexity/status as uppercase enums; the card
// components were built against the original mock data's lowercase/title-case strings.
function mapApiVideoItem(item: any): VideoEditingService {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    categoryIds: (item.categories || []).map((c: any) => c.id),
    thumbnail: toSecureCloudinaryUrl(item.thumbnail),
    previewType: String(item.previewType || "YOUTUBE").toLowerCase() as PreviewType,
    previewUrl: item.previewUrl,
    shortDescription: item.shortDescription,
    fullDescription: item.fullDescription ?? undefined,
    hourlyRate: item.hourlyRate,
    currency: item.currency,
    estimatedDelivery: item.estimatedDelivery ?? undefined,
    recommendedDuration: item.recommendedDuration ?? undefined,
    complexity: toTitleCase(item.complexity || "MEDIUM") as VideoEditingService["complexity"],
    tags: item.tags || [],
    badge: item.badge ?? undefined,
    status: String(item.status || "PUBLISHED").toLowerCase() as VideoEditingService["status"],
    featured: item.featured,
    displayOrder: item.displayOrder,
    ctaText: item.ctaText ?? undefined,
    ctaLink: item.ctaLink ?? undefined,
  };
}

function mapApiCategory(cat: any): VideoServiceCategory {
  return { id: cat.id, name: cat.name, slug: cat.slug };
}

export function VideoServiceCatalog({ liveServices, liveCategories }: { liveServices?: any[]; liveCategories?: any[] }) {
  const { services: mockServices, categories: mockCategories, loading } = useVideoServices();
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewService, setPreviewService] = useState<VideoEditingService | null>(null);

  const hasLiveData = !!(liveServices && liveServices.length > 0);

  const services = useMemo(
    () => (hasLiveData ? liveServices!.map(mapApiVideoItem) : mockServices),
    [hasLiveData, liveServices, mockServices],
  );

  const categories = useMemo(
    () => (liveCategories && liveCategories.length > 0 ? liveCategories.map(mapApiCategory) : mockCategories),
    [liveCategories, mockCategories],
  );

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => s.status === "published")
      .filter((s) => (activeCategoryId === "all" ? true : s.categoryIds.includes(activeCategoryId)))
      .filter((s) =>
        searchQuery
          ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          : true
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [services, activeCategoryId, searchQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-center md:text-left">
        <div>
          <h2 className="font-heading text-[1.5rem] font-black text-white sm:text-[2rem]">Our Video Editing Services</h2>
          <p className="mt-2 text-[0.95rem] text-white/70">Browse our professional editing services with transparent hourly pricing.</p>
        </div>
        
        <div className="relative w-full max-w-xs mx-auto md:mx-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search services, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-white/10 bg-[var(--surface)] pl-9 pr-4 text-[0.85rem] text-white outline-none transition focus:border-[var(--accent)]/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
        <button
          onClick={() => setActiveCategoryId("all")}
          className={`font-heading rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-colors ${
            activeCategoryId === "all"
              ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]"
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`font-heading rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-colors ${
              activeCategoryId === cat.id
                ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Service Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service, index) => (
            <VideoServiceCard
              key={service.id}
              service={service}
              index={index}
              onPreview={setPreviewService}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-white/5 bg-[var(--surface)] py-16 text-center">
          <p className="text-[1rem] font-medium text-white/60">No services found matching your criteria.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategoryId("all"); }}
            className="mt-4 text-[var(--accent)] hover:underline text-[0.9rem]"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewService && (
        <VideoPreviewModal
          isOpen={!!previewService}
          onClose={() => setPreviewService(null)}
          title={previewService.title}
          previewUrl={previewService.previewUrl}
          previewType={previewService.previewType}
        />
      )}
    </div>
  );
}
