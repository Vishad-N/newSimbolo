"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Plus, Trash2, Sparkles } from "lucide-react";

export interface FeaturedServiceItem {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  accent: string;
}

interface FeaturedServicesEditorProps {
  initialData?: FeaturedServiceItem[];
  onChange?: (data: FeaturedServiceItem[]) => void;
}

const ACCENT_OPTIONS = ["blue", "green", "cyan", "purple", "pink", "orange", "teal"];

export function FeaturedServicesEditor({ initialData = [], onChange }: FeaturedServicesEditorProps) {
  const [items, setItems] = useState<FeaturedServiceItem[]>(initialData);

  const commit = (next: FeaturedServiceItem[]) => {
    setItems(next);
    onChange?.(next);
  };

  const addItem = () => {
    commit([
      ...items,
      { id: Date.now().toString(), title: "", image: "", price: "", rating: "4.8", accent: "cyan" },
    ]);
  };

  const updateItem = (id: string, patch: Partial<FeaturedServiceItem>) => {
    commit(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    commit(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Featured Service Cards
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-md transition-colors border border-white/10"
        >
          <Plus className="w-3 h-3" /> Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="relative group bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
            <div
              className="absolute top-4 right-4 z-10 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md backdrop-blur-sm cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </div>

            <ImageUploader
              label="Thumbnail"
              value={item.image}
              onChange={(image) => updateItem(item.id, { image })}
              folder="homepage"
            />

            <div>
              <label className="block text-xs text-gray-400 mb-1">Service Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="e.g. Meta Ads"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Starting Price</label>
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, { price: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="₹4,999"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Rating</label>
                <input
                  type="text"
                  value={item.rating}
                  onChange={(e) => updateItem(item.id, { rating: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="4.9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Accent Color</label>
              <select
                value={item.accent}
                onChange={(e) => updateItem(item.id, { accent: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {ACCENT_OPTIONS.map((accent) => (
                  <option key={accent} value={accent} className="bg-[#0B0F19]">
                    {accent}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
          Click "Add Card" to create a featured service card. If left empty, the website shows its built-in default cards.
        </div>
      )}
    </div>
  );
}
