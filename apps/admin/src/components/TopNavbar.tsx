"use client";

import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/utils";
import { Bell, Menu, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  // Simple breadcrumb generator based on pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const title = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

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

        <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-white/10 mx-1"></div>

        <button className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-white/5 transition-colors border border-white/5">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium hidden sm:block">Admin</span>
        </button>
      </div>
    </header>
  );
}
