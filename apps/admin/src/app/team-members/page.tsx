"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Users, X, Save, GripVertical } from "lucide-react";
import { ImageUploader } from "@/components/forms/ImageUploader";

interface TeamMemberData {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  image?: string;
  socialLinks?: {
    linkedin?: string;
    email?: string;
  };
  isActive: boolean;
  displayOrder: number;
}

const mockMembers: TeamMemberData[] = [
  { id: "1", name: "Sophia Benett", designation: "CEO", bio: "Leading the team with vision.", image: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8fd4d2a3-a363-4658-d6ee-84790bc8f300/w=800", isActive: true, displayOrder: 1 },
  { id: "2", name: "Lucas Turner", designation: "CTO", bio: "Tech visionary.", image: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/20fd03c3-49d6-408c-3ac9-8c5a6ed2b500/w=800", isActive: true, displayOrder: 2 },
];

export default function TeamMembersManager() {
  const [data, setData] = useState<TeamMemberData[]>(mockMembers);
  const [isEditing, setIsEditing] = useState<TeamMemberData | null>(null);

  const columns = [
    {
      key: "drag",
      header: "",
      render: () => <GripVertical className="w-4 h-4 text-gray-500 cursor-grab active:cursor-grabbing" />
    },
    {
      key: "name",
      header: "Member",
      render: (item: TeamMemberData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-gray-400">{item.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-white text-sm">{item.name}</div>
            <div className="text-xs text-primary">{item.designation}</div>
          </div>
        </div>
      )
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: TeamMemberData) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {item.isActive ? "Active" : "Hidden"}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Team Members
          </h1>
          <p className="text-sm text-gray-400">Manage the company team members shown in the carousel.</p>
        </div>
        <button 
          onClick={() => setIsEditing({ id: Date.now().toString(), name: "", designation: "", bio: "", image: "", isActive: true, displayOrder: data.length + 1, socialLinks: {} })}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        onEdit={(item) => setIsEditing(item)}
        onDelete={(item) => setData(data.filter(d => d.id !== item.id))}
      />

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold text-white">
                {isEditing.name ? "Edit Team Member" : "New Team Member"}
              </h2>
              <button onClick={() => setIsEditing(null)} className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    value={isEditing.name}
                    onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Designation / Role</label>
                  <input 
                    type="text" 
                    value={isEditing.designation}
                    onChange={(e) => setIsEditing({ ...isEditing, designation: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">LinkedIn URL</label>
                  <input 
                    type="url" 
                    value={isEditing.socialLinks?.linkedin || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, socialLinks: { ...isEditing.socialLinks, linkedin: e.target.value } })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    value={isEditing.socialLinks?.email || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, socialLinks: { ...isEditing.socialLinks, email: e.target.value } })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="member@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Short Bio</label>
                <textarea 
                  value={isEditing.bio || ''}
                  onChange={(e) => setIsEditing({ ...isEditing, bio: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white min-h-[100px] resize-y focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="A brief introduction about this team member..."
                />
              </div>

              <ImageUploader 
                label="Member Photo (Recommended: Square aspect ratio)" 
                value={isEditing.image || ''}
                onChange={(url) => setIsEditing({ ...isEditing, image: url })}
                folder="team"
              />

              <label className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors">
                <input 
                  type="checkbox" 
                  checked={isEditing.isActive}
                  onChange={(e) => setIsEditing({ ...isEditing, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span className="text-sm font-medium text-white">Active (Visible on website)</span>
              </label>
            </div>
            
            <div className="sticky bottom-0 bg-surface/95 backdrop-blur z-10 border-t border-white/10 p-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditing(null)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const isExisting = data.find(d => d.id === isEditing.id);
                  if (isExisting) {
                    setData(data.map(d => d.id === isEditing.id ? isEditing : d));
                  } else {
                    setData([...data, isEditing]);
                  }
                  setIsEditing(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]"
              >
                <Save className="w-4 h-4" />
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
