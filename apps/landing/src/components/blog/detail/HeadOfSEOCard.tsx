import { Globe, MessageCircle } from "lucide-react";
import Link from "next/link";

export function HeadOfSEOCard() {
  return (
    <div className="rounded-[16px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 backdrop-blur-md">
      <h4 className="font-heading text-[1rem] font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider">SEO Expert</h4>
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[var(--accent)]/30 shrink-0">
          <div className="h-full w-full bg-[var(--muted)]/20 flex items-center justify-center text-[2rem]">👨‍💻</div>
        </div>
        <div>
          <h5 className="font-bold text-[var(--text-primary)]">Sarah Jenkins</h5>
          <p className="text-[0.8rem] text-[var(--accent)] font-medium">Head of SEO</p>
        </div>
      </div>
      <p className="text-[0.85rem] text-[var(--muted)] mb-4 leading-relaxed">
        With over 10 years of experience in technical SEO and content strategy, Sarah helps brands dominate search engine rankings.
      </p>
      <div className="flex gap-3">
        <Link href="#" className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--muted)] hover:text-blue-400 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
          <MessageCircle className="h-4 w-4" />
        </Link>
        <Link href="#" className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 transition-all">
          <Globe className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
