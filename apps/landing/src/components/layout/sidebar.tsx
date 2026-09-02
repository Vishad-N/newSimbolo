"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SidebarMascotBubble, SidebarBackgroundDecoration } from "@/components/layout/SidebarMascotBubble";
import { CrownIcon, DashboardIcon, exploreNav, growNav, marketingNav } from "@/data/landing";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "@/utils/icon-mapper";
import type { NavItem } from "@/types/landing";

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
  navigationData?: Record<string, any> | null;
};

interface LiveNavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
}

function resolveNavItems(liveItems: LiveNavItem[] | undefined, fallback: NavItem[]): NavItem[] {
  if (!liveItems || liveItems.length === 0) return fallback;
  return liveItems.map((item) => ({
    label: item.label,
    href: item.href,
    // DynamicIcon (a lazy Lucide-name resolver, not a plain Lucide component)
    // still satisfies how every call site uses `.icon` — rendered as
    // `<item.icon className="..." />` — so this cast is safe.
    icon: ((props: { className?: string }) => <DynamicIcon name={item.iconName} {...props} />) as unknown as NavItem["icon"],
  }));
}

function NavSection({ title, items, onClose }: { title: string; items: typeof exploreNav; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="border-t border-white/[0.08] pt-4 first:border-t-0">
      <h2 className="px-2 pb-2 text-[0.8rem] font-semibold uppercase tracking-[0.03em] text-[var(--muted)]">{title}</h2>
      <nav className="space-y-1.5">
        {items.map((item) => {
          const isServicesParent = item.label === "Services" && pathname.startsWith("/services");
          const isActive = isServicesParent || pathname === item.href || (item.href !== "/" && !item.href.includes("#") && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex h-9 items-center gap-3 rounded-[8px] px-3 text-[0.9rem] font-medium text-[var(--text-primary)] transition",
                isActive
                  ? "border-l-[3px] border-l-[var(--primary)] bg-[var(--accent-glow)] text-[var(--accent)] shadow-[0_0_24px_var(--accent-glow)]"
                  : "hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--accent)]" : "text-[var(--muted)] group-hover:text-[var(--secondary)]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarContent({ onClose, navigationData }: { onClose?: () => void; navigationData?: Record<string, any> | null }) {
  const pathname = usePathname();
  const dashboardActive = pathname === "/";

  const exploreItems = resolveNavItems(navigationData?.exploreMenu, exploreNav);
  const marketingItems = resolveNavItems(navigationData?.marketingMenu, marketingNav);
  const growItems = resolveNavItems(navigationData?.growMenu, growNav);

  return (
    <aside className="font-sidebar flex h-full w-[250px] flex-col border-r border-white/[0.08] bg-[var(--sidebar)]/95 shadow-[20px_0_55px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="relative">
        <SidebarBackgroundDecoration />
        <div className="flex h-[100px] items-center justify-between px-5 relative z-10">
          <BrandLogo />
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <SidebarMascotBubble />
      </div>
      <div className="px-5">
        <Link
          href="/"
          onClick={onClose}
          className={cn(
            "mb-5 flex h-11 items-center gap-3 rounded-[9px] px-3 text-[0.95rem] font-bold text-white transition hover:bg-white/[0.06]",
            dashboardActive && "border-l-[3px] border-l-[var(--primary)] bg-[var(--accent-glow)] text-[var(--accent)]",
          )}
        >
          <DashboardIcon className={cn("h-5 w-5", dashboardActive ? "text-[var(--accent)]" : "text-[var(--muted)]")} />
          Dashboard
        </Link>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <NavSection title="Explore" items={exploreItems} onClose={onClose} />
        <NavSection title="Marketing" items={marketingItems} onClose={onClose} />
        <NavSection title="Grow" items={growItems} onClose={onClose} />
        
        <div className="border-t border-white/[0.08] pt-4">
          <Link
            href="/about-us"
            onClick={onClose}
            className={cn(
              "group flex h-9 items-center gap-3 rounded-[8px] px-3 text-[0.9rem] font-medium text-[var(--text-primary)] transition",
              pathname.startsWith("/about-us")
                ? "border-l-[3px] border-l-[var(--primary)] bg-[var(--accent-glow)] text-[var(--accent)] shadow-[0_0_24px_var(--accent-glow)]"
                : "hover:bg-white/[0.06] hover:text-white"
            )}
          >
            <Building2 className={cn("h-4 w-4 shrink-0", pathname.startsWith("/about-us") ? "text-[var(--accent)]" : "text-[var(--muted)] group-hover:text-[var(--secondary)]")} />
            <span>About Us</span>
          </Link>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-[8px] border border-white/[0.08] bg-[var(--surface)] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
          <div className="mb-2 flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <CrownIcon className="h-5 w-5 fill-amber-400 text-amber-400" />
            Go Pro
          </div>
          <p className="mb-4 text-[0.84rem] leading-5 text-[var(--muted)]">Unlock premium features and grow faster.</p>
          <Link href="/packages" className="block w-full">
            <button className="h-9 w-full rounded-[16px] bg-amber-400 text-[0.88rem] font-extrabold text-black transition duration-300 hover:bg-amber-500 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(251,191,36,0.25)] active:bg-amber-600">
              Upgrade Now
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function Sidebar({ open, onToggle, navigationData }: SidebarProps) {
  return (
    <>
      {!open && (
        <button
          aria-label="Open navigation"
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-[8px] border border-white/[0.08] bg-[var(--sidebar)]/90 text-white shadow-lg lg:hidden hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <SidebarContent navigationData={navigationData} />
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onToggle} />
            <motion.div
              initial={{ x: -270 }}
              animate={{ x: 0 }}
              exit={{ x: -270 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-40 lg:hidden"
            >
              <SidebarContent onClose={onToggle} navigationData={navigationData} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
