"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { clientApi } from "@/services/api";
import { MessageSquare, Send, Loader2 } from "lucide-react";

const POLL_INTERVAL_MS = 5000;

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationTitle, setConversationTitle] = useState("Support");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clientApi.profile.get()
      .then((profile: any) => setUserId(profile?.id || null))
      .catch(console.error);

    clientApi.chat.getSupportConversation()
      .then(async (conversation: any) => {
        setConversationId(conversation.id);
        setConversationTitle(conversation.title || "Support");
        const initialMessages = await clientApi.chat.getMessages(conversation.id);
        setMessages(initialMessages.data || initialMessages || []);
        clientApi.chat.markAsRead(conversation.id).catch(() => {});
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your conversation right now. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => {
      clientApi.chat.getMessages(conversationId)
        .then((result: any) => setMessages(result.data || result || []))
        .catch(console.error);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !draft.trim() || isSending) return;

    const content = draft.trim();
    setDraft("");
    setIsSending(true);
    try {
      const sent = await clientApi.chat.sendMessage(conversationId, content);
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setDraft(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Messages
          </h1>
          <p className="text-sm text-gray-400">Chat directly with your account team.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        <div className="h-16 border-b border-white/10 flex items-center px-6 shrink-0 bg-black/20">
          <div className="font-medium text-white">{conversationTitle}</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-black/10">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-sm text-red-400 text-center">{error}</div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500 text-center">
              No messages yet. Say hello to your account team below.
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === userId || message.sender?.id === userId;
              return (
                <div key={message.id} className={`flex flex-col gap-2 max-w-[80%] ${isOwn ? "items-end self-end ml-auto" : "items-start"}`}>
                  {!isOwn && (
                    <span className="text-[10px] text-gray-500 ml-1">
                      {message.sender?.firstName} {message.sender?.lastName}
                    </span>
                  )}
                  <div className={
                    isOwn
                      ? "bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm shadow-[0_0_15px_var(--primary-glow)]"
                      : "bg-surface border border-white/10 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-gray-300"
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

        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20 shrink-0">
          <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!conversationId || isLoading}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!conversationId || !draft.trim() || isSending}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-[0_0_10px_var(--primary-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
