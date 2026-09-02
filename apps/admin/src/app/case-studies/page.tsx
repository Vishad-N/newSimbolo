"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { Plus, Briefcase, RefreshCw, Trash } from "lucide-react";
import { api, getDataArray } from "@/services/api";

interface CaseStudyData {
  id: string;
  title: string;
  client: string;
  industry: string;
  status: string;
}

export default function CaseStudiesManagerPage() {
  const router = useRouter();
  const [data, setData] = useState<CaseStudyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const csRes = await api.caseStudies.getAll();
      const mappedData: CaseStudyData[] = getDataArray<any>(csRes).map((cs: any) => ({
        id: cs.id,
        title: cs.title,
        client: cs.clientName || "Unknown Client",
        industry: cs.industry || "General",
        status: cs.status || "PUBLISHED"
      }));
      setData(mappedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch case studies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await api.caseStudies.delete(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete case study: " + err.message);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Case Study",
      render: (item: CaseStudyData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.title}</div>
            <div className="text-xs text-gray-500">{item.client}</div>
          </div>
        </div>
      )
    },
    { key: "industry", header: "Industry" },
    {
      key: "status",
      header: "Status",
      render: (item: CaseStudyData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: CaseStudyData) => (
        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <Trash className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Case Studies
          </h1>
          <p className="text-sm text-gray-400">Manage client success stories and metrics.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => router.push("/case-studies/edit/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
          >
            <Plus className="w-4 h-4" />
            Add Case Study
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading Case Studies...</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={(item) => router.push(`/case-studies/edit/${item.id}`)}
        />
      )}
    </div>
  );
}
