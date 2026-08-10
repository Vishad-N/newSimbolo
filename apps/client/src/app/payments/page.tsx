"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { mockApi } from "@/services/api";
import { CreditCard, Download, AlertCircle, FileText, Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    mockApi.payments.getAll().then(setPayments);
    mockApi.invoices.getAll().then(setInvoices);
  }, []);

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      await mockApi.invoices.downloadPdf(invoiceId);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download invoice PDF.");
    }
  };

  const paymentColumns = [
    { key: "id", header: "Transaction ID" },
    { key: "createdAt", header: "Date", render: (item: any) => <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span> },
    {
      key: "method",
      header: "Payment Method",
      render: (item: any) => (
        <span className="flex items-center gap-2 text-white">
          <CreditCard className="w-4 h-4 text-gray-400" /> {item.paymentMethod || item.method || 'Razorpay'}
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
          item.status === 'SUCCESSFUL' || item.status === 'Successful' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          item.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status || 'Unknown'}
        </span>
      )
    }
  ];

  const invoiceColumns = [
    { 
      key: "invoiceNumber", 
      header: "Invoice No",
      render: (item: any) => <span className="font-medium text-white">{item.invoiceNumber}</span>
    },
    { 
      key: "issueDate", 
      header: "Date", 
      render: (item: any) => <span>{item.issueDate ? new Date(item.issueDate).toLocaleDateString() : 'N/A'}</span> 
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      render: (item: any) => (
        <span className="font-medium text-white">₹{item.totalAmount?.toLocaleString('en-IN') ?? 0}</span>
      )
    },
    {
      key: "taxAmount",
      header: "GST Amount",
      render: (item: any) => (
        <span className="text-gray-400">₹{item.taxAmount?.toLocaleString('en-IN') ?? 0}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'PAID' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          item.status === 'SENT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
          item.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status || 'Draft'}
        </span>
      )
    },
    {
      key: "actions",
      header: "",
      render: (item: any) => (
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => handleDownloadInvoice(item.id)}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-primary hover:text-primary-hover rounded transition-colors border border-white/10 flex items-center gap-2"
            title="Download GST Invoice"
          >
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
            <Receipt className="w-6 h-6 text-primary" />
            Billing & Invoices
          </h1>
          <p className="text-sm text-gray-400">View your payment history and download GST tax invoices.</p>
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
          <div className="text-gray-400 text-sm font-medium">Total Invoices</div>
          <div className="text-3xl font-heading font-bold text-white">{invoices.length}</div>
          <div className="text-gray-400 text-xs font-medium mt-1">
            Generated GST Invoices
          </div>
        </Card>
        <Card className="flex flex-col justify-center p-6 space-y-1">
          <div className="text-gray-400 text-sm font-medium">Last Payment</div>
          <div className="text-3xl font-heading font-bold text-white">₹24,999</div>
          <div className="text-gray-400 text-xs font-medium mt-1">
            05 June 2026
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'payments' 
              ? 'text-primary' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Payment History
          {activeTab === 'payments' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_var(--primary-glow)] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'invoices' 
              ? 'text-primary' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          GST Invoices
          {activeTab === 'invoices' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_var(--primary-glow)] rounded-t-full" />
          )}
        </button>
      </div>

      <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg mt-6">
        {activeTab === 'payments' ? (
          <DataTable columns={paymentColumns} data={payments} />
        ) : (
          <DataTable columns={invoiceColumns} data={invoices} />
        )}
      </div>
    </div>
  );
}
