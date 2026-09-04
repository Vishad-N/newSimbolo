"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "@/components/Sidebar";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { StickyRenewCard } from "@/components/ui/StickyRenewCard";
import { cn } from "@/utils/utils";
import { clientApi, redirectToLanding } from "@/services/api";
import { Bell, Search, Menu, User, LogOut } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const router = useRouter();
  const [profile, setProfile] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clientApi.profile.get().then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = (profile?.firstName?.[0] || profile?.email?.[0] || "C").toUpperCase();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      redirectToLanding("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white font-body">
      <Sidebar />
      
      <div 
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        )}
      >
        {/* Top Navbar */}
        <header className="h-16 bg-surface/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Global Search Mock */}
            <div className="hidden sm:flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all w-64 lg:w-96">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search projects, files, invoices..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500 text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/notifications")}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface"></span>
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-[0_0_10px_var(--primary-glow)]"
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-surface shadow-xl overflow-hidden z-40">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">
                      {profile ? `${profile.firstName} ${profile.lastName}`.trim() || "Client" : "Loading..."}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden relative">
          <SubscriptionGuard>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </SubscriptionGuard>
        </main>
      </div>

      {/* Global Sticky Notifications */}
      <StickyRenewCard />
    </div>
  );
}
