"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/DataTable";

const statsData = [
  { id: "1", value: "250", suffix: "+", label: "Projects Delivered" },
  { id: "2", value: "100", suffix: "+", label: "Happy Clients" },
];

export function StatisticsManager() {
  const columns = [
    { header: "Value", accessorKey: "value", cell: (item: any) => <span className="text-[var(--primary)] font-bold">{item.value}{item.suffix}</span> },
    { header: "Label", accessorKey: "label", cell: (item: any) => <span className="font-medium text-white">{item.label}</span> },
  ];

  const actions = [
    { icon: Edit2, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {}, variant: "destructive" as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Statistics</h3>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Plus className="w-4 h-4" /> Add Stat
        </button>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <DataTable columns={columns} data={statsData} actions={actions} />
      </div>
    </div>
  );
}
