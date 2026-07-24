"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
}

interface GallerySelectorProps {
  label?: string;
  initialData?: GalleryItem[];
  onChange?: (data: GalleryItem[]) => void;
}

export function GallerySelector({ label = "Gallery Images", initialData = [], onChange }: GallerySelectorProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialData);

  const addItem = () => {
    const newItems = [...items, { id: Date.now().toString(), url: "" }];
    setItems(newItems);
    onChange?.(newItems);
  };

  const updateItem = (id: string, url: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, url } : item);
    setItems(newItems);
    onChange?.(newItems);
  };

  const updateCaption = (id: string, caption: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, caption } : item);
    setItems(newItems);
    onChange?.(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    onChange?.(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {label}
        </h3>
        <button 
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-md transition-colors border border-white/10"
        >
          <Plus className="w-3 h-3" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="relative group bg-black/40 border border-white/10 rounded-xl p-3">
            <div className="absolute top-4 left-4 z-10 p-1.5 bg-black/60 rounded-md backdrop-blur-sm cursor-move text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="absolute top-4 right-4 z-10 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md backdrop-blur-sm cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(item.id)}>
              <Trash2 className="w-4 h-4" />
            </div>
            
            <ImageUploader 
              value={item.url} 
              onChange={(url) => updateItem(item.id, url)}
              className="mb-3"
            />
            
            <input 
              type="text" 
              value={item.caption || ""}
              onChange={(e) => updateCaption(item.id, e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Image caption (optional)"
            />
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-sm text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
          Click "Add Image" to select items from the media library.
        </div>
      )}
    </div>
  );
}
