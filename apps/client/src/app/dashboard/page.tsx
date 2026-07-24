"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SubscriptionCard } from "@/components/ui/SubscriptionCard";
import { UpgradeCard } from "@/components/ui/UpgradeCard";
import { mockApi } from "@/services/api";
import { Briefcase, CheckCircle, Clock, Video, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    mockApi.stats.getDashboard().then(setStats);
    mockApi.projects.getAll().then(setProjects);
    mockApi.subscription.get().then(setSubscription);
  }, []);

  if (!stats) return <div className="text-white animate-pulse p-4">Loading dashboard...</div>;

  const statCards = [
    { label: "Active Projects", value: stats.activeProjects, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Pending Tasks", value: stats.pendingTasks, icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
    { label: "Invoices Due", value: stats.invoicesDue, icon: FileText, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Upcoming Meetings", value: stats.upcomingMeetings, icon: Video, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-surface to-black/40 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white">
            Welcome back, <span className="text-gradient">Client Name</span>!
          </h1>
          <p className="text-gray-400">Here's an overview of your workspace and active projects.</p>
        </div>
        <div className="relative z-10 flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors">
            Schedule Meeting
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_var(--primary-glow)]">
            New Project
          </button>
        </div>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 p-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <UpgradeCard subscription={subscription} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Active Projects */}
        <Card className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-heading font-bold text-white">Active Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {projects.slice(0, 2).map((project) => (
              <div key={project.id} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{project.service} • Est. {project.estDelivery}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {project.status}
                  </span>
                </div>
                <ProgressBar progress={project.progress} label="Overall Progress" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity / Tasks */}
        <Card className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-heading font-bold text-white">Recent Activity</h2>
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {/* Mock Timeline */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/20 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-primary">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              </div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm">Invoice Generated</span>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="text-xs text-gray-400">Invoice INV-2026-07-1 is ready.</div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/20 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-secondary">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
              </div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm">Task Completed</span>
                  <span className="text-xs text-gray-500">1d ago</span>
                </div>
                <div className="text-xs text-gray-400">Keyword Research has been finalized.</div>
              </div>
            </div>
          </div>
          
          <button className="w-full py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            View All Activity
          </button>
        </Card>

        {/* Subscription Snapshot */}
        <div className="xl:col-span-1">
          <SubscriptionCard subscription={subscription} compact={true} />
        </div>

      </div>
    </div>
  );
}
