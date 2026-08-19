"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeIndianRupee, Eye, Power, PowerOff, RefreshCw, Settings2, Wallet } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { StatCard, StatusBadge, formatCurrency, getErrorMessage } from "@/components/affiliate/AffiliateShared";
import { api, type AffiliateEmployee, type AffiliateOverview } from "@/services/api";

export default function AffiliateOverviewPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<AffiliateOverview | null>(null);
  const [employees, setEmployees] = useState<AffiliateEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overviewData, employeeData] = await Promise.all([
        api.affiliate.getOverview(),
        api.affiliate.getEmployees(),
      ]);
      setOverview(overviewData);
      setEmployees(employeeData.items || []);
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Failed to fetch affiliate data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (employee: AffiliateEmployee) => {
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

  const columns = [
    {
      key: "name",
      header: "Employee",
      render: (item: AffiliateEmployee) => (
        <div>
          <span className="font-medium text-white block">{item.name}</span>
          <span className="text-xs text-gray-400 block">{item.email}</span>
        </div>
      ),
    },
    {
      key: "affiliateCode",
      header: "Employee Code",
      render: (item: AffiliateEmployee) => (
        <span className="font-mono text-xs text-primary">{item.affiliateCode}</span>
      ),
    },
    { key: "ordersCount", header: "Orders" },
    {
      key: "salesTotal",
      header: "Sales",
      render: (item: AffiliateEmployee) => <span className="text-white">{formatCurrency(item.salesTotal)}</span>,
    },
    {
      key: "commissionTotal",
      header: "Commission",
      render: (item: AffiliateEmployee) => <span className="text-white">{formatCurrency(item.commissionTotal)}</span>,
    },
    {
      key: "walletAvailable",
      header: "Available Wallet",
      render: (item: AffiliateEmployee) => <span>{formatCurrency(item.walletAvailable)}</span>,
    },
    {
      key: "walletPending",
      header: "Pending Withdrawal",
      render: (item: AffiliateEmployee) => <span>{formatCurrency(item.walletPending)}</span>,
    },
    {
      key: "lifetimeWithdrawn",
      header: "Lifetime Withdrawn",
      render: (item: AffiliateEmployee) => <span>{formatCurrency(item.lifetimeWithdrawn)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliateEmployee) => <StatusBadge status={item.status} />,
    },
  ];

  const actions = [
    {
      label: "View Detail",
      icon: Eye,
      onClick: (item: AffiliateEmployee) => router.push(`/affiliate/${item.id}`),
    },
    {
      label: "Activate",
      icon: Power,
      onClick: (item: AffiliateEmployee) => handleToggleStatus(item),
    },
    {
      label: "Deactivate",
      icon: PowerOff,
      variant: "destructive" as const,
      onClick: (item: AffiliateEmployee) => handleToggleStatus(item),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <BadgeIndianRupee className="w-6 h-6 text-primary" />
            Sales &amp; Affiliate
          </h1>
          <p className="text-sm text-gray-400">Sales employee performance, commissions, and wallet liability.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/affiliate/withdrawals"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            <Wallet className="w-4 h-4" />
            Payouts
          </Link>
          <Link
            href="/affiliate/settings"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sales" value={formatCurrency(overview?.totalSales)} />
        <StatCard label="Total Affiliate Sales" value={formatCurrency(overview?.totalAffiliateSales)} />
        <StatCard label="Active Sales Employees" value={String(overview?.activeEmployees ?? 0)} />
        <StatCard label="Total Commission" value={formatCurrency(overview?.totalCommission)} />
        <StatCard label="Pending Commission" value={formatCurrency(overview?.pendingCommission)} />
        <StatCard label="Available Wallet Liability" value={formatCurrency(overview?.availableWalletLiability)} />
        <StatCard label="Pending Withdrawals" value={formatCurrency(overview?.pendingWithdrawals)} />
        <StatCard label="Paid Withdrawals" value={formatCurrency(overview?.paidWithdrawals)} />
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">Error: {error}</div>
      ) : isLoading ? (
        <div className="p-12 flex justify-center text-gray-400">Loading sales employees...</div>
      ) : (
        <DataTable
          columns={columns}
          data={employees}
          actions={actions}
          emptyMessage="No sales employees found."
        />
      )}
    </div>
  );
}
