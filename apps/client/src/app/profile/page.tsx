"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/api";
import { User, Save, Building, Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    mockApi.profile.get().then(setProfile);
  }, []);

  if (!profile) return <div className="text-white animate-pulse p-4">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Company Profile
          </h1>
          <p className="text-sm text-gray-400">Manage your company information and contact details.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_var(--primary-glow)]">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
              {profile.logo && <Image src={profile.logo} alt="Company Logo" width={128} height={128} className="w-full h-full object-cover" />}
            </div>
            <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Change Logo
            </button>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Building className="w-4 h-4" /> Company Name</label>
                <input type="text" defaultValue={profile.companyName} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">GST Number</label>
                <input type="text" defaultValue={profile.gst} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Primary Email</label>
                <input type="email" defaultValue={profile.email} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</label>
                <input type="tel" defaultValue={profile.phone} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Billing Address</label>
                <textarea defaultValue={profile.address} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
