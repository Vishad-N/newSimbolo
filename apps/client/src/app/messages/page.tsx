"use client";

import { Card } from "@/components/ui/Card";
import { MessageSquare, Paperclip, Send, Smile } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Messages
          </h1>
          <p className="text-sm text-gray-400">Communicate directly with your dedicated project team.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
        {/* Contacts Sidebar */}
        <Card className="hidden md:block col-span-1 overflow-y-auto custom-scrollbar p-0">
          <div className="p-4 border-b border-white/10 font-medium text-white">Recent Conversations</div>
          <div className="divide-y divide-white/5">
            <div className="p-4 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors border-l-2 border-primary">
              <div className="font-medium text-white text-sm">FitLife Project Team</div>
              <div className="text-xs text-gray-400 truncate mt-1">Sure, we will update the copy today.</div>
            </div>
            <div className="p-4 cursor-pointer hover:bg-white/[0.05] transition-colors border-l-2 border-transparent">
              <div className="font-medium text-white text-sm">Glow Design Team</div>
              <div className="text-xs text-gray-400 truncate mt-1">Here is the link to the Figma file.</div>
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-1 md:col-span-3 flex flex-col p-0 overflow-hidden">
          {/* Chat Header */}
          <div className="h-16 border-b border-white/10 flex items-center px-6 shrink-0 bg-black/20">
            <div className="font-medium text-white">FitLife Project Team</div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-black/10">
            <div className="flex flex-col gap-2 max-w-[80%] items-start">
              <div className="bg-surface border border-white/10 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-gray-300">
                Hi! We have completed the keyword research phase. I'm attaching the report below.
              </div>
              <span className="text-[10px] text-gray-500 ml-1">10:42 AM</span>
            </div>

            <div className="flex flex-col gap-2 max-w-[80%] items-end self-end ml-auto">
              <div className="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm shadow-[0_0_15px_var(--primary-glow)]">
                Looks great! Can we schedule a quick call to discuss the top priorities?
              </div>
              <span className="text-[10px] text-gray-500 mr-1">11:05 AM</span>
            </div>
            
            <div className="flex flex-col gap-2 max-w-[80%] items-start">
              <div className="bg-surface border border-white/10 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-gray-300">
                Absolutely. I will send a calendar invite shortly.
              </div>
              <span className="text-[10px] text-gray-500 ml-1">11:08 AM</span>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
            <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2"
              />
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-[0_0_10px_var(--primary-glow)]">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
