"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, AdminLoginResponse } from "@/services/api";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/utils";
import { Bell, Loader2, LogOut, Menu, Search, User, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const tokenStorageKey = "admin_token";
const refreshTokenStorageKey = "admin_refresh_token";
const userStorageKey = "admin_user";

export function TopNavbar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isApiLoginOpen, setIsApiLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiUser, setApiUser] = useState<AdminLoginResponse["user"] | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(userStorageKey);
    const storedToken = localStorage.getItem(tokenStorageKey);
    if (storedUser && storedToken) {
      try {
        setApiUser(JSON.parse(storedUser) as AdminLoginResponse["user"]);
      } catch {
        localStorage.removeItem(userStorageKey);
      }
    }
  }, []);

  // Simple breadcrumb generator based on pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const title = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

  const displayName = apiUser
    ? [apiUser.firstName, apiUser.lastName].filter(Boolean).join(" ").trim() || apiUser.email
    : "API Login";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.auth.login(form);
      localStorage.setItem(tokenStorageKey, response.accessToken);
      localStorage.setItem(refreshTokenStorageKey, response.refreshToken);
      localStorage.setItem(userStorageKey, JSON.stringify(response.user));
      setApiUser(response.user);
      setForm({ email: "", password: "" });
      setIsApiLoginOpen(false);
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Failed to sign in";
      setError(message.includes("401") ? "Invalid API email or password." : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(refreshTokenStorageKey);
    localStorage.removeItem(userStorageKey);
    setApiUser(null);
    router.refresh();
  };

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b border-white/5 transition-all duration-300 flex items-center justify-between px-4 sm:px-6",
        isSidebarOpen ? "left-64" : "left-20"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-heading font-semibold text-white">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-64 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="button"
          aria-expanded={isNotificationsOpen}
          aria-label="Notifications"
          onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
          className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>

        {isNotificationsOpen && (
          <div className="absolute right-20 top-14 w-72 rounded-xl border border-white/10 bg-[#0B0F19] p-4 shadow-2xl">
            <p className="font-medium text-white">Notifications</p>
            <p className="mt-2 text-sm text-gray-400">You have no new notifications.</p>
          </div>
        )}

        <div className="h-8 w-px bg-white/10 mx-1"></div>

        <button
          onClick={() => setIsApiLoginOpen(true)}
          className={cn(
            "flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-white/5 transition-colors border",
            apiUser ? "border-primary/30 text-white" : "border-yellow-500/30 text-yellow-100"
          )}
          title={apiUser ? `Signed in to API as ${displayName}` : "Sign in to backend API"}
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium hidden sm:block">{displayName}</span>
        </button>
      </div>

      {isApiLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Backend API Login</h2>
                <p className="mt-1 text-sm text-gray-400">Required for protected admin actions like managing clients.</p>
              </div>
              <button onClick={() => setIsApiLoginOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {apiUser ? (
              <div className="space-y-5">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="mt-1 font-medium text-white">{displayName}</p>
                  {apiUser.role && <p className="mt-1 text-xs text-primary">{apiUser.role}</p>}
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsApiLoginOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Close</button>
                  <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm text-gray-400">API Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                    placeholder="admin@simbolo.ai"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">API Password</label>
                  <input
                    required
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsApiLoginOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                  <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
