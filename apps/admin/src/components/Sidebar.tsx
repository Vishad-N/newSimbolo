"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/utils/utils";
import { 
  LayoutDashboard, 
  Home, 
  Layers, 
  Search, 
  BarChart, 
  Megaphone, 
  Code, 
  Video, 
  PenTool, 
  ShoppingCart,
  Package,
  Briefcase,
  MessageSquare,
  HelpCircle,
  Cpu,
  Building,
  Navigation,
  Image as ImageIcon,
  Settings,
  Users,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Website Management",
    isGroup: true,
    items: [
      { name: "Homepage", href: "/homepage", icon: Home },
      { name: "Services Overview", href: "/services", icon: Layers },
      {
        name: "Individual Services",
        isCollapsible: true,
        items: [
          { name: "SEO", href: "/services/seo", icon: Search },
          { name: "Google Ads", href: "/services/google-ads", icon: BarChart },
          { name: "Meta Ads", href: "/services/meta-ads", icon: Megaphone },
          { name: "Website Development", href: "/services/web-dev", icon: Code },
          { name: "Video Editing", href: "/services/video-editing", icon: Video },
          { name: "Graphic Design", href: "/services/graphic-design", icon: PenTool },
          { name: "E-Commerce", href: "/services/ecommerce", icon: ShoppingCart },
        ],
      },
      { name: "Packages", href: "/packages", icon: Package },
      { name: "Portfolio", href: "/portfolio", icon: Briefcase },
      { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
      { name: "FAQs", href: "/faqs", icon: HelpCircle },
      { name: "Technology Stack", href: "/technologies", icon: Cpu },
      { name: "Industries", href: "/industries", icon: Building },
      { name: "Navigation", href: "/navigation", icon: Navigation },
    ]
  },
  { name: "Media Library", href: "/media", icon: ImageIcon },
  { name: "SEO Settings", href: "/seo", icon: Search },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { isSidebarOpen } = useUIStore();
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Individual Services": false
  });

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-white/5 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
        {isSidebarOpen ? (
          <span className="text-xl font-heading font-bold bg-primary-gradient bg-clip-text text-transparent">Simbolo CMS</span>
        ) : (
          <span className="text-xl font-heading font-bold text-primary mx-auto">S</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navigation.map((item, index) => {
          if (item.isGroup) {
            return (
              <div key={index} className="mb-4">
                {isSidebarOpen && (
                  <h3 className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-2 mt-4">
                    {item.name}
                  </h3>
                )}
                <div className="space-y-1">
                  {item.items?.map((subItem, subIndex) => {
                    if (subItem.isCollapsible) {
                      const isOpen = openGroups[subItem.name];
                      return (
                        <div key={subIndex}>
                          <button
                            onClick={() => toggleGroup(subItem.name)}
                            className={cn(
                              "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                              "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <span className="truncate flex-1 text-left">{isSidebarOpen ? subItem.name : "Services"}</span>
                            {isSidebarOpen && (
                              <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                            )}
                          </button>
                          {isOpen && isSidebarOpen && (
                            <div className="mt-1 space-y-1 pl-4">
                              {subItem.items?.map((nested, nestedIdx) => {
                                const Icon = nested.icon;
                                const isActive = pathname === nested.href;
                                return (
                                  <Link
                                    key={nestedIdx}
                                    href={nested.href}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                                      isActive 
                                        ? "bg-primary/10 text-primary" 
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                  >
                                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                                    <span className="truncate">{nested.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const Icon = subItem.icon!;
                    const isActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.href!}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-gray-400 hover:text-white hover:bg-white/5",
                          !isSidebarOpen && "justify-center px-0"
                        )}
                        title={!isSidebarOpen ? subItem.name : undefined}
                      >
                        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                        {isSidebarOpen && <span className="truncate">{subItem.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-400 hover:text-white hover:bg-white/5",
                !isSidebarOpen && "justify-center px-0"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
              {isSidebarOpen && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
