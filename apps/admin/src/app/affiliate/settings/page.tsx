"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Save, Settings2 } from "lucide-react";
import { getErrorMessage } from "@/components/affiliate/AffiliateShared";
import { api, type AffiliateSettings } from "@/services/api";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const INITIAL_SETTINGS: AffiliateSettings = {
  defaultCommissionRate: 0,
  commissionCalculationBasis: "SUBTOTAL_AFTER_DISCOUNT",
  commissionHoldPeriodDays: 0,
  minimumWithdrawalAmount: 0,
  maximumWithdrawalAmount: 0,
  paydayFrequency: "WEEKLY",
  paydayDayOfWeek: 5,
  paydayCutoffTime: "18:00",
  payoutAutoProcessingEnabled: false,
  selfReferralAllowed: false,
};

export default function AffiliateSettingsPage() {
  const [settings, setSettings] = useState<AffiliateSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.affiliate
      .getSettings()
      .then((saved) => setSettings((current) => ({ ...current, ...saved })))
      .catch((requestError) => setError(getErrorMessage(requestError, "Failed to load affiliate settings")))
      .finally(() => setIsLoading(false));
  }, []);

  const update = <K extends keyof AffiliateSettings>(key: K, value: AffiliateSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      await api.affiliate.updateSettings(settings);
      setMessage("Affiliate settings saved successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Failed to save affiliate settings"));
    } finally {
      setIsSaving(false);
    }
  };

  const numberField = (
    label: string,
    key: keyof AffiliateSettings,
    hint?: string,
    step = "1",
  ) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <input
        type="number"
        step={step}
        value={String(settings[key] ?? "")}
        onChange={(e) => update(key, Number(e.target.value) as AffiliateSettings[typeof key])}
        className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );

  if (isLoading) {
    return <div className="p-12 flex justify-center text-gray-400">Loading affiliate settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/affiliate" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Sales &amp; Affiliate
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-primary" />
            Affiliate Settings
          </h1>
          <p className="text-sm text-gray-400">Commission rates, hold periods, withdrawal limits, and payout scheduling.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div>
      )}
      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>}

      {/* Commission */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-heading font-bold text-white">Commission</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {numberField("Default Commission Rate (%)", "defaultCommissionRate", "Applied when an employee has no override.", "0.01")}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Commission Calculation Basis</label>
            <select
              value={settings.commissionCalculationBasis}
              onChange={(e) => update("commissionCalculationBasis", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="SUBTOTAL">Subtotal (gross list price)</option>
              <option value="SUBTOTAL_AFTER_DISCOUNT">Subtotal After Discount</option>
              <option value="TAXABLE_AMOUNT">Taxable Amount (post-discount, pre-tax)</option>
              <option value="GRAND_TOTAL">Grand Total (incl. tax)</option>
            </select>
          </div>
          {numberField("Commission Hold Period (days)", "commissionHoldPeriodDays", "Days before a commission becomes eligible.")}
        </div>
      </div>

      {/* Withdrawals */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-heading font-bold text-white">Withdrawal Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {numberField("Minimum Withdrawal Amount (₹)", "minimumWithdrawalAmount")}
          {numberField("Maximum Withdrawal Amount (₹)", "maximumWithdrawalAmount")}
        </div>
      </div>

      {/* Payday scheduling */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-heading font-bold text-white">Payday Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Payday Frequency</label>
            <select
              value={settings.paydayFrequency}
              onChange={(e) => update("paydayFrequency", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Payday Day of Week</label>
            <select
              value={settings.paydayDayOfWeek}
              onChange={(e) => update("paydayDayOfWeek", Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
            >
              {DAYS_OF_WEEK.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Payday Cutoff Time</label>
            <input
              type="time"
              value={settings.paydayCutoffTime || ""}
              onChange={(e) => update("paydayCutoffTime", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Automation & policy */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-heading font-bold text-white">Automation &amp; Policy</h2>

        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-200 mb-1">Automatic Payout Processing</p>
              <p className="text-sm text-yellow-200/80 mb-4">
                When this is ON, approved withdrawals are sent to RazorpayX automatically on each payday — real money
                leaves the account with no further admin review. Leave it OFF to require a manual &quot;Process&quot;
                confirmation for every payout.
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payoutAutoProcessingEnabled}
                  onChange={(e) => update("payoutAutoProcessingEnabled", e.target.checked)}
                  className="h-4 w-4 accent-yellow-400"
                />
                <span className="text-sm font-medium text-white">
                  {settings.payoutAutoProcessingEnabled ? "Enabled — payouts fire automatically" : "Disabled — manual approval required"}
                </span>
              </label>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.selfReferralAllowed}
            onChange={(e) => update("selfReferralAllowed", e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          <div>
            <span className="text-sm font-medium text-white block">Allow Self-Referral</span>
            <span className="text-xs text-gray-400">
              Lets an employee earn commission on their own purchase.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
