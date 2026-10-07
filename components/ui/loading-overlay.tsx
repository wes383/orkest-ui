"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, the overlay is scoped to its closest positioned parent. */
  container?: boolean;
  /** Optional message shown beneath the spinner. */
  message?: React.ReactNode;
  /** Spinner size. @default "lg" */
  spinnerSize?: "sm" | "md" | "lg" | "xl";
  /** Backdrop opacity helper. @default 0.5 */
  backdropOpacity?: number;
}

export const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  LoadingOverlayProps
>(
  (
    {
      className,
      container = false,
      message,
      spinnerSize = "lg",
      backdropOpacity = 0.5,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          container ? "absolute" : "fixed",
          "inset-0 z-modal flex flex-col items-center justify-center gap-3 backdrop-blur-sm",
          className
        )}
        style={{ backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }}
        {...props}
      >
        <Spinner size={spinnerSize} />
        {message && (
          /**
           * `text-foreground`, not `text-background`. The scrim under this text
           * is always a black tint, so the message has to contrast with the
           * *page*, not with the canvas — and `--background` is that canvas
           * (#fcfbfa light, #101010 dark), which is near-white in light mode and
           * near-black in dark mode. Both directions washed the text out.
           * `--foreground` also happens to match the Spinner's `--accent` head
           * in all four modes, so the two stay a matched pair.
           */
          <span className="text-sm font-medium text-foreground">
            {message}
          </span>
        )}
        <span className="sr-only">Loading</span>
      </div>
    );
  }
);
LoadingOverlay.displayName = "LoadingOverlay";
