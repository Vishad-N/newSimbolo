"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { mockApi } from "@/services/api";
import { LifeBuoy, MessageCircle, FileQuestion, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    mockApi.support.getTickets().then(setTickets);
  }, []);

  const columns = [
    { key: "id", header: "Ticket ID" },
    { 
      key: "subject", 
      header: "Subject",
      render: (item: any) => <span className="font-medium text-white">{item.subject}</span>
    },
    { key: "date", header: "Date Submitted" },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-primary" />
            Support Center
          </h1>
          <p className="text-sm text-gray-400">Get help, submit tickets, or chat directly with our team.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center gap-4 p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-lg">Live Chat</h3>
            <p className="text-sm text-gray-400">Talk to an agent instantly (Available 9AM - 6PM)</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-lg">Knowledge Base</h3>
            <p className="text-sm text-gray-400">Browse FAQs and guides to solve issues quickly</p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-heading font-bold text-white mb-4">My Tickets</h2>
        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
          <DataTable columns={columns} data={tickets} />
        </div>
      </div>
    </div>
  );
}
