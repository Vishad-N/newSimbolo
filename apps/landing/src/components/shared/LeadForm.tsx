"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/seo/SectionCard";
import { PhoneNumberFields } from "@/components/ui/PhoneNumberFields";
import { landingApi } from "@/lib/api";
import { normalizeEmail, sanitizeNameInput, validatePersonName, validatePhone } from "@/lib/validation";

type LeadFormExtraField = {
  id: string;
  label: string;
  type: "select" | "textarea";
  placeholder?: string;
  options?: string[];
};

type LeadFormProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  extraFields?: LeadFormExtraField[];
};

export function LeadForm({
  title = "Get Your Free Audit",
  description = "Submit your details and our expert will analyze your account & share a custom growth plan.",
  buttonText = "Get Free Audit",
  extraFields = [],
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const [firstNameRaw, ...rest] = sanitizeNameInput(name).trim().split(/\s+/);
    const firstName = firstNameRaw || "";
    const lastName = rest.join(" ") || firstName;

    const firstNameError = validatePersonName(firstName, "Name");
    const phoneError = validatePhone(countryCode, phone, true);
    if (firstNameError || phoneError) {
      setError(firstNameError || phoneError || "Please check your details.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const messageParts = [`Requested via "${title}" form.`];
      if (website.trim()) messageParts.push(`Website/Business: ${website.trim()}`);
      for (const field of extraFields) {
        if (extraValues[field.id]?.trim()) messageParts.push(`${field.label}: ${extraValues[field.id].trim()}`);
      }

      await landingApi.submitContactForm({
        firstName,
        lastName,
        email: normalizeEmail(email),
        countryCode,
        phone,
        company: website.trim() || undefined,
        message: messageParts.join(" "),
      });
      setIsSuccess(true);
    } catch (submitError) {
      console.error("Lead form submission error:", submitError);
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <SectionCard className="p-4">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-[var(--primary)]" />
          <h2 className="text-[1.08rem] font-semibold text-white">Request Received!</h2>
          <p className="text-[0.76rem] leading-5 text-white/72">
            Thank you for reaching out. Our team will get back to you shortly.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="p-4">
      <h2 className="text-[1.08rem] font-semibold text-white">{title}</h2>
      <p className="mt-3 text-[0.76rem] leading-5 text-white/72">{description}</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        {error && (
          <div className="rounded-[8px] border border-red-500/20 bg-red-500/10 p-2 text-[0.72rem] text-red-300">
            {error}
          </div>
        )}
        <input
          aria-label="Your Name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(sanitizeNameInput(e.target.value))}
          required
          className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--accent)]/60"
        />
        <input
          aria-label="Email Address"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--accent)]/60"
        />
        <PhoneNumberFields
          compact
          required
          countryCode={countryCode}
          phone={phone}
          onCountryCodeChange={setCountryCode}
          onPhoneChange={setPhone}
        />
        <input
          aria-label="Website or business"
          placeholder="Website / Business (Optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--accent)]/60"
        />
        {extraFields.map((field) =>
          field.type === "select" ? (
            <select
              key={field.id}
              aria-label={field.label}
              value={extraValues[field.id] ?? ""}
              onChange={(e) => setExtraValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
              className="h-10 w-full appearance-none rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--accent)]/60"
            >
              <option value="" disabled className="bg-[var(--surface)]">{field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option} className="bg-[var(--surface)]">{option}</option>
              ))}
            </select>
          ) : (
            <textarea
              key={field.id}
              aria-label={field.label}
              placeholder={field.placeholder || field.label}
              value={extraValues[field.id] ?? ""}
              onChange={(e) => setExtraValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
              className="h-24 w-full resize-none rounded-[8px] border border-white/10 bg-[var(--background)]/44 p-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--accent)]/60"
            />
          )
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] text-[0.86rem] font-heading font-semibold tracking-[0.2px] normal-case text-[#ffffff] transition hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)] disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {["VR", "AK", "NS", "DM", "RP"].map((avatar) => (
            <div key={avatar} className="grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--card)] bg-[var(--primary)] text-[0.62rem] font-black text-[#ffffff]">
              {avatar}
            </div>
          ))}
        </div>
        <p className="text-[0.72rem] font-semibold leading-4 text-white/78">Loved by 1,000+ business owners</p>
      </div>
    </SectionCard>
  );
}
