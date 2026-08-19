"use client";

/**
 * Small presentation helpers shared by the admin affiliate pages.
 * Colors follow the existing status-pill pattern used in /leads, /blogs, /portfolio.
 */

const STATUS_STYLES: Record<string, string> = {
  // Affiliate profile
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
  // Commission
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ELIGIBLE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CREDITED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REVERSED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  // Withdrawal
  SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PROCESSING: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  // Payout method
  VERIFIED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DISABLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function StatusBadge({ status }: { status?: string }) {
  const style =
    STATUS_STYLES[(status || "").toUpperCase()] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${style}`}>
      {status || "Unknown"}
    </span>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col">
      <span className="text-sm text-gray-400 mb-1">{label}</span>
      <span className="text-2xl font-bold text-white break-words">{value}</span>
      {hint && <span className="text-xs text-gray-500 mt-1">{hint}</span>}
    </div>
  );
}

export const formatCurrency = (value?: number | null) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "—";

export const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;
