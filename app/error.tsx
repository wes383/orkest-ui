"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global error boundary for the showcase app. Renders a themed fallback and
 * offers a retry via `reset()`, so a throwing section never white-screens
 * the whole page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for observability without leaking details into the UI.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="text-base text-foreground-muted">
          An unexpected error occurred while rendering this page.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-full bg-accent px-5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="h-10 rounded-full border border-border px-5 text-sm font-medium text-foreground leading-10 transition-colors hover:bg-hover-bg"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
