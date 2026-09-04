"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { Inbox, Send, Loader2, RefreshCw } from "lucide-react";

interface ParticipantUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

interface Conversation {
  id: string;
  title?: string | null;
  updatedAt: string;
  participants: { userId: string; user: ParticipantUser }[];
  messages?: { content: string; createdAt: string; sender?: { firstName: string; lastName: string } }[];
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender?: ParticipantUser;
}

const POLL_INTERVAL_MS = 5000;

function participantNames(conversation: Conversation, excludeUserId?: string) {
  return conversation.participants
    .filter((p) => p.userId !== excludeUserId)
    .map((p) => `${p.user.firstName} ${p.user.lastName}`.trim())
    .join(", ") || "Support";
}

export default function AdminMessagesPage() {
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = () => {
    setIsLoadingList(true);
    setListError(null);
    api.chat.getSupportConversations()
      .then((res: any) => setConversations(res?.data || res || []))
      .catch((err) => {
        console.error(err);
        setListError(err instanceof Error ? err.message : "Failed to load conversations");
      })
      .finally(() => setIsLoadingList(false));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_user");
      if (stored) setAdminUserId(JSON.parse(stored)?.id || null);
    } catch {
      // ignore
    }
    loadConversations();
  }, []);

  const openConversation = async (conversation: Conversation) => {
    setActiveId(conversation.id);
    setIsLoadingThread(true);
    try {
      // Joining is idempotent server-side (upsert) — safe to call every time an
      // admin not already a participant opens a thread from the shared inbox.
      await api.chat.join(conversation.id);
      const result: any = await api.chat.getMessages(conversation.id);
      setMessages(result?.data || result || []);
      await api.chat.markAsRead(conversation.id);
    } catch (err) {
      console.error("Failed to open conversation:", err);
    } finally {
      setIsLoadingThread(false);
    }
  };

  useEffect(() => {
    if (!activeId) return;
    const interval = setInterval(() => {
      api.chat.getMessages(activeId)
        .then((result: any) => setMessages(result?.data || result || []))
        .catch(console.error);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !draft.trim() || isSending) return;

    const content = draft.trim();
    setDraft("");
    setIsSending(true);
    try {
      const sent: any = await api.chat.sendMessage(activeId, content);
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setDraft(content);
    } finally {
      setIsSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            Client Messages
          </h1>
          <p className="text-sm text-gray-400">Every client support conversation, across all account managers.</p>
        </div>
        <button onClick={loadConversations} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
          <RefreshCw className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 min-h-0">
        <div className="glass-card rounded-xl md:col-span-1 overflow-y-auto">
          <div className="p-4 border-b border-white/10 font-medium text-white">Conversations</div>
          {isLoadingList ? (
            <div className="p-6 flex justify-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : listError ? (
            <div className="p-4 text-sm text-red-400">{listError}</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No client conversations yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {conversations.map((conversation) => {
                const lastMessage = conversation.messages?.[0];
                return (
                  <button
                    key={conversation.id}
                    onClick={() => openConversation(conversation)}
                    className={`w-full text-left p-4 transition-colors border-l-2 ${
                      activeId === conversation.id ? "bg-white/[0.04] border-primary" : "border-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="font-medium text-white text-sm truncate">{participantNames(conversation)}</div>
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {lastMessage ? lastMessage.content : "No messages yet"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card rounded-xl md:col-span-3 flex flex-col overflow-hidden">
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              Select a conversation to view messages
            </div>
          ) : (
            <>
              <div className="h-16 border-b border-white/10 flex items-center px-6 shrink-0">
                <div className="font-medium text-white">{participantNames(activeConversation, adminUserId || undefined)}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingThread ? (
                  <div className="flex h-full items-center justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">No messages yet.</div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === adminUserId;
                    return (
                      <div key={message.id} className={`flex flex-col gap-2 max-w-[80%] ${isOwn ? "items-end self-end ml-auto" : "items-start"}`}>
                        {!isOwn && (
                          <span className="text-[10px] text-gray-500 ml-1">
                            {message.sender?.firstName} {message.sender?.lastName}
                          </span>
                        )}
                        <div className={
                          isOwn
                            ? "bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm"
                            : "bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-gray-300"
                        }>
                          {message.content}
                        </div>
                        <span className={`text-[10px] text-gray-500 ${isOwn ? "mr-1" : "ml-1"}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || isSending}
                    className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
