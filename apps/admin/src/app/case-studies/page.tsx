"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Briefcase, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data matching the new Case Study structure
const mockData = [
  {
    id: "cs_ecommerce_scaling",
    title: "Scaling a D2C Fashion Brand by 300%",
    client: "Aura Apparel",
    industry: "E-Commerce",
    publishDate: "2024-03-15",
    status: "Published",
    featured: true,
  },
  {
    id: "cs_b2b_saas",
    title: "Driving High-Quality Enterprise Leads",
    client: "TechFlow SaaS",
    industry: "B2B SaaS",
    publishDate: "2024-04-20",
    status: "Published",
    featured: true,
  },
  {
    id: "cs_local_dental",
    title: "Dominating Local Search for Dental Clinics",
    client: "SmileCare Clinics",
    industry: "Healthcare",
    publishDate: "2024-05-10",
    status: "Published",
    featured: false,
  },
  {
    id: "cs_draft_1",
    title: "Rebranding a Legacy Financial Institution",
    client: "SecureBank",
    industry: "Finance",
    publishDate: "-",
    status: "Draft",
    featured: false,
  }
];

export default function CaseStudiesManagerPage() {
  const router = useRouter();
  const [data, setData] = useState(mockData);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (item: any) => (
        <div>
          <div className="font-medium text-white">{item.title}</div>
          <div className="text-xs text-muted-foreground">{item.client} • {item.industry}</div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === 'Published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
          item.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      header: "Featured",
      accessorKey: "featured",
      cell: (item: any) => (
        <span className="text-sm text-muted-foreground">
          {item.featured ? "Yes" : "No"}
        </span>
      )
    },
    { header: "Publish Date", accessorKey: "publishDate" },
  ];

  const actions = [
    {
      icon: Eye,
      label: "Preview",
      onClick: (item: any) => window.open(`http://localhost:3003/case-studies/${item.id === 'cs_ecommerce_scaling' ? 'scaling-ecommerce-brand' : 'b2b-saas-lead-gen'}`, '_blank')
    },
    {
      label: "Edit",
      onClick: (item: any) => router.push(`/case-studies/edit/${item.id}`)
    },
    {
      label: "Delete",
      onClick: (item: any) => setData(data.filter(d => d.id !== item.id)),
      variant: "destructive" as const
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            Case Studies
          </h1>
          <p className="text-muted-foreground mt-1">Manage success stories and client portfolios.</p>
        </div>
        
        <button 
          onClick={() => router.push('/case-studies/edit/new')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
        >
          <Plus className="w-4 h-4" />
          New Case Study
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Studies</div>
          <div className="text-3xl font-bold text-white">{data.length}</div>
        </div>
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Published</div>
          <div className="text-3xl font-bold text-green-400">{data.filter(d => d.status === 'Published').length}</div>
        </div>
        <div className="bg-surface border border-white/5 rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-1">Featured</div>
          <div className="text-3xl font-bold text-primary">{data.filter(d => d.featured).length}</div>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-xl p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-white">All Case Studies</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          actions={actions}
        />
      </div>
    </div>
  );
}
