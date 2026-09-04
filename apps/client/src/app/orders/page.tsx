"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { clientApi } from "@/services/api";
import { ShoppingCart, Download, ExternalLink, Layers } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [invoicesByOrderId, setInvoicesByOrderId] = useState<Record<string, string>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    clientApi.profile.get()
      .then(profileData => {
        const clientId = profileData?.clientId || profileData?.id;
        if (clientId) {
          clientApi.orders.getAll(clientId).then(setOrders);
        }
      })
      .catch(console.error);

    // The order list itself doesn't carry invoice data — map each order to its
    // invoice (if one has been generated yet) so "Download" can target the right PDF.
    clientApi.invoices.getAll()
      .then((invoices: any[]) => {
        const map: Record<string, string> = {};
        for (const invoice of invoices) {
          if (invoice.orderId) map[invoice.orderId] = invoice.id;
        }
        setInvoicesByOrderId(map);
      })
      .catch(console.error);
  }, []);

  const handleDownload = async (orderId: string) => {
    const invoiceId = invoicesByOrderId[orderId];
    if (!invoiceId) return;
    setDownloadingId(orderId);
    try {
      await clientApi.invoices.downloadPdf(invoiceId);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download invoice PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    { key: "orderNumber", header: "Order #" },
    {
      key: "service",
      header: "Purchased Service",
      render: (item: any) => (
        <span className="font-medium text-white">{item.service?.name || item.package?.name || "—"}</span>
      )
    },
    {
      key: "createdAt",
      header: "Date",
      render: (item: any) => <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</span>
    },
    {
      key: "netAmount",
      header: "Amount",
      render: (item: any) => (
        <span className="font-medium text-white">₹{Number(item.netAmount ?? item.totalAmount ?? 0).toLocaleString('en-IN')}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'ACTIVE' || item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "",
      render: (item: any) => {
        const invoiceId = invoicesByOrderId[item.id];
        const projectId = item.project?.id;
        return (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => invoiceId && handleDownload(item.id)}
              disabled={!invoiceId || downloadingId === item.id}
              title={invoiceId ? "Download invoice" : "No invoice generated yet"}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors border border-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/5"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => projectId && router.push(`/projects/${projectId}`)}
              disabled={!projectId}
              title={projectId ? "View project" : "No project linked yet"}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors border border-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/5"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            My Services
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
