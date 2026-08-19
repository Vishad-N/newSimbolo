"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Landmark, Power, PowerOff, RefreshCw, User } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { StatCard, StatusBadge, formatCurrency, formatDate, getErrorMessage } from "@/components/affiliate/AffiliateShared";
import {
  api,
  type AdminAffiliateCommission,
  type AdminAffiliateWithdrawal,
  type AdminWalletTransaction,
  type AffiliateEmployeeDetail,
} from "@/services/api";

export default function AffiliateEmployeeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const employeeId = params?.id;

  const [employee, setEmployee] = useState<AffiliateEmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!employeeId) return;
    setIsLoading(true);
    setError(null);
    try {
      setEmployee(await api.affiliate.getEmployee(employeeId));
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Failed to fetch employee detail"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const handleToggleStatus = async () => {
    if (!employee) return;
    const isActive = employee.status === "ACTIVE";
    if (!confirm(`${isActive ? "Deactivate" : "Activate"} ${employee.name}?`)) return;
    try {
      if (isActive) {
        await api.affiliate.deactivateEmployee(employee.id);
      } else {
        await api.affiliate.activateEmployee(employee.id);
      }
      fetchData();
    } catch (requestError) {
      alert("Failed to update employee: " + getErrorMessage(requestError, "Unknown error"));
    }
  };

  const commissionColumns = [
    { key: "orderId", header: "Order", render: (item: AdminAffiliateCommission) => <span className="text-white">{item.orderId}</span> },
    {
      key: "commissionAmount",
      header: "Commission",
      render: (item: AdminAffiliateCommission) => <span className="text-white">{formatCurrency(item.commissionAmount)}</span>,
    },
    { key: "commissionRate", header: "Rate", render: (item: AdminAffiliateCommission) => <span>{Number(item.commissionRate ?? 0)}%</span> },
    { key: "status", header: "Status", render: (item: AdminAffiliateCommission) => <StatusBadge status={item.status} /> },
    { key: "eligibleAt", header: "Eligible On", render: (item: AdminAffiliateCommission) => <span>{formatDate(item.eligibleAt)}</span> },
    { key: "creditedAt", header: "Credited On", render: (item: AdminAffiliateCommission) => <span>{formatDate(item.creditedAt)}</span> },
    { key: "createdAt", header: "Created", render: (item: AdminAffiliateCommission) => <span>{formatDate(item.createdAt)}</span> },
  ];

  const ledgerColumns = [
    { key: "type", header: "Type", render: (item: AdminWalletTransaction) => <span className="text-white">{item.type}</span> },
    {
      key: "amount",
      header: "Amount",
      render: (item: AdminWalletTransaction) => (
        <span className={Number(item.amount) < 0 ? "text-red-400" : "text-emerald-400"}>{formatCurrency(item.amount)}</span>
      ),
    },
    { key: "balanceBefore", header: "Balance Before", render: (item: AdminWalletTransaction) => <span>{formatCurrency(item.balanceBefore)}</span> },
    { key: "balanceAfter", header: "Balance After", render: (item: AdminWalletTransaction) => <span className="text-white">{formatCurrency(item.balanceAfter)}</span> },
    { key: "description", header: "Description" },
    { key: "createdAt", header: "Date", render: (item: AdminWalletTransaction) => <span>{formatDate(item.createdAt)}</span> },
  ];

  const withdrawalColumns = [
    { key: "amount", header: "Amount", render: (item: AdminAffiliateWithdrawal) => <span className="text-white">{formatCurrency(item.amount)}</span> },
    { key: "status", header: "Status", render: (item: AdminAffiliateWithdrawal) => <StatusBadge status={item.status} /> },
    { key: "requestedAt", header: "Requested", render: (item: AdminAffiliateWithdrawal) => <span>{formatDate(item.requestedAt)}</span> },
    { key: "processedAt", header: "Processed", render: (item: AdminAffiliateWithdrawal) => <span>{formatDate(item.processedAt)}</span> },
    { key: "payoutMethod", header: "Payout Method", render: (item: AdminAffiliateWithdrawal) => <span>{item.payoutMethod || "—"}</span> },
    {
      key: "razorpayPayoutId",
      header: "Razorpay Payout ID",
      render: (item: AdminAffiliateWithdrawal) => <span className="font-mono text-xs">{item.razorpayPayoutId || "—"}</span>,
    },
  ];

  if (isLoading) {
    return <div className="p-12 flex justify-center text-gray-400">Loading employee detail...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">Error: {error}</div>;
  }

  if (!employee) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.push("/affiliate")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Sales &amp; Affiliate
        </button>
        <div className="p-12 text-center text-gray-400 glass-card rounded-xl">Employee not found.</div>
      </div>
    );
  }

  const isActive = employee.status === "ACTIVE";

  return (
    <div className="space-y-6">
      <button onClick={() => router.push("/affiliate")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Sales &amp; Affiliate
      </button>

      {/* Profile card */}
      <div className="glass-card rounded-xl p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-white">{employee.name}</h1>
            <p className="text-sm text-gray-400">{employee.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-primary">{employee.affiliateCode}</span>
              <StatusBadge status={employee.status} />
              {employee.commissionRate !== undefined && (
                <span className="text-xs text-gray-400">Commission rate: {employee.commissionRate}%</span>
              )}
              {employee.createdAt && <span className="text-xs text-gray-500">Joined {formatDate(employee.createdAt)}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
              isActive
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
            }`}
          >
            {isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Orders" value={String(employee.ordersCount ?? 0)} />
        <StatCard label="Sales" value={formatCurrency(employee.salesTotal)} />
        <StatCard label="Commission" value={formatCurrency(employee.commissionTotal)} />
        <StatCard label="Available Wallet" value={formatCurrency(employee.walletAvailable)} />
        <StatCard label="Pending Wallet" value={formatCurrency(employee.walletPending)} />
        <StatCard label="Lifetime Withdrawn" value={formatCurrency(employee.lifetimeWithdrawn)} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-heading font-bold text-white">Commission History</h2>
        <DataTable columns={commissionColumns} data={employee.commissions || []} emptyMessage="No commissions recorded." />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-heading font-bold text-white">Wallet Ledger</h2>
        <DataTable columns={ledgerColumns} data={employee.walletTransactions || []} emptyMessage="No wallet transactions." />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-heading font-bold text-white">Withdrawals</h2>
        <DataTable columns={withdrawalColumns} data={employee.withdrawals || []} emptyMessage="No withdrawals requested." />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-heading font-bold text-white">Payout Methods</h2>
        <div className="glass-card rounded-xl p-6 space-y-3">
          {(employee.payoutMethods || []).length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">No payout methods on file.</p>
          )}
          {(employee.payoutMethods || []).map((method) => (
            <div key={method.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-white">{method.type === "BANK_ACCOUNT" ? "Bank Account" : "UPI"}</span>
                    {method.isDefault && (
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Default
                      </span>
                    )}
                    <StatusBadge status={method.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{method.maskedDetails}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
