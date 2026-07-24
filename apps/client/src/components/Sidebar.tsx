"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/utils";
import Image from "next/image";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Layers, 
  ShoppingCart, 
  Receipt, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Video, 
  CheckSquare, 
  BarChart3, 
  LifeBuoy, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "My Projects", icon: FolderKanban },
  { href: "/services", label: "My Services", icon: Layers },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/tasks", label: "Task Progress", icon: CheckSquare },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/meetings", label: "Meetings", icon: Video },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

const billingNavItems = [
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

const accountNavItems = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/support", label: "Support", icon: LifeBuoy },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const NavLink = ({ href, label, icon: Icon }: any) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link 
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
        
        {/* Label (hidden when collapsed) */}
        <span className={cn(
          "transition-all duration-300 overflow-hidden whitespace-nowrap",
          sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
        )}>
          {label}
        </span>

        {/* Tooltip for collapsed state */}
        {!sidebarOpen && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-white/10 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 h-screen bg-surface border-r border-white/10 flex flex-col transition-all duration-300 z-40 overflow-visible",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0 relative">
        <Link href="/dashboard" className={cn("flex items-center gap-3 overflow-hidden w-full", !sidebarOpen && "justify-center")}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <Image src="/assets/logo1.png" alt="Simbolo Mascot" width={32} height={32} className="object-contain" />
          </div>
          {sidebarOpen && (
            <span className="text-white font-heading font-bold text-lg whitespace-nowrap">
              Simbolo <span className="font-light opacity-60">Client</span>
            </span>
          )}
        </Link>
        
        {/* Toggle Button (Floating outside the edge) */}
        <button 
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-5 w-6 h-6 bg-surface border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all hidden md:flex shadow-md z-50",
            !sidebarOpen && "rotate-180"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 flex flex-col gap-6 overflow-x-hidden">
        
        <div className="space-y-1">
          {sidebarOpen && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Workspace</div>}
          {mainNavItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>

        <div className="space-y-1">
          {sidebarOpen && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Billing</div>}
          {billingNavItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>

        <div className="space-y-1">
          {sidebarOpen && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</div>}
          {accountNavItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>

      </div>

      {/* Footer (Logout) */}
      <div className="p-4 border-t border-white/10 shrink-0 overflow-x-hidden">
        <button className={cn(
          "flex items-center gap-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors group",
          sidebarOpen ? "w-full px-3" : "justify-center w-12 h-12 mx-auto"
        )}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
