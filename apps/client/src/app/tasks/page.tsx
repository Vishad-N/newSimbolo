"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mockApi } from "@/services/api";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    mockApi.tasks.getAll().then(setTasks);
  }, []);

  const columns = [
    { key: "title", header: "Task" },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          item.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "progress",
      header: "Progress",
      render: (item: any) => (
        <div className="w-32">
          <ProgressBar progress={item.progress} />
        </div>
      )
    },
    { key: "deadline", header: "Deadline" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            Task Progress
          </h1>
          <p className="text-sm text-gray-400">Track individual tasks across all your projects. (Task Pilot Integration)</p>
        </div>
      </div>

      <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <DataTable columns={columns} data={tasks} />
      </div>
    </div>
  );
}
