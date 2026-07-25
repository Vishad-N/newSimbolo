"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/DataTable";

const valuesData = [
  { id: "1", title: "Innovation", accent: "blue" },
  { id: "2", title: "Transparency", accent: "green" },
];

export function CoreValuesManager() {
  const columns = [
    { header: "Title", accessorKey: "title", cell: (item: any) => <span className="font-medium text-white">{item.title}</span> },
    { header: "Accent Color", accessorKey: "accent", cell: (item: any) => <span className="text-muted-foreground">{item.accent}</span> },
  ];

  const actions = [
    { icon: Edit2, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {}, variant: "destructive" as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Core Values</h3>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Plus className="w-4 h-4" /> Add Value
        </button>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <DataTable columns={columns} data={valuesData} actions={actions} />
      </div>
    </div>
  );
}
