"use client";

import Link from "next/link";
import { Link as LinkIcon, Users } from "lucide-react";

export function TeamManager() {
  return (
    <div className="rounded-xl border border-white/5 bg-surface p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Team Members</h3>
          <p className="text-sm text-gray-400">Managed centrally, with photo upload, in the Team Members module.</p>
        </div>
      </div>
      <Link
        href="/team-members"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <LinkIcon className="h-4 w-4" /> Manage Team Members
      </Link>
    </div>
  );
}
