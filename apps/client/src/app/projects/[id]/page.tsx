"use client";

import { use, useEffect, useState } from "react";
import { mockApi } from "@/services/api";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { 
  FolderKanban, 
  Calendar, 
  Users, 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  FileText 
} from "lucide-react";
import { cn } from "@/utils/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks & Timeline", icon: CheckSquare },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "files", label: "Files & Deliverables", icon: FileText },
];

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    mockApi.projects.getById(resolvedParams.id).then(setProject);
  }, [resolvedParams.id]);

  if (!project) return <div className="text-white animate-pulse p-4">Loading workspace...</div>;

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-white">{project.name}</h1>
                <p className="text-sm text-gray-400">{project.service} Project</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="hidden sm:block text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {project.status}
              </span>
            </div>
            <div className="w-full md:w-48">
              <ProgressBar progress={project.progress} label="Progress" />
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar gap-2 mt-8 border-b border-white/10 pb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2",
                activeTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
              )}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-heading font-bold text-white mb-4">Project Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {project.description || "No description provided."}
              </p>
            </Card>
            
            <Card>
              <h3 className="text-lg font-heading font-bold text-white mb-4">Recent Updates</h3>
              <div className="text-center py-8 text-sm text-gray-500 border border-dashed border-white/10 rounded-xl">
                No recent updates.
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="space-y-4">
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-2">Details</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Start Date:</span>
                <span className="text-white ml-auto">Jun 1, 2026</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Est. Delivery:</span>
                <span className="text-white ml-auto">Sep 1, 2026</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Team Assigned:</span>
                <span className="text-white ml-auto">3 Members</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <Card>
          <div className="text-center py-16 space-y-4">
            <CheckSquare className="w-12 h-12 text-primary/50 mx-auto" />
            <h3 className="text-xl font-heading font-bold text-white">Task Pilot Integration Ready</h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              This section is designed to embed the Task Pilot UI in the future, providing granular task tracking and timeline visualization.
            </p>
          </div>
        </Card>
      )}

      {activeTab === "messages" && (
        <Card className="h-[500px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <MessageSquare className="w-12 h-12 text-primary/50 mx-auto" />
            <p className="text-gray-400 text-sm">Real-time messaging UI placeholder (Socket.io ready)</p>
          </div>
        </Card>
      )}

      {activeTab === "files" && (
        <Card className="h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <FileText className="w-12 h-12 text-primary/50 mx-auto" />
            <p className="text-gray-400 text-sm">File management and deliverables UI placeholder (Google Drive ready)</p>
          </div>
        </Card>
      )}
    </div>
  );
}
