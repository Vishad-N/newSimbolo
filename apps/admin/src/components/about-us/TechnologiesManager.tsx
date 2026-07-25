"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/DataTable";

const techData = [
  { id: "1", name: "React", icon: "FileCode2" },
  { id: "2", name: "Node.js", icon: "Database" },
];

export function TechnologiesManager() {
  const columns = [
    { header: "Name", accessorKey: "name", cell: (item: any) => <span className="font-medium text-white">{item.name}</span> },
    { header: "Icon Reference", accessorKey: "icon", cell: (item: any) => <span className="text-muted-foreground">{item.icon}</span> },
  ];

  const actions = [
    { icon: Edit2, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {}, variant: "destructive" as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Technologies</h3>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Plus className="w-4 h-4" /> Add Technology
        </button>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <DataTable columns={columns} data={techData} actions={actions} />
      </div>
    </div>
  );
}
