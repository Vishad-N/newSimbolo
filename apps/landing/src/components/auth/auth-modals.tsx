"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, Lock, User, Building2, Loader2, CheckCircle2, X } from "lucide-react";
import { PhoneNumberFields } from "@/components/ui/PhoneNumberFields";
import { normalizeEmail, sanitizeNameInput, validatePersonName, validatePhone } from "@/lib/validation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";

interface AuthenticationTokens {
  accessToken: string;
  refreshToken: string;
  user?: { role?: string };
}

const redirectToDashboard = ({ accessToken, refreshToken, user }: AuthenticationTokens, next = "/dashboard") => {
  const callbackUrl = new URL("/auth/callback", DASHBOARD_URL);
  callbackUrl.searchParams.set("accessToken", accessToken);
  callbackUrl.searchParams.set("refreshToken", refreshToken);
  callbackUrl.searchParams.set("next", next);
  if (user?.role) callbackUrl.searchParams.set("role", user.role);
  window.location.replace(callbackUrl.toString());
};
export function AuthModals() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = searchParams.get("auth");

  const isOpen = auth === "login" || auth === "register";

  const closeModal = () => {
    // Preserve other search params if needed, or simply clear the auth param
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("auth");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  useEffect(() => {
    if (accessToken && refreshToken) {
      const checkoutPackage = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");

      const next = checkoutPackage
        ? `/checkout?package=${encodeURIComponent(checkoutPackage)}`
        : "/dashboard";
      redirectToDashboard({ accessToken, refreshToken }, next);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    // If the modal is triggered but they are already logged in
    if (isOpen) {
      const hasToken = document.cookie.includes("accessToken=");
      if (hasToken) {
        const checkoutPackage = searchParams.get("checkout");
        if (checkoutPackage) {
          window.location.href = `${DASHBOARD_URL}/checkout?package=${checkoutPackage}`;
        }
      }
    }
  }, [isOpen, searchParams]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[420px]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
          >
            {auth === "login" && <LoginModal onClose={closeModal} />}
            {auth === "register" && <RegisterModal onClose={closeModal} />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "forgot" | "forgot-sent">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingReset(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizeEmail(forgotEmail) }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(Array.isArray(payload.message) ? payload.message.join(" ") : payload.message || "Unable to send reset email.");
      }
      setMode("forgot-sent");
    } catch (forgotError) {
      setError(forgotError instanceof Error ? forgotError.message : "Unable to send reset email.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(String(formData.get("email") || "")),
          password: String(formData.get("password") || ""),
        }),
      });
      const payload = await response.json();
      const authentication = payload.data || payload;

      if (!response.ok || !authentication.accessToken || !authentication.refreshToken) {
        throw new Error(Array.isArray(payload.message) ? payload.message.join(" ") : payload.message || "Unable to sign in.");
      }

      const checkoutPackage = searchParams.get("checkout");
      const next = checkoutPackage
        ? `/checkout?package=${encodeURIComponent(checkoutPackage)}`
        : authentication.user?.role === "AFFILIATE"
        ? "/affiliate"
        : "/dashboard";
      redirectToDashboard(authentication, next);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
      setIsLoading(false);
    }
  };

  const switchToRegister = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", "register");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  if (mode === "forgot" || mode === "forgot-sent") {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#64748B] transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-[50px]" />

        <div className="relative z-10 text-center">
          {mode === "forgot-sent" ? (
            <>
              <h2 className="mb-2 text-2xl font-bold text-white">Check your email</h2>
              <p className="mb-8 text-sm text-[var(--muted)]">
                If an account exists for {forgotEmail}, we've sent a password reset link to it.
              </p>
              <button
                onClick={() => setMode("login")}
                className="text-sm font-semibold text-white hover:text-[var(--primary)] transition-colors"
              >
                Back to Sign In
              </button>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-2xl font-bold text-white">Reset your password</h2>
              <p className="mb-8 text-sm text-[var(--muted)]">Enter your email and we'll send you a reset link.</p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-left text-xs font-medium text-[var(--text-primary)]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--primary)] p-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-70"
                >
                  {isSendingReset ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>

              <button
                onClick={() => setMode("login")}
                className="mt-6 text-sm font-semibold text-white hover:text-[var(--primary)] transition-colors"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-[#64748B] transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Decorative mesh */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-[50px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[var(--secondary)]/20 blur-[50px]" />

      <div className="relative z-10 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">Welcome back</h2>
        <p className="mb-8 text-sm text-[var(--muted)]">Sign in to your Simbolo account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-left text-xs font-medium text-[var(--text-primary)]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--text-primary)]">Password</label>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("forgot");
                }}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 pb-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-white/[0.08] bg-white/[0.035] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0"
            />
            <label htmlFor="remember" className="text-xs text-[var(--muted)]">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--primary)] p-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_8px_20px_var(--primary-glow)] hover:shadow-[0_12px_24px_var(--primary-glow)]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-[var(--muted)]">Or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={() => {
            const checkoutPackage = searchParams.get("checkout");
            // The Google OAuth flow leaves this page entirely, so it can't rely on
            // localStorage surviving a round trip like the email/password flow does —
            // the checkout intent is passed through Google's own `state` param instead
            // (see GoogleAuthGuard.getAuthenticateOptions on the backend).
            const googleAuthUrl = checkoutPackage
              ? `${API_BASE_URL}/auth/google?checkout=${encodeURIComponent(checkoutPackage)}`
              : `${API_BASE_URL}/auth/google`;
            window.location.href = googleAuthUrl;
          }}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/5 p-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Don't have an account?{" "}
          <button onClick={switchToRegister} className="font-semibold text-white hover:text-[var(--primary)] transition-colors">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) score++;
    if (pass.match(/\d/)) score++;
    if (pass.match(/[^a-zA-Z\d]/)) score++;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const nextValue = name === "firstName" || name === "lastName" ? sanitizeNameInput(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : nextValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const firstNameError = validatePersonName(formData.firstName, "First name");
    const lastNameError = validatePersonName(formData.lastName, "Last name");
    const phoneError = validatePhone(formData.countryCode, formData.phone, false);
    const validationError = firstNameError || lastNameError || phoneError;
    if (validationError) {
      setError(validationError);
      return;
    }

    if (passwordStrength < 3) {
      setError("Please use a stronger password.");
      return;
    }

    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(formData.email),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          // The backend requires phone whenever countryCode is present, but this
          // form treats phone as optional — omit both together so an intentionally
          // blank phone doesn't turn into a validation error.
          ...(formData.phone ? { countryCode: formData.countryCode, phone: formData.phone } : {}),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(Array.isArray(payload.message) ? payload.message.join(" ") : payload.message || "Unable to register.");
      }

      // /auth/register only creates the account and sends a verification email — it
      // never returns tokens. Without logging in right here, the browser would be sent
      // to checkout (or the dashboard) with no session at all: payment creation would
      // 401, and the dashboard would show "locked" since no subscription could ever be
      // created. The backend allows login before email verification (only SUSPENDED/
      // INACTIVE accounts are blocked), so auto-login with the same credentials to
      // bridge real tokens through, exactly like the login flow does.
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(formData.email),
          password: formData.password,
        }),
      });
      const loginPayload = await loginResponse.json();
      const authentication = loginPayload.data || loginPayload;

      setIsLoading(false);
      setIsSuccess(true);

      const checkoutPackage = searchParams.get("checkout");
      const next = checkoutPackage ? `/checkout?package=${encodeURIComponent(checkoutPackage)}` : "/dashboard";

      setTimeout(() => {
        if (loginResponse.ok && authentication.accessToken && authentication.refreshToken) {
          redirectToDashboard(authentication, next);
        } else {
          // Auto-login failed unexpectedly (e.g. account got suspended between register
          // and login) — fall back to sending them to sign in manually instead of a
          // silently unauthenticated checkout/dashboard visit.
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("auth", "login");
          window.location.href = `?${newParams.toString()}`;
        }
      }, 1500);
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Unable to register.");
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", "login");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 text-center shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
        >
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold text-white">Registration Successful!</h2>
        <p className="text-sm text-[var(--muted)]">
          {searchParams.get("checkout") ? "Taking you to checkout..." : "Redirecting you to dashboard..."}
        </p>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar relative max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)]/90 p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-[#64748B] transition-colors hover:bg-white/10 hover:text-white z-20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Decorative mesh */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-[50px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[var(--secondary)]/20 blur-[50px]" />

      <div className="relative z-10">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Create an account</h2>
          <p className="text-sm text-[var(--muted)]">Join Simbolo to accelerate your marketing</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--text-primary)]">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                  placeholder="John"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--text-primary)]">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-primary)]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <PhoneNumberFields
            countryCode={formData.countryCode}
            phone={formData.phone}
            onCountryCodeChange={(countryCode) => setFormData((previous) => ({ ...previous, countryCode }))}
            onPhoneChange={(phone) => setFormData((previous) => ({ ...previous, phone }))}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-primary)]">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                type="text"
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-primary)]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Create a strong password"
              />
            </div>
            {formData.password && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= passwordStrength
                        ? passwordStrength <= 1
                          ? "bg-red-400"
                          : passwordStrength === 2
                          ? "bg-yellow-400"
                          : passwordStrength === 3
                          ? "bg-blue-400"
                          : "bg-green-400"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-primary)]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 pb-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/[0.08] bg-white/[0.035] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0"
            />
            <label htmlFor="acceptTerms" className="text-xs text-[var(--muted)]">
              I agree to the{" "}
              <Link href="/terms-and-conditions" target="_blank" className="text-[var(--primary)] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" target="_blank" className="text-[var(--primary)] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[var(--primary)] p-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_8px_20px_var(--primary-glow)] hover:shadow-[0_12px_24px_var(--primary-glow)]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-[var(--muted)]">Or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={() => {
            const checkoutPackage = searchParams.get("checkout");
            // The Google OAuth flow leaves this page entirely, so it can't rely on
            // localStorage surviving a round trip like the email/password flow does —
            // the checkout intent is passed through Google's own `state` param instead
            // (see GoogleAuthGuard.getAuthenticateOptions on the backend).
            const googleAuthUrl = checkoutPackage
              ? `${API_BASE_URL}/auth/google?checkout=${encodeURIComponent(checkoutPackage)}`
              : `${API_BASE_URL}/auth/google`;
            window.location.href = googleAuthUrl;
          }}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/5 p-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <button onClick={switchToLogin} type="button" className="font-semibold text-white hover:text-[var(--primary)] transition-colors">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
