"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
}

interface NavItemsEditorProps {
  initialData?: NavItem[];
  onChange?: (data: NavItem[]) => void;
}

export function NavItemsEditor({ initialData = [], onChange }: NavItemsEditorProps) {
  const [items, setItems] = useState<NavItem[]>(initialData);

  const addItem = () => {
    const newItems = [...items, { id: Date.now().toString(), label: "New Link", href: "/", iconName: "Link" }];
    setItems(newItems);
    onChange?.(newItems);
  };

  const updateItem = (id: string, field: keyof NavItem, value: string) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setItems(newItems);
    onChange?.(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    onChange?.(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Menu Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium rounded-md transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Link
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4 bg-black/40 border border-white/10 rounded-xl group">
            <div aria-hidden="true" className="mt-2 text-gray-500">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, "label", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="e.g. Services"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Link (URL Path)</label>
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateItem(item.id, "href", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="e.g. /services"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Icon (Lucide Name)</label>
                <input
                  type="text"
                  value={item.iconName}
                  onChange={(e) => updateItem(item.id, "iconName", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="e.g. Search, ShoppingCart"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="mt-6 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500 border border-dashed border-white/10 rounded-xl">
            No links added yet.
          </div>
        )}
      </div>
    </div>
  );
}
