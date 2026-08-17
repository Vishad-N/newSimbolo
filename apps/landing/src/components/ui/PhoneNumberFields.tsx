"use client";

import { useState } from "react";

interface PhoneNumberFieldsProps {
  countryCode?: string;
  phone?: string;
  onCountryCodeChange?: (value: string) => void;
  onPhoneChange?: (value: string) => void;
  required?: boolean;
  compact?: boolean;
}

export function normalizeCountryCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 3);
  return digits ? `+${digits}` : "";
}

export function normalizeLocalPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function PhoneNumberFields({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  required = false,
  compact = false,
}: PhoneNumberFieldsProps) {
  const [internalCountryCode, setInternalCountryCode] = useState("+91");
  const [internalPhone, setInternalPhone] = useState("");
  const resolvedCountryCode = countryCode ?? internalCountryCode;
  const resolvedPhone = phone ?? internalPhone;
  const inputClassName = compact
    ? "h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--accent)]/60"
    : "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white placeholder-white/30 transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50";

  const updateCountryCode = (value: string) => {
    const normalized = normalizeCountryCode(value);
    setInternalCountryCode(normalized);
    onCountryCodeChange?.(normalized);
  };

  const updatePhone = (value: string) => {
    const normalized = normalizeLocalPhone(value);
    setInternalPhone(normalized);
    onPhoneChange?.(normalized);
  };

  return (
    <div className={compact ? "grid grid-cols-[5.25rem_minmax(0,1fr)] gap-2" : "space-y-2"}>
      {!compact && (
        <label className="text-sm font-medium text-white/80">
          Phone Number{required ? " *" : " (Optional)"}
        </label>
      )}
      <div className={compact ? "contents" : "grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2"}>
        <input
          aria-label="Country code"
          type="tel"
          inputMode="tel"
          value={resolvedCountryCode}
          onChange={(event) => updateCountryCode(event.target.value)}
          className={inputClassName}
          placeholder="+91"
          pattern="\+[1-9][0-9]{0,2}"
          maxLength={4}
          required={required}
        />
        <input
          aria-label="10-digit phone number"
          type="tel"
          inputMode="numeric"
          value={resolvedPhone}
          onChange={(event) => updatePhone(event.target.value)}
          className={inputClassName}
          placeholder="9876543210"
          pattern="[0-9]{10}"
          minLength={10}
          maxLength={10}
          required={required}
        />
      </div>
      {!compact && <p className="text-xs text-[var(--muted)]">Enter exactly 10 digits; the country code is separate.</p>}
    </div>
  );
}
