"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Ban, CheckCircle2, Eye, RefreshCw, RotateCcw, Send, Wallet } from "lucide-react";
import { DataTable, type ActionItem } from "@/components/DataTable";
import { StatCard, StatusBadge, formatCurrency, formatDate, getErrorMessage } from "@/components/affiliate/AffiliateShared";
import { api, type AdminAffiliateWithdrawal } from "@/services/api";

// "Process" fires the actual payout, so it is only offered while the request is
// still queued. "Retry" only makes sense after a failed payout attempt.
const PROCESSABLE_STATUSES = ["PENDING", "SCHEDULED"];
const CANCELLABLE_STATUSES = ["PENDING", "SCHEDULED", "FAILED"];

export default function AffiliateWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<AdminAffiliateWithdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewing, setViewing] = useState<AdminAffiliateWithdrawal | null>(null);
  const [confirmProcess, setConfirmProcess] = useState<AdminAffiliateWithdrawal | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.affiliate.getWithdrawals();
      setWithdrawals(result.items || []);
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Failed to fetch withdrawals"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runAction = async (label: string, action: () => Promise<unknown>) => {
    try {
      await action();
      await fetchData();
    } catch (requestError) {
      alert(`Failed to ${label}: ` + getErrorMessage(requestError, "Unknown error"));
    }
  };

  const handleView = async (item: AdminAffiliateWithdrawal) => {
    setViewing(item);
    try {
      const detail = await api.affiliate.getWithdrawal(item.id);
      if (detail) setViewing(detail);
    } catch (requestError) {
      console.error("Failed to load withdrawal detail", requestError);
    }
  };

  const openProcessConfirm = async (item: AdminAffiliateWithdrawal) => {
    setActionError(null);
    setAvailableBalance(null);
    setConfirmProcess(item);
    // Surface the employee's live wallet balance in the confirmation, to catch
    // a payout that would exceed what the employee actually has available.
    try {
      const employees = await api.affiliate.getEmployees();
      const match = (employees.items || []).find((employee) => employee.affiliateCode === item.employeeCode);
      setAvailableBalance(match ? match.walletAvailable : null);
    } catch (requestError) {
      console.error("Failed to load wallet balance", requestError);
    }
  };

  const handleConfirmProcess = async () => {
    if (!confirmProcess || isSubmitting) return;
    // Disable immediately so a double click cannot fire two payouts.
    setIsSubmitting(true);
    setActionError(null);
    try {
      await api.affiliate.processWithdrawal(confirmProcess.id);
      setConfirmProcess(null);
      await fetchData();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError, "Failed to process payout"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "employeeName",
      header: "Employee",
      render: (item: AdminAffiliateWithdrawal) => (
        <div>
          <span className="font-medium text-white block">{item.employeeName}</span>
          <span className="font-mono text-xs text-gray-400 block">{item.employeeCode}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: AdminAffiliateWithdrawal) => <span className="font-medium text-white">{formatCurrency(item.amount)}</span>,
    },
    { key: "requestedAt", header: "Requested Date", render: (item: AdminAffiliateWithdrawal) => <span>{formatDate(item.requestedAt)}</span> },
    { key: "payoutMethod", header: "Payout Method", render: (item: AdminAffiliateWithdrawal) => <span>{item.payoutMethod || "—"}</span> },
    { key: "status", header: "Status", render: (item: AdminAffiliateWithdrawal) => <StatusBadge status={item.status} /> },
    {
      key: "razorpayPayoutId",
      header: "Razorpay Payout ID",
      render: (item: AdminAffiliateWithdrawal) => <span className="font-mono text-xs">{item.razorpayPayoutId || "—"}</span>,
    },
  ];

  // DataTable renders one shared action menu, so the row actions self-filter by status.
  const actions: ActionItem<AdminAffiliateWithdrawal>[] = [
    { label: "View", icon: Eye, onClick: handleView },
    {
      label: "Approve",
      icon: CheckCircle2,
      onClick: (item) => {
        if (item.status !== "PENDING") {
          alert("Only a PENDING withdrawal can be approved.");
          return;
        }
        runAction("approve withdrawal", () => api.affiliate.approveWithdrawal(item.id));
      },
    },
    {
      label: "Process",
      icon: Send,
      onClick: (item) => {
        if (!PROCESSABLE_STATUSES.includes(item.status)) {
          alert("Only a PENDING or SCHEDULED withdrawal can be processed.");
          return;
        }
        openProcessConfirm(item);
      },
    },
    {
      label: "Retry",
      icon: RotateCcw,
      onClick: (item) => {
        if (item.status !== "FAILED") {
          alert("Only a FAILED withdrawal can be retried.");
          return;
        }
        runAction("retry withdrawal", () => api.affiliate.retryWithdrawal(item.id));
      },
    },
    {
      label: "Cancel",
      icon: Ban,
      variant: "destructive",
      onClick: (item) => {
        if (!CANCELLABLE_STATUSES.includes(item.status)) {
          alert("This withdrawal can no longer be cancelled.");
          return;
        }
        if (!confirm(`Cancel the ${formatCurrency(item.amount)} withdrawal for ${item.employeeName}?`)) return;
        runAction("cancel withdrawal", () => api.affiliate.cancelWithdrawal(item.id));
      },
    },
  ];

  const sumBy = (statuses: string[]) =>
    withdrawals.filter((item) => statuses.includes(item.status)).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      <Link href="/affiliate" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Sales &amp; Affiliate
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            Payout Management
          </h1>
          <p className="text-sm text-gray-400">Approve, process, and retry sales employee withdrawals.</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={String(withdrawals.length)} />
        <StatCard label="Awaiting Action" value={formatCurrency(sumBy(["PENDING", "SCHEDULED"]))} />
        <StatCard label="Processing" value={formatCurrency(sumBy(["PROCESSING"]))} />
        <StatCard label="Failed" value={formatCurrency(sumBy(["FAILED"]))} />
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">Error: {error}</div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading withdrawals...</div>
      ) : (
        <DataTable columns={columns} data={withdrawals} actions={actions} emptyMessage="No withdrawal requests found." />
      )}

      {/* Detail modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Withdrawal Detail</h2>
                <p className="text-sm text-gray-400">{viewing.employeeName}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Withdrawal ID", viewing.id],
                ["Employee Code", viewing.employeeCode],
                ["Amount", formatCurrency(viewing.amount)],
                ["Payout Method", viewing.payoutMethod || "—"],
                ["Requested", formatDate(viewing.requestedAt)],
                ["Processed", formatDate(viewing.processedAt)],
                ["Razorpay Payout ID", viewing.razorpayPayoutId || "—"],
                ["Failure Reason", viewing.failureReason || "—"],
              ].map(([label, value]) => (
                <div key={label} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-white font-medium break-all text-sm">{value}</p>
                </div>
              ))}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Status</p>
                <StatusBadge status={viewing.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process confirmation — guards against an accidental double payout */}
      {confirmProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Confirm Payout</h2>
                <p className="text-sm text-gray-400">
                  This sends real money to the employee&apos;s payout method. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {[
                ["Employee", `${confirmProcess.employeeName} (${confirmProcess.employeeCode})`],
                ["Amount", formatCurrency(confirmProcess.amount)],
                ["Payout Method", confirmProcess.payoutMethod || "—"],
                ["Available Wallet Balance", availableBalance === null ? "Unavailable" : formatCurrency(availableBalance)],
                ["Withdrawal ID", confirmProcess.id],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
                  <span className="text-sm font-medium text-white text-right break-all">{value}</span>
                </div>
              ))}
            </div>

            {availableBalance !== null && availableBalance < Number(confirmProcess.amount) && (
              <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                The requested amount exceeds the employee&apos;s available wallet balance. Verify before processing.
              </div>
            )}

            {actionError && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{actionError}</div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirmProcess}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Processing..." : "Confirm & Process Payout"}
              </button>
              <button
                onClick={() => setConfirmProcess(null)}
                disabled={isSubmitting}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-white/10 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
