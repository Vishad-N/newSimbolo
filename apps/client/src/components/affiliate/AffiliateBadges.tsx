"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Status pill matching the existing badge pattern used across the client app
 * (see the payment/invoice status cells in `app/payments/page.tsx`).
 */
const STATUS_STYLES: Record<string, string> = {
  // Commission statuses
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ELIGIBLE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CREDITED: "bg-green-500/10 text-green-400 border-green-500/20",
  REVERSED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  // Withdrawal statuses
  SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PROCESSING: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  PAID: "bg-green-500/10 text-green-400 border-green-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  // Affiliate / payout-method statuses
  ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
  VERIFIED: "bg-green-500/10 text-green-400 border-green-500/20",
  DISABLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function StatusBadge({ status }: { status?: string }) {
  const key = (status || "").toUpperCase();
  const style = STATUS_STYLES[key] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${style}`}>
      {status || "Unknown"}
    </span>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="px-4 py-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
      <span>
        Showing {from} to {to} of {total} entries
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="p-1 rounded hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="p-1 rounded hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export const formatCurrency = (value?: number | null) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "—";
