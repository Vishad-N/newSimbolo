"use client";

import { Activity, Users, FileText, Briefcase, Eye, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/utils";

const stats = [
  { name: "Total Services", value: "8", icon: Briefcase, change: "+2 from last month" },
  { name: "Active Packages", value: "24", icon: FileText, change: "+4 from last month" },
  { name: "Portfolio Items", value: "45", icon: Eye, change: "+12 from last month" },
  { name: "Website Views", value: "12,450", icon: Users, change: "+14.5% from last month" },
];

const recentActivity = [
  { id: 1, action: "Updated Homepage Hero", user: "Admin", time: "2 hours ago" },
  { id: 2, action: "Added new SEO Package", user: "Admin", time: "5 hours ago" },
  { id: 3, action: "Published Portfolio Item: TechCorp", user: "Admin", time: "1 day ago" },
  { id: 4, action: "Updated Global SEO Settings", user: "Admin", time: "2 days ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Overview</h1>
          <p className="text-sm text-gray-400">Welcome back! Here's what's happening with your website today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
            View Website
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
            Create New Page
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-gray-400">{stat.name}</h3>
              </div>
              <p className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-primary/80 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative">
                {idx !== recentActivity.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-white/10" />
                )}
                <div className="relative z-10 w-6 h-6 rounded-full bg-white/10 border-2 border-[#0f172a] flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {activity.user}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              "Edit Homepage Hero",
              "Add New Package",
              "Upload to Media Library",
              "Update SEO Meta Tags"
            ].map((action, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group text-left"
              >
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{action}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
