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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-white">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-400">
        An unexpected error occurred while loading the admin dashboard. You can try again or refresh the page.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white shadow-[0_0_15px_var(--primary-glow)] transition-colors hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
