"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/utils";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavbar />
      <main 
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          isSidebarOpen ? "pl-64" : "pl-20"
        )}
      >
        <div className="p-6 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
