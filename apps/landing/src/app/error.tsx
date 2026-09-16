"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] px-6 text-center text-white">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-400">
        We hit an unexpected error loading this page. Please try again in a moment.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-[12px] bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
