import Link from "next/link";
import { LayoutDashboard, Video, Settings, ChevronRight, Palette } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[var(--surface)] p-6">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] font-bold text-black">
            S
          </div>
          <span className="text-[1.2rem] font-black text-white tracking-wide">Admin</span>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[0.9rem] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <div className="pt-4 pb-2">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-white/40">Services</span>
          </div>

          <div className="space-y-1 mt-4">
            <button className="flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-[0.9rem] font-medium text-white/60 transition hover:bg-white/5 hover:text-white">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5" />
                Video Editing
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="ml-6 flex flex-col space-y-1 border-l border-white/10 pl-4">
              <Link
                href="/admin/video-editing/services"
                className="rounded-[6px] px-2 py-1.5 text-[0.85rem] font-medium text-[var(--accent)] bg-[var(--accent)]/10"
              >
                Editing Services
              </Link>
            </div>
          </div>

          <div className="space-y-1">
            <button className="flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-[0.9rem] font-medium text-white/60 transition hover:bg-white/5 hover:text-white">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5" />
                Graphic Design
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="ml-6 flex flex-col space-y-1 border-l border-white/10 pl-4">
              <Link
                href="/admin/graphic-design/categories"
                className="rounded-[6px] px-2 py-1.5 text-[0.85rem] font-medium text-[var(--accent)] bg-[var(--accent)]/10"
              >
                Design Categories
              </Link>
            </div>
          </div>

          <Link
            href="/admin/packages"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[0.9rem] font-medium text-white/60 transition hover:bg-white/5 hover:text-white mt-2"
          >
            <LayoutDashboard className="h-5 w-5" />
            Packages Setup
          </Link>

          <div className="pt-4 pb-2">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-white/40">Content</span>
          </div>
          
          <Link
            href="/admin/blogs"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[0.9rem] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5" /> {/* Consider importing FileText or BookOpen later */}
            Blogs
          </Link>
        </nav>

        <div className="mt-auto pt-10">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[0.85rem] font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
