"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/DataTable";

const teamData = [
  { id: "1", name: "Vishad", role: "Founder & CEO" },
  { id: "2", name: "Alex", role: "Lead Developer" },
  { id: "3", name: "Sarah", role: "Head of Design" }
];

export function TeamManager() {
  const columns = [
    { header: "Name", accessorKey: "name", cell: (item: any) => <span className="font-medium text-white">{item.name}</span> },
    { header: "Role", accessorKey: "role", cell: (item: any) => <span className="text-muted-foreground">{item.role}</span> },
  ];

  const actions = [
    { icon: Edit2, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {}, variant: "destructive" as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Team Members</h3>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      
      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <DataTable columns={columns} data={teamData} actions={actions} />
      </div>
    </div>
  );
}
