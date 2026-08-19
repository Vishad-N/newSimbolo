"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeIndianRupee,
  Check,
  Copy,
  Landmark,
  Loader2,
  Plus,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination, StatusBadge, formatCurrency, formatDate } from "@/components/affiliate/AffiliateBadges";
import {
  ApiRequestError,
  AuthenticationRedirectError,
  affiliateApi,
  type AffiliateCommission,
  type AffiliatePayoutMethod,
  type AffiliateProfile,
  type AffiliateSale,
  type AffiliateWallet,
  type AffiliateWalletTransaction,
  type AffiliateWithdrawal,
  type Paginated,
  type PayoutMethodType,
} from "@/services/api";

const PAGE_SIZE = 10;

type TabKey = "commissions" | "wallet" | "withdrawals" | "payout-methods";

const TABS: { key: TabKey; label: string }[] = [
  { key: "commissions", label: "Commission History" },
  { key: "wallet", label: "Wallet Ledger" },
  { key: "withdrawals", label: "Withdrawals" },
  { key: "payout-methods", label: "Payout Methods" },
];

const emptyPage = <T,>(): Paginated<T> => ({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE });

export default function AffiliateDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notEnrolled, setNotEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [wallet, setWallet] = useState<AffiliateWallet | null>(null);
  const [sales, setSales] = useState<Paginated<AffiliateSale>>(emptyPage<AffiliateSale>());

  const [activeTab, setActiveTab] = useState<TabKey>("commissions");
  const [copied, setCopied] = useState(false);

  const [commissions, setCommissions] = useState<Paginated<AffiliateCommission>>(emptyPage<AffiliateCommission>());
  const [commissionsPage, setCommissionsPage] = useState(1);

  const [ledger, setLedger] = useState<Paginated<AffiliateWalletTransaction>>(emptyPage<AffiliateWalletTransaction>());
  const [ledgerPage, setLedgerPage] = useState(1);

  const [withdrawals, setWithdrawals] = useState<Paginated<AffiliateWithdrawal>>(emptyPage<AffiliateWithdrawal>());
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);

  const [payoutMethods, setPayoutMethods] = useState<AffiliatePayoutMethod[]>([]);

  // Withdrawal modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  // Payout method form
  const [isMethodFormOpen, setIsMethodFormOpen] = useState(false);
  const [methodType, setMethodType] = useState<PayoutMethodType>("BANK_ACCOUNT");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);
  const [methodError, setMethodError] = useState("");
  const [isSavingMethod, setIsSavingMethod] = useState(false);

  const refreshWallet = useCallback(async () => {
    try {
      setWallet(await affiliateApi.getWallet());
    } catch (err) {
      console.error("Failed to load affiliate wallet", err);
    }
  }, []);

  const refreshWithdrawals = useCallback(async (page: number) => {
    try {
      setWithdrawals(await affiliateApi.getWithdrawals(page, PAGE_SIZE));
    } catch (err) {
      console.error("Failed to load withdrawals", err);
    }
  }, []);

  const refreshPayoutMethods = useCallback(async () => {
    try {
      setPayoutMethods(await affiliateApi.getPayoutMethods());
    } catch (err) {
      console.error("Failed to load payout methods", err);
    }
  }, []);

  // Initial load: the profile call decides whether the user is enrolled at all.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const affiliateProfile = await affiliateApi.getProfile();
        if (cancelled) return;
        setProfile(affiliateProfile);

        const [walletResult, salesResult, methodsResult] = await Promise.allSettled([
          affiliateApi.getWallet(),
          affiliateApi.getSales(1, PAGE_SIZE),
          affiliateApi.getPayoutMethods(),
        ]);
        if (cancelled) return;

        if (walletResult.status === "fulfilled") setWallet(walletResult.value);
        if (salesResult.status === "fulfilled") setSales(salesResult.value);
        if (methodsResult.status === "fulfilled") setPayoutMethods(methodsResult.value);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AuthenticationRedirectError) return;
        if (err instanceof ApiRequestError && err.status === 404) {
          setNotEnrolled(true);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load your affiliate dashboard.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Paged tables load once we know the user is enrolled.
  useEffect(() => {
    if (!profile) return;
    affiliateApi
      .getCommissions(commissionsPage, PAGE_SIZE)
      .then(setCommissions)
      .catch((err) => console.error("Failed to load commissions", err));
  }, [profile, commissionsPage]);

  useEffect(() => {
    if (!profile) return;
    affiliateApi
      .getWalletTransactions(ledgerPage, PAGE_SIZE)
      .then(setLedger)
      .catch((err) => console.error("Failed to load wallet ledger", err));
  }, [profile, ledgerPage]);

  useEffect(() => {
    if (!profile) return;
    refreshWithdrawals(withdrawalsPage);
  }, [profile, withdrawalsPage, refreshWithdrawals]);

  const handleCopyCode = async () => {
    if (!profile?.affiliateCode) return;
    try {
      await navigator.clipboard.writeText(profile.affiliateCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const openWithdrawModal = () => {
    setWithdrawAmount(String(wallet?.availableBalance ?? 0));
    setWithdrawError("");
    setIsWithdrawOpen(true);
  };

  const handleRequestWithdrawal = async () => {
    const amount = Number(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setWithdrawError("Enter a valid withdrawal amount.");
      return;
    }

    setIsSubmittingWithdrawal(true);
    setWithdrawError("");
    try {
      await affiliateApi.requestWithdrawal(amount);
      setIsWithdrawOpen(false);
      setActiveTab("withdrawals");
      setWithdrawalsPage(1);
      await Promise.all([refreshWallet(), refreshWithdrawals(1)]);
    } catch (err) {
      // Min/max/insufficient-balance copy comes straight from the backend message.
      setWithdrawError(err instanceof Error ? err.message : "Withdrawal request failed.");
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  const resetMethodForm = () => {
    setMethodType("BANK_ACCOUNT");
    setAccountNumber("");
    setIfsc("");
    setUpiId("");
    setMakeDefault(false);
    setMethodError("");
  };

  const handleAddPayoutMethod = async () => {
    setMethodError("");
    if (methodType === "BANK_ACCOUNT" && (!accountNumber.trim() || !ifsc.trim())) {
      setMethodError("Account number and IFSC are required.");
      return;
    }
    if (methodType === "UPI" && !upiId.trim()) {
      setMethodError("UPI ID is required.");
      return;
    }

    setIsSavingMethod(true);
    try {
      await affiliateApi.createPayoutMethod({
        type: methodType,
        ...(methodType === "BANK_ACCOUNT"
          ? { accountNumber: accountNumber.trim(), ifsc: ifsc.trim().toUpperCase() }
          : { upiId: upiId.trim() }),
        isDefault: makeDefault,
      });
      setIsMethodFormOpen(false);
      resetMethodForm();
      await refreshPayoutMethods();
    } catch (err) {
      setMethodError(err instanceof Error ? err.message : "Failed to add payout method.");
    } finally {
      setIsSavingMethod(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await affiliateApi.setDefaultPayoutMethod(id);
      await refreshPayoutMethods();
    } catch (err) {
      setMethodError(err instanceof Error ? err.message : "Failed to update payout method.");
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Remove this payout method?")) return;
    try {
      await affiliateApi.deletePayoutMethod(id);
      await refreshPayoutMethods();
    } catch (err) {
      setMethodError(err instanceof Error ? err.message : "Failed to remove payout method.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notEnrolled) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
          <BadgeIndianRupee className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-xl font-heading font-bold text-white mb-2">You&apos;re not enrolled as a sales affiliate</h1>
        <p className="text-sm text-gray-400">
          This area is only available to Simbolo sales employees and affiliate partners. If you believe this is a
          mistake, please contact your account manager.
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">Error: {error}</div>
    );
  }

  const pendingWithdrawalTotal = withdrawals.items
    .filter((item) => ["PENDING", "SCHEDULED", "PROCESSING"].includes(item.status))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalSales = sales.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const statCards = [
    { label: "Total Sales", value: formatCurrency(totalSales), hint: `${sales.total} attributed orders` },
    { label: "Total Orders", value: String(sales.total), hint: "Orders credited to your code" },
    { label: "Total Commission", value: formatCurrency(wallet?.lifetimeEarned), hint: "Lifetime earned" },
    { label: "Pending Commission", value: formatCurrency(wallet?.pendingBalance), hint: "Awaiting hold period" },
    { label: "Available Wallet", value: formatCurrency(wallet?.availableBalance), hint: "Ready to withdraw" },
    { label: "Pending Withdrawals", value: formatCurrency(pendingWithdrawalTotal), hint: "In progress" },
    { label: "Lifetime Withdrawn", value: formatCurrency(wallet?.lifetimeWithdrawn), hint: "Paid out to you" },
  ];

  const commissionColumns = [
    { key: "orderId", header: "Order", render: (item: AffiliateCommission) => <span className="text-white">{item.orderId}</span> },
    {
      key: "commissionAmount",
      header: "Commission",
      render: (item: AffiliateCommission) => <span className="font-medium text-white">{formatCurrency(item.commissionAmount)}</span>,
    },
    {
      key: "commissionRate",
      header: "Rate",
      render: (item: AffiliateCommission) => <span>{Number(item.commissionRate ?? 0)}%</span>,
    },
    { key: "status", header: "Status", render: (item: AffiliateCommission) => <StatusBadge status={item.status} /> },
    { key: "eligibleAt", header: "Eligible On", render: (item: AffiliateCommission) => <span>{formatDate(item.eligibleAt)}</span> },
    { key: "creditedAt", header: "Credited On", render: (item: AffiliateCommission) => <span>{formatDate(item.creditedAt)}</span> },
    { key: "createdAt", header: "Created", render: (item: AffiliateCommission) => <span>{formatDate(item.createdAt)}</span> },
  ];

  const ledgerColumns = [
    { key: "type", header: "Type", render: (item: AffiliateWalletTransaction) => <span className="text-white">{item.type}</span> },
    {
      key: "amount",
      header: "Amount",
      render: (item: AffiliateWalletTransaction) => (
        <span className={`font-medium ${Number(item.amount) < 0 ? "text-red-400" : "text-green-400"}`}>
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: "balanceAfter",
      header: "Balance After",
      render: (item: AffiliateWalletTransaction) => <span className="text-white">{formatCurrency(item.balanceAfter)}</span>,
    },
    { key: "description", header: "Description" },
    { key: "createdAt", header: "Date", render: (item: AffiliateWalletTransaction) => <span>{formatDate(item.createdAt)}</span> },
  ];

  const withdrawalColumns = [
    {
      key: "amount",
      header: "Amount",
      render: (item: AffiliateWithdrawal) => <span className="font-medium text-white">{formatCurrency(item.amount)}</span>,
    },
    { key: "status", header: "Status", render: (item: AffiliateWithdrawal) => <StatusBadge status={item.status} /> },
    { key: "requestedAt", header: "Requested", render: (item: AffiliateWithdrawal) => <span>{formatDate(item.requestedAt)}</span> },
    { key: "processedAt", header: "Processed", render: (item: AffiliateWithdrawal) => <span>{formatDate(item.processedAt)}</span> },
    {
      key: "failureReason",
      header: "Note",
      render: (item: AffiliateWithdrawal) => <span className="text-gray-400">{item.failureReason || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <BadgeIndianRupee className="w-6 h-6 text-primary" />
            Sales &amp; Commissions
          </h1>
          <p className="text-sm text-gray-400">Track the sales attributed to you, your commissions, and your payouts.</p>
        </div>
        <button
          onClick={openWithdrawModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-hover shadow-[0_0_15px_var(--primary-glow)]"
        >
          <Wallet className="w-4 h-4" />
          Request Withdrawal
        </button>
      </div>

      {/* Employee code */}
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Your Employee Code</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-heading font-bold text-primary">{profile?.affiliateCode}</span>
            <button
              onClick={handleCopyCode}
              title="Copy employee code"
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={profile?.status} />
          <span className="text-xs text-gray-400">Joined {formatDate(profile?.createdAt)}</span>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="flex flex-col justify-center p-6 space-y-1">
            <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            <div className="text-2xl font-heading font-bold text-white break-words">{stat.value}</div>
            <div className="text-gray-400 text-xs font-medium mt-1">{stat.hint}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto border-b border-white/10 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key ? "text-primary" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_var(--primary-glow)] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "commissions" && (
        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
          <DataTable columns={commissionColumns} data={commissions.items} />
          <Pagination
            page={commissions.page}
            pageSize={commissions.pageSize}
            total={commissions.total}
            onPageChange={setCommissionsPage}
          />
        </div>
      )}

      {activeTab === "wallet" && (
        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
          <DataTable columns={ledgerColumns} data={ledger.items} />
          <Pagination page={ledger.page} pageSize={ledger.pageSize} total={ledger.total} onPageChange={setLedgerPage} />
        </div>
      )}

      {activeTab === "withdrawals" && (
        <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
          <DataTable columns={withdrawalColumns} data={withdrawals.items} />
          <Pagination
            page={withdrawals.page}
            pageSize={withdrawals.pageSize}
            total={withdrawals.total}
            onPageChange={setWithdrawalsPage}
          />
        </div>
      )}

      {activeTab === "payout-methods" && (
        <Card className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Payout Methods</h2>
              <p className="text-xs text-gray-400">Withdrawals are sent to your default verified method.</p>
            </div>
            <button
              onClick={() => {
                resetMethodForm();
                setIsMethodFormOpen((open) => !open);
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
              Add Method
            </button>
          </div>

          {methodError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{methodError}</div>
          )}

          {isMethodFormOpen && (
            <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="radio"
                    name="payoutMethodType"
                    checked={methodType === "BANK_ACCOUNT"}
                    onChange={() => setMethodType("BANK_ACCOUNT")}
                    className="accent-[var(--primary)]"
                  />
                  Bank Account
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="radio"
                    name="payoutMethodType"
                    checked={methodType === "UPI"}
                    onChange={() => setMethodType("UPI")}
                    className="accent-[var(--primary)]"
                  />
                  UPI
                </label>
              </div>

              {methodType === "BANK_ACCOUNT" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-400">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="000123456789"
                      className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-400">IFSC</label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase().slice(0, 11))}
                      placeholder="HDFC0001234"
                      className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm uppercase text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@bank"
                    className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) => setMakeDefault(e.target.checked)}
                  className="accent-[var(--primary)]"
                />
                Set as default payout method
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleAddPayoutMethod}
                  disabled={isSavingMethod}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  {isSavingMethod && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Method
                </button>
                <button
                  onClick={() => {
                    setIsMethodFormOpen(false);
                    resetMethodForm();
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {payoutMethods.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">No payout methods added yet.</p>
            )}
            {payoutMethods.map((method) => (
              <div
                key={method.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">
                        {method.type === "BANK_ACCOUNT" ? "Bank Account" : "UPI"}
                      </span>
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
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      title="Set as default"
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Star className="h-3.5 w-3.5" /> Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    title="Remove payout method"
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Withdrawal modal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Request Withdrawal</h2>
                <p className="text-sm text-gray-400">
                  Available balance: <span className="text-white">{formatCurrency(wallet?.availableBalance)}</span>
                </p>
              </div>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <label className="mb-1.5 block text-xs font-medium text-gray-400">Amount (₹)</label>
            <input
              type="number"
              min={0}
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                if (withdrawError) setWithdrawError("");
              }}
              className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => setWithdrawAmount(String(wallet?.availableBalance ?? 0))}
              className="mt-2 text-xs font-medium text-primary hover:underline"
            >
              Withdraw full balance
            </button>

            {withdrawError && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {withdrawError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleRequestWithdrawal}
                disabled={isSubmittingWithdrawal}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                {isSubmittingWithdrawal && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Request
              </button>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
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
