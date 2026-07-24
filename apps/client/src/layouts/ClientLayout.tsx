"use client";

import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "@/components/Sidebar";
import { StickyRenewCard } from "@/components/ui/StickyRenewCard";
import { cn } from "@/utils/utils";
import { Bell, Search, Menu } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

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
            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-[0_0_10px_var(--primary-glow)]">
              C
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Global Sticky Notifications */}
      <StickyRenewCard />
    </div>
  );
}
