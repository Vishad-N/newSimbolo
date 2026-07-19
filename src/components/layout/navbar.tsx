import { Moon } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-end gap-4 bg-[#050816]/75 px-4 backdrop-blur-md sm:px-8 lg:px-10">
      <button aria-label="Toggle dark mode" className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/5">
        <Moon className="h-5 w-5" />
      </button>
      <button className="h-10 rounded-[9px] border border-white/14 px-6 text-[0.92rem] font-bold text-white transition duration-300 hover:bg-white/8">Login</button>
      <button className="h-10 rounded-[16px] bg-[var(--primary)] px-6 text-[0.92rem] font-extrabold text-white shadow-[0_10px_24px_var(--primary-glow)] transition duration-300 hover:scale-[1.03] hover:bg-[var(--primary-hover)]">Register</button>
    </header>
  );
}
