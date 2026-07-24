"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { mockApi } from "@/services/api";
import { CreditCard, Download, ExternalLink, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    mockApi.payments.getAll().then(setPayments);
  }, []);

  const columns = [
    { key: "id", header: "Transaction ID" },
    { key: "date", header: "Date" },
    {
      key: "method",
      header: "Payment Method",
      render: (item: any) => (
        <span className="flex items-center gap-2 text-white">
          <CreditCard className="w-4 h-4 text-gray-400" /> {item.method}
        </span>
      )
    },
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
          item.status === 'Successful' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
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
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Payments
          </h1>
          <p className="text-sm text-gray-400">View your payment history and manage outstanding balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-center p-6 space-y-1">
          <div className="text-gray-400 text-sm font-medium">Outstanding Balance</div>
          <div className="text-3xl font-heading font-bold text-white">₹0.00</div>
          <div className="text-green-400 text-xs font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> All caught up
          </div>
        </Card>
        <Card className="flex flex-col justify-center p-6 space-y-1">
          <div className="text-gray-400 text-sm font-medium">Last Payment</div>
          <div className="text-3xl font-heading font-bold text-white">₹24,999</div>
          <div className="text-gray-400 text-xs font-medium mt-1">
            05 June 2026
          </div>
        </Card>
        <Card className="flex flex-col justify-center p-6 space-y-1">
          <div className="text-gray-400 text-sm font-medium">Upcoming Payment</div>
          <div className="text-3xl font-heading font-bold text-white">₹24,999</div>
          <div className="text-gray-400 text-xs font-medium mt-1">
            05 July 2026
          </div>
        </Card>
      </div>

      <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg mt-6">
        <DataTable columns={columns} data={payments} />
      </div>
    </div>
  );
}
