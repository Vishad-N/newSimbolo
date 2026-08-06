import { Globe, MessageCircle } from "lucide-react";
import type { BlogAuthor } from "@/types/blog";

export function AuthorCard({ author }: { author: BlogAuthor }) {
  if (!author) return null;

  return (
    <div className="mt-16 rounded-[16px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--accent)]/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {author.photoUrl && <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" />}
      </div>
      <div>
        <h3 className="font-heading text-[1.5rem] font-bold text-[var(--text-primary)] mb-1">{author.name}</h3>
        <p className="text-[var(--accent)] text-[0.9rem] mb-4 font-medium">{author.role}</p>
        <p className="text-[var(--muted)] text-[0.95rem] mb-4">{author.bio}</p>
        <div className="flex justify-center sm:justify-start gap-3">
          {author.socialLinks?.twitter && (
            <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-blue-400 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </a>
          )}
          {author.socialLinks?.linkedin && (
            <a href={author.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-blue-600 transition-colors">
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
