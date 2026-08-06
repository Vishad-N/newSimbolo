import ReactMarkdown from "react-markdown";

export function BlogContent({ content }: { content: string }) {
  return (
    <div 
      id="blog-content" 
      className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:scroll-mt-32 prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:w-full prose-img:object-cover prose-p:text-[var(--text-primary)] prose-li:text-[var(--text-primary)]"
    >
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}
