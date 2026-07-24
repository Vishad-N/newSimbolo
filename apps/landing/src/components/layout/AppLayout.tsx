"use client";

import { useState, type ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-white flex flex-col">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative flex-1 lg:pl-[250px]">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
