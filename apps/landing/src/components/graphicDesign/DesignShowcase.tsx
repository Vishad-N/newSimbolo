"use client";

import { useGraphicDesignServices } from "@/hooks/useGraphicDesignServices";
import { DesignCategoryCard } from "@/components/graphicDesign/DesignCategoryCard";
import { DesignProcessStrip } from "@/components/graphicDesign/DesignProcessStrip";
import { WhyDesignsStandOut } from "@/components/graphicDesign/WhyDesignsStandOut";

export function DesignShowcase() {
  const { categories, loading } = useGraphicDesignServices();

  const publishedCategories = categories
    .filter(c => c.status === "published")
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-[1.5rem] font-black text-white sm:text-[1.8rem]">Creative Design Solutions</h2>
        <p className="mt-1 max-w-2xl text-[0.85rem] text-white/70 leading-relaxed">
          Explore our extensive range of design capabilities. We blend creativity with strategic thinking to deliver assets that elevate your brand and drive results.
        </p>
      </div>

      {/* Grid of Design Categories */}
      {publishedCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {publishedCategories.map((category, index) => (
            <DesignCategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-white/5 bg-[var(--surface)] py-16 text-center">
          <p className="text-[1rem] font-medium text-white/60">No design categories found.</p>
        </div>
      )}

      <div className="mt-4">
        <DesignProcessStrip />
      </div>

      <div className="mt-4">
        <WhyDesignsStandOut />
      </div>
    </div>
  );
}
