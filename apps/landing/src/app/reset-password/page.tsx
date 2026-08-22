import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | The Simbolo",
  description: "Set a new password for your Simbolo account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-24">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[var(--primary)]/10 via-[var(--accent)]/5 to-transparent" />
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="h-[360px] rounded-[24px] bg-white/5 animate-pulse" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
