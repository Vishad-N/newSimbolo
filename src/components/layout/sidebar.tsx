"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/ui/brand-logo";
import { CrownIcon, DashboardIcon, exploreNav, growNav, marketingNav } from "@/data/landing";
import { cn } from "@/lib/utils";

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
};

function NavSection({ title, items }: { title: string; items: typeof exploreNav }) {
  const pathname = usePathname();

  return (
    <div className="border-t border-white/[0.08] pt-4 first:border-t-0">
      <h2 className="px-2 pb-2 text-[0.8rem] font-semibold uppercase tracking-[0.03em] text-[#94A3B8]">{title}</h2>
      <nav className="space-y-1.5">
        {items.map((item) => {
          const isServicesParent = item.label === "Services" && pathname.startsWith("/services");
          const isActive = isServicesParent || pathname === item.href || (item.href !== "/" && !item.href.includes("#") && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex h-9 items-center gap-3 rounded-[8px] px-3 text-[0.9rem] font-medium text-[#F8FAFC] transition",
                isActive
                  ? "border-l-[3px] border-l-[var(--primary)] bg-[var(--primary-glow)] text-[var(--primary-light)] shadow-[0_0_24px_var(--primary-glow)]"
                  : "hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--primary-light)]" : "text-[#94A3B8] group-hover:text-[var(--secondary)]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const dashboardActive = pathname === "/";

  return (
    <aside className="flex h-full w-[250px] flex-col border-r border-white/[0.08] bg-[#0B1120]/95 shadow-[20px_0_55px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="flex h-[100px] items-center px-5">
        <BrandLogo />
      </div>
      <div className="px-5">
        <Link
          href="/"
          className={cn(
            "mb-5 flex h-11 items-center gap-3 rounded-[9px] px-3 text-[0.95rem] font-bold text-white transition hover:bg-white/[0.06]",
            dashboardActive && "border-l-[3px] border-l-[var(--primary)] bg-[var(--primary-glow)] text-[var(--primary-light)]",
          )}
        >
          <DashboardIcon className={cn("h-5 w-5", dashboardActive ? "text-[var(--primary-light)]" : "text-[#94A3B8]")} />
          Dashboard
        </Link>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <NavSection title="Explore" items={exploreNav} />
        <NavSection title="Marketing" items={marketingNav} />
        <NavSection title="Grow" items={growNav} />
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-[8px] border border-white/[0.08] bg-[#111827] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
          <div className="mb-2 flex items-center gap-2 font-bold text-[#F8FAFC]">
            <CrownIcon className="h-5 w-5 fill-[#D97706] text-[#D97706]" />
            Go Pro
          </div>
          <p className="mb-4 text-[0.84rem] leading-5 text-[#94A3B8]">Unlock premium features and grow faster.</p>
          <button className="h-9 w-full rounded-[16px] bg-[var(--primary)] text-[0.88rem] font-extrabold text-white shadow-[0_10px_24px_var(--primary-glow)] transition duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)]">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      <button
        aria-label="Open navigation"
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-[8px] border border-white/[0.08] bg-[#0B1120]/90 text-white shadow-lg lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <SidebarContent />
      </div>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onToggle} />
      )}
      <motion.div
        initial={false}
        animate={{ x: open ? 0 : -270 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed inset-y-0 left-0 z-40 lg:hidden"
      >
        <SidebarContent />
      </motion.div>
    </>
  );
}
