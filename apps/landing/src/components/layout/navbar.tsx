import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-end gap-4 bg-[var(--background)]/75 px-4 backdrop-blur-md sm:px-8 lg:px-10">
      <ThemeToggle />
      <button className="h-10 rounded-[9px] border border-white/14 px-6 text-[0.92rem] font-bold text-white transition duration-300 hover:bg-white/8">Login</button>
 <button className="h-10 rounded-[16px] bg-[var(--primary)] px-6 text-[0.92rem] font-extrabold text-[#ffffff] transition duration-300 hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)]">Register</button>
    </header>
  );
}
