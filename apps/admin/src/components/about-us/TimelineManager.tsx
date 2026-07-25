"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/DataTable";

const timelineData = [
  { id: "1", year: "2022", title: "Founded" },
  { id: "2", year: "2023", title: "50 Clients Milestone" },
  { id: "3", year: "2024", title: "Platform Expansion" },
];

export function TimelineManager() {
  const columns = [
    { header: "Year", accessorKey: "year", cell: (item: any) => <span className="text-[var(--primary)] font-bold">{item.year}</span> },
    { header: "Title", accessorKey: "title", cell: (item: any) => <span className="font-medium text-white">{item.title}</span> },
  ];

  const actions = [
    { icon: Edit2, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {}, variant: "destructive" as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Company Timeline</h3>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <DataTable columns={columns} data={timelineData} actions={actions} />
      </div>
    </div>
  );
}
