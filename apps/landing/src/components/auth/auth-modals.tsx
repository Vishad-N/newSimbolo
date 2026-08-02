"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, Lock, User, Phone, Building2, Loader2, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/client";
    }, 1500);
  };

  const switchToRegister = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", "register");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

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
              <button type="button" className="text-xs text-[var(--primary)] hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/client";
      }, 2000);
    }, 1500);
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
        <p className="text-sm text-[var(--muted)]">Redirecting you to dashboard...</p>
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

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-primary)]">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.035] p-3 pl-10 text-sm text-white placeholder:text-[#64748B] transition-colors focus:border-[var(--primary)] focus:bg-white/[0.05] focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

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
              <button type="button" className="text-[var(--primary)] hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-[var(--primary)] hover:underline">
                Privacy Policy
              </button>
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
