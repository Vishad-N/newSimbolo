"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeIndianRupee, Eye, Power, PowerOff, RefreshCw, Settings2, UserPlus, Wallet, X } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { StatCard, StatusBadge, formatCurrency, getErrorMessage } from "@/components/affiliate/AffiliateShared";
import {
  api,
  type AdminUserSearchResult,
  type AffiliateEmployee,
  type AffiliateOverview,
} from "@/services/api";

export default function AffiliateOverviewPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<AffiliateOverview | null>(null);
  const [employees, setEmployees] = useState<AffiliateEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create-employee modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<AdminUserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserSearchResult | null>(null);
  const [commissionRateInput, setCommissionRateInput] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const openCreateModal = () => {
    setUserQuery("");
    setUserResults([]);
    setSelectedUser(null);
    setCommissionRateInput("");
    setCreateError(null);
    setIsCreateOpen(true);
  };

  // Debounced user search — mirrors the backend's own `userId`-required contract:
  // an employee is always created FROM an existing user, never from raw name/email
  // fields typed here, so this search is only ever a picker.
  useEffect(() => {
    if (!isCreateOpen || selectedUser) return;
    if (userQuery.trim().length < 2) {
      setUserResults([]);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await api.affiliate.searchUsers(userQuery);
        if (!cancelled) setUserResults(results);
      } catch (requestError) {
        if (!cancelled) setCreateError(getErrorMessage(requestError, "User search failed"));
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userQuery, isCreateOpen, selectedUser]);

  const handleCreateEmployee = async () => {
    if (!selectedUser) {
      setCreateError("Select a user to enroll as a sales employee.");
      return;
    }
    const rate = commissionRateInput.trim() === "" ? undefined : Number(commissionRateInput);
    if (rate !== undefined && (!Number.isFinite(rate) || rate < 0 || rate > 100)) {
      setCreateError("Commission rate must be a number between 0 and 100.");
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    try {
      await api.affiliate.createEmployee({ userId: selectedUser.id, commissionRate: rate });
      setIsCreateOpen(false);
      await fetchData();
    } catch (requestError) {
      // Surfaces the backend's own message verbatim, e.g. "This user already has a
      // sales employee profile" — no need to re-derive that check client-side.
      setCreateError(getErrorMessage(requestError, "Failed to create sales employee"));
    } finally {
      setIsCreating(false);
    }
  };

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
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
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

      {/* Add Employee — enrolls an EXISTING user; the backend generates the code and wallet */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F19] border border-white/10 p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Add Sales Employee</h2>
                <p className="text-sm text-gray-400">
                  Search for an existing user account to enroll. A unique employee code and wallet are created
                  automatically.
                </p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">User (name or email)</label>
                {selectedUser ? (
                  <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(" ") || selectedUser.email}
                      </p>
                      <p className="text-xs text-gray-400">{selectedUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setUserQuery("");
                      }}
                      className="text-xs font-medium text-gray-400 hover:text-white"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      autoFocus
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
                    />
                    {userQuery.trim().length >= 2 && (
                      <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-black/20">
                        {isSearching ? (
                          <p className="p-3 text-sm text-gray-400">Searching...</p>
                        ) : userResults.length === 0 ? (
                          <p className="p-3 text-sm text-gray-400">No matching users found.</p>
                        ) : (
                          userResults.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => setSelectedUser(user)}
                              className="flex w-full flex-col items-start gap-0.5 border-b border-white/5 p-3 text-left transition-colors last:border-b-0 hover:bg-white/5"
                            >
                              <span className="text-sm font-medium text-white">
                                {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}
                              </span>
                              <span className="text-xs text-gray-400">
                                {user.email}
                                {user.role?.name ? ` · ${user.role.name}` : ""}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  Commission Rate Override (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={commissionRateInput}
                  onChange={(e) => setCommissionRateInput(e.target.value)}
                  placeholder="Leave blank to use the program default"
                  className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>

              {createError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                  {createError}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleCreateEmployee}
                  disabled={isCreating || !selectedUser}
                  className="flex flex-1 items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UserPlus className="w-4 h-4" />
                  {isCreating ? "Creating..." : "Create Employee"}
                </button>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
