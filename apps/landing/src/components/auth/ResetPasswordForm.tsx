"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 text-center shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <h2 className="mb-2 text-2xl font-bold text-white">Invalid reset link</h2>
        <p className="text-sm text-[var(--muted)]">
          This password reset link is missing its token. Please request a new one from the sign-in form.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 text-center shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[var(--primary)]" />
        <h2 className="mb-2 text-2xl font-bold text-white">Password reset</h2>
        <p className="mb-8 text-sm text-[var(--muted)]">Your password has been updated. You can now sign in.</p>
        <button
          onClick={() => router.push("/?auth=login")}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)]"
        >
          Go to Sign In
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(Array.isArray(payload.message) ? payload.message.join(" ") : payload.message || "Unable to reset password.");
      }
      setIsSuccess(true);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-[50px]" />

      <div className="relative z-10 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">Set a new password</h2>
        <p className="mb-8 text-sm text-[var(--muted)]">Choose a strong password for your account.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-left text-xs font-medium text-[var(--text-primary)]">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-left text-xs font-medium text-[var(--text-primary)]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--primary)] p-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
