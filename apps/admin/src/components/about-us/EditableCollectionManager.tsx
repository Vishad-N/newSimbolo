"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { DataTable, Column } from "@/components/DataTable";
import { api } from "@/services/api";

export interface EditableCollectionItem {
  id: string;
  [key: string]: string;
}

interface EditableField {
  key: string;
  label: string;
}

interface EditableCollectionManagerProps {
  title: string;
  addLabel: string;
  sectionKey: string;
  fields: EditableField[];
  initialItems: EditableCollectionItem[];
}

export function EditableCollectionManager({ title, addLabel, sectionKey, fields, initialItems }: EditableCollectionManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<EditableCollectionItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.aboutUs.get()
      .then((response) => {
        const sectionItems = (response as Record<string, unknown>)[sectionKey];
        if (Array.isArray(sectionItems)) setItems(sectionItems as EditableCollectionItem[]);
      })
      .catch(() => undefined);
  }, [sectionKey]);

  const persist = async (nextItems: EditableCollectionItem[]) => {
    await api.aboutUs.update({ [sectionKey]: nextItems });
    setItems(nextItems);
  };

  const openNewItem = () => {
    setMessage(null);
    setEditingItem(fields.reduce<EditableCollectionItem>((item, field) => ({ ...item, [field.key]: "" }), { id: crypto.randomUUID() }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const nextItems = items.some((item) => item.id === editingItem.id)
        ? items.map((item) => item.id === editingItem.id ? editingItem : item)
        : [...items, editingItem];
      await persist(nextItems);
      setEditingItem(null);
      setMessage(`${title} saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Failed to save ${title.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: EditableCollectionItem) => {
    if (!confirm(`Delete this ${title.toLowerCase()} item?`)) return;
    setMessage(null);
    try {
      await persist(items.filter((candidate) => candidate.id !== item.id));
      setMessage(`${title} item deleted.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Failed to delete ${title.toLowerCase()} item`);
    }
  };

  const columns: Column<EditableCollectionItem>[] = fields.map((field) => ({
    accessorKey: field.key,
    header: field.label,
    cell: (item) => <span className="font-medium text-white">{item[field.key]}</span>,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button onClick={openNewItem} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>

      {message && <p role="status" className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-300">{message}</p>}

      <div className="rounded-xl border border-white/5 bg-surface p-6">
        <DataTable
          columns={columns}
          data={items}
          actions={[
            { icon: Edit2, label: "Edit", onClick: setEditingItem },
            { icon: Trash2, label: "Delete", onClick: handleDelete, variant: "destructive" },
          ]}
        />
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="w-full max-w-md rounded-xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit {title}</h2>
              <button type="button" onClick={() => setEditingItem(null)} className="p-2 text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {fields.map((field) => (
                <label key={field.key} className="block text-sm text-gray-400">
                  <span className="mb-1 block">{field.label}</span>
                  <input required value={editingItem[field.key]} onChange={(event) => setEditingItem({ ...editingItem, [field.key]: event.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={isSaving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{isSaving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
