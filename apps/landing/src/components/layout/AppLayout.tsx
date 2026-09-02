"use client";

import { useState, Suspense, type ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthModals } from "@/components/auth/auth-modals";

interface AppLayoutProps {
  children: ReactNode;
  navigationData?: Record<string, any> | null;
}

export function AppLayout({ children, navigationData }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-white flex flex-col">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} navigationData={navigationData} />
      <main className="relative flex-1 lg:pl-[250px]">
        <Navbar />
        {children}
      </main>
      <Suspense fallback={null}>
        <AuthModals />
      </Suspense>
    </div>
  );
}
