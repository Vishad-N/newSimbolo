import Link from "next/link";

export function ReadyToGrow() {
  return (
    <div className="rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-6 backdrop-blur-md text-center">
      <h4 className="font-heading text-[1.2rem] font-bold text-[var(--text-primary)] mb-2">Ready to grow?</h4>
      <p className="text-[0.85rem] text-[var(--muted)] mb-4">Let our experts help you scale your business.</p>
      <Link href="/contact" className="inline-block w-full rounded-[8px] bg-[var(--accent)] py-2 text-white font-bold text-[0.9rem] hover:bg-[var(--accent-hover)] transition-colors">
        Contact Us
      </Link>
    </div>
  );
}
