"use client";

import { Settings, Shield, Bell, Moon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Workspace Settings
        </h1>
        <p className="text-sm text-gray-400">Configure your preferences and security settings.</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-gray-400" /> Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">Dark Mode</div>
                <div className="text-sm text-gray-400">The dashboard is currently permanently dark mode to match our premium feel.</div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" /> Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">Email Notifications</div>
                <div className="text-sm text-gray-400">Receive an email when an invoice or report is generated.</div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">SMS Alerts</div>
                <div className="text-sm text-gray-400">Receive critical alerts (like payment failures) via SMS.</div>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-gray-400 rounded-full absolute left-1 top-1"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-heading font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" /> Security
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-white">Password</div>
                <div className="text-sm text-gray-400">Last changed 3 months ago.</div>
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                Change Password
              </button>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div>
                <div className="font-medium text-white">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400">Add an extra layer of security to your account.</div>
              </div>
              <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors border border-primary/20">
                Enable 2FA
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
