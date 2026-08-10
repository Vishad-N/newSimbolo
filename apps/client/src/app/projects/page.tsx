"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { mockApi } from "@/services/api";
import { FolderKanban, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    mockApi.profile.get()
      .then(profileData => {
        const clientId = profileData?.clientId || profileData?.id;
        if (clientId) {
          mockApi.projects.getAll(clientId).then(setProjects);
        }
      })
      .catch(console.error);
  }, []);

  const columns = [
    {
      key: "name",
      header: "Project",
      render: (item: any) => (
        <div>
          <div className="font-medium text-white">{item.name}</div>
          <div className="text-xs text-gray-500">{item.service}</div>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'IN_PROGRESS' || item.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
          item.status === 'PLANNING' || item.status === 'ON_HOLD' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
          item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status || 'Active'}
        </span>
      )
    },
    {
      key: "progress",
      header: "Progress",
      render: (item: any) => (
        <div className="w-32">
          <ProgressBar progress={item.progress || 0} />
        </div>
      )
    },
    { key: "targetEndDate", header: "Est. Delivery", render: (item: any) => <span>{item.targetEndDate ? new Date(item.targetEndDate).toLocaleDateString() : 'TBD'}</span> },
    {
      key: "actions",
      header: "",
      render: (item: any) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${item.id}`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors border border-white/10 ml-auto"
        >
          Workspace <ExternalLink className="w-3 h-3" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-primary" />
            My Projects
          </h1>
          <p className="text-sm text-gray-400">Track and manage all your active and past projects.</p>
        </div>
      </div>

      <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <DataTable 
          columns={columns} 
          data={projects} 
          onRowClick={(item) => router.push(`/projects/${item.id}`)}
        />
      </div>
    </div>
  );
}
