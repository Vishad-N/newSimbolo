"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/api";
import { Bell, CheckCircle, FileText, CheckSquare, AlertTriangle, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    mockApi.notifications.getAll().then(setNotifications);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'report': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'project': return <CheckSquare className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notifications
          </h1>
          <p className="text-sm text-gray-400">Stay updated on your projects, reports, and billing.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <CheckCircle className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <Card className="p-0 overflow-hidden divide-y divide-white/10">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}
          >
            <div className={`p-2 rounded-lg mt-1 shrink-0 ${notif.unread ? 'bg-white/10' : 'bg-black/40'}`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm ${notif.unread ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
                  {notif.title}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notif.time}</span>
              </div>
              <p className="text-sm text-gray-400">{notif.message}</p>
            </div>
            {notif.unread && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
