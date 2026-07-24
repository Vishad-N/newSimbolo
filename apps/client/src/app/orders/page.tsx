"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { mockApi } from "@/services/api";
import { ShoppingCart, Download, ExternalLink } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    mockApi.orders.getAll().then(setOrders);
  }, []);

  const columns = [
    { key: "id", header: "Order #" },
    {
      key: "service",
      header: "Purchased Service",
      render: (item: any) => (
        <span className="font-medium text-white">{item.service}</span>
      )
    },
    { key: "date", header: "Date" },
    {
      key: "amount",
      header: "Amount",
      render: (item: any) => (
        <span className="font-medium text-white">₹{item.amount.toLocaleString('en-IN')}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "",
      render: (item: any) => (
        <div className="flex gap-2 justify-end">
          <button className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors border border-white/10">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors border border-white/10">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            Order History
          </h1>
          <p className="text-sm text-gray-400">View and manage all your purchased services and packages.</p>
        </div>
      </div>

      <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
