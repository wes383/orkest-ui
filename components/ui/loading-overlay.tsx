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
          <span className="text-sm font-medium text-background">
            {message}
          </span>
        )}
        <span className="sr-only">Loading</span>
      </div>
    );
  }
);
LoadingOverlay.displayName = "LoadingOverlay";
