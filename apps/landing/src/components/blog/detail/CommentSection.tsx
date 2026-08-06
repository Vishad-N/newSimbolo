import { MessageSquare } from "lucide-react";

export function CommentSection() {
  return (
    <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="h-6 w-6 text-[var(--accent)]" />
        <h3 className="font-heading text-[1.5rem] font-bold text-[var(--text-primary)]">Leave a Reply</h3>
      </div>
      
      <p className="text-[var(--muted)] text-[0.9rem] mb-6">
        Your email address will not be published. Required fields are marked *
      </p>

      <form className="space-y-6">
        <div>
          <label htmlFor="comment" className="block text-[0.85rem] font-medium text-[var(--text-primary)] mb-2">Comment *</label>
          <textarea 
            id="comment" 
            rows={6}
            className="w-full rounded-[12px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="name" className="block text-[0.85rem] font-medium text-[var(--text-primary)] mb-2">Name *</label>
            <input 
              type="text" 
              id="name" 
              className="w-full rounded-[12px] h-12 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[0.85rem] font-medium text-[var(--text-primary)] mb-2">Email *</label>
            <input 
              type="email" 
              id="email" 
              className="w-full rounded-[12px] h-12 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-[0.85rem] font-medium text-[var(--text-primary)] mb-2">Website</label>
            <input 
              type="url" 
              id="website" 
              className="w-full rounded-[12px] h-12 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="save-info" className="h-4 w-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]" />
          <label htmlFor="save-info" className="text-[0.85rem] text-[var(--muted)] cursor-pointer">
            Save my name, email, and website in this browser for the next time I comment.
          </label>
        </div>

        <button 
          type="submit"
          className="rounded-[8px] bg-[var(--text-primary)] px-8 py-3 font-bold text-[var(--background)] hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
