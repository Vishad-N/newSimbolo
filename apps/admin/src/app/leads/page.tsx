"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Mail, Phone, RefreshCw, Trash, Eye, CheckCircle2, MessageSquare } from "lucide-react";
import { api } from "@/services/api";

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  phoneHref: string;
  company: string;
  service: string;
  status: string;
  createdAt: string;
  message: string;
}

interface LeadApiRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string | null;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  status: string;
  message: string;
  createdAt: string;
}

interface LeadApiResponse {
  data?: LeadApiRecord[];
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function formatPhone(countryCode?: string | null, phone?: string | null): string {
  if (!phone) return "Not provided";
  return countryCode ? `${countryCode} ${phone}` : phone;
}

export default function LeadsPage() {
  const [data, setData] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.leads.getAll() as LeadApiRecord[] | LeadApiResponse;
      const leads = Array.isArray(response) ? response : response.data || [];
      
      const mappedData: LeadData[] = leads.map((lead) => ({
        id: lead.id,
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: formatPhone(lead.countryCode, lead.phone),
        phoneHref: lead.phone ? `${lead.countryCode || ""}${lead.phone}` : "",
        company: lead.company || "Not provided",
        service: lead.service || "General Inquiry",
        status: lead.status,
        message: lead.message,
        createdAt: new Date(lead.createdAt).toLocaleDateString(),
      }));
      setData(mappedData);
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Failed to fetch leads"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.leads.delete(id);
      fetchData();
    } catch (requestError) {
      alert("Failed to delete lead: " + getErrorMessage(requestError, "Unknown error"));
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.leads.update(id, { status });
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
      fetchData();
    } catch (requestError) {
      alert("Failed to update status: " + getErrorMessage(requestError, "Unknown error"));
    }
  };

  const columns = [
    {
      key: "name",
      header: "Lead Info",
      render: (item: LeadData) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center overflow-hidden">
            <Mail className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="font-medium text-white block">{item.name}</span>
            <span className="text-xs text-gray-400 block">{item.email}</span>
            <span className="text-xs text-gray-400 block">{item.phone}</span>
          </div>
        </div>
      )
    },
    { key: "service", header: "Interested Service" },
    { key: "createdAt", header: "Date Received" },
    {
      key: "status",
      header: "Status",
      render: (item: LeadData) => {
        let colorClass = "bg-gray-500/10 text-gray-400 border-gray-500/20";
        if (item.status === 'NEW') colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        if (item.status === 'CONTACTED') colorClass = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        if (item.status === 'CONVERTED') colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClass}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: LeadData) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedLead(item)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Contact Leads</h1>
          <p className="text-sm text-gray-400">View and manage inquiries from the landing page.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">Total Leads</span>
          <span className="text-2xl font-bold text-white">{data.length}</span>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <span className="text-sm text-gray-400 mb-1">New Leads</span>
          <span className="text-2xl font-bold text-blue-400">
            {data.filter(p => p.status === 'NEW').length}
          </span>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Error: {error}
        </div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading leads...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data}
        />
      )}

      {/* VIEW MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl relative">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                  <p className="text-sm text-gray-400">Full contact details</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a href={`mailto:${selectedLead.email}`} className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400"><Mail className="h-3 w-3" /> Email</p>
                  <p className="break-all text-sm font-medium text-blue-400">{selectedLead.email}</p>
                </a>
                {selectedLead.phoneHref ? (
                  <a href={`tel:${selectedLead.phoneHref}`} className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400"><Phone className="h-3 w-3" /> Phone</p>
                    <p className="text-sm font-medium text-blue-400">{selectedLead.phone}</p>
                  </a>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400"><Phone className="h-3 w-3" /> Phone</p>
                    <p className="text-sm text-gray-400">Not provided</p>
                  </div>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><MessageSquare className="w-3 h-3"/> Message</p>
                <p className="text-white whitespace-pre-wrap">{selectedLead.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Interested In</p>
                  <p className="text-white font-medium">{selectedLead.service}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Received On</p>
                  <p className="text-white font-medium">{selectedLead.createdAt}</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Company</p>
                <p className="text-white font-medium">{selectedLead.company}</p>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-6">
              <p className="text-sm text-gray-400 mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleUpdateStatus(selectedLead.id, 'NEW')} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selectedLead.status === 'NEW' ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>New</button>
                <button onClick={() => handleUpdateStatus(selectedLead.id, 'CONTACTED')} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selectedLead.status === 'CONTACTED' ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>Contacted</button>
                <button onClick={() => handleUpdateStatus(selectedLead.id, 'QUALIFIED')} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${selectedLead.status === 'QUALIFIED' ? 'bg-purple-500 text-white border-purple-400' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>Qualified</button>
                <button onClick={() => handleUpdateStatus(selectedLead.id, 'CONVERTED')} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${selectedLead.status === 'CONVERTED' ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Converted
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
