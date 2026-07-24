"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { mockApi } from "@/services/api";
import { Video, Calendar, Users, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    mockApi.meetings.getAll().then(setMeetings);
  }, []);

  const upcomingMeetings = meetings.filter(m => m.status === "Upcoming");
  const pastMeetings = meetings.filter(m => m.status === "Past");

  const renderMeetingCard = (meeting: any) => (
    <Card key={meeting.id} className="p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group border border-white/10 relative overflow-hidden">
      {meeting.status === "Upcoming" && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
      )}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors">{meeting.title}</h3>
            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
              meeting.status === 'Upcoming' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {meeting.status}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(meeting.date).toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              {meeting.duration}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {meeting.attendees.join(", ")}
            </div>
          </div>
        </div>
        
        {meeting.joinUrl && meeting.status === "Upcoming" ? (
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-colors shadow-[0_0_15px_var(--primary-glow)] w-full md:w-auto justify-center">
            <Video className="w-4 h-4" /> Join Google Meet
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10 w-full md:w-auto justify-center">
            View Notes
          </button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Meetings
          </h1>
          <p className="text-sm text-gray-400">Schedule, join, and review your meetings with the Simbolo team.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <Calendar className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Upcoming</h2>
        {upcomingMeetings.length > 0 ? upcomingMeetings.map(renderMeetingCard) : (
          <div className="text-gray-500 text-sm py-4">No upcoming meetings scheduled.</div>
        )}
      </div>

      <div className="space-y-4 pt-6">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Past Meetings</h2>
        {pastMeetings.length > 0 ? pastMeetings.map(renderMeetingCard) : (
          <div className="text-gray-500 text-sm py-4">No past meetings found.</div>
        )}
      </div>
    </div>
  );
}
