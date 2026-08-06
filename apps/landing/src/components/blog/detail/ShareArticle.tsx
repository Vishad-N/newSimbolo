import { Globe, MessageCircle, Share2, Link as LinkIcon } from "lucide-react";

export function ShareArticle() {
  return (
    <div className="rounded-[16px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 backdrop-blur-md">
      <h4 className="font-heading text-[1rem] font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider text-center">Share Article</h4>
      <div className="flex justify-center gap-4">
        <button className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--muted)] hover:bg-blue-600 hover:text-white transition-colors">
          <Globe className="h-4 w-4" />
        </button>
        <button className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--muted)] hover:bg-blue-400 hover:text-white transition-colors">
          <MessageCircle className="h-4 w-4" />
        </button>
        <button className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--muted)] hover:bg-blue-700 hover:text-white transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
        <button className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--muted)] hover:bg-black/20 dark:hover:bg-white/20 hover:text-[var(--text-primary)] transition-colors">
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
