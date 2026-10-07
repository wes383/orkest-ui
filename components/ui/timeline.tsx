"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Density tiers shared by Timeline and its parts. */
export type TimelineDensity = Density;

/**
 * Propagates the density set on `<Timeline>` down to items / dots / separators so
 * only the root needs the prop.
 */
const TimelineDensityContext = React.createContext<TimelineDensity>("default");

export const timelineDotVariants = cva(
  "rounded-full border-2 border-border bg-surface flex items-center justify-center shrink-0",
  {
    variants: {
      color: {
        default: "border-border bg-surface text-foreground-muted",
        accent: "border-accent bg-accent-muted text-accent-fg",
        blue: "border-blue bg-blue-soft text-blue",
        green: "border-green bg-green-soft text-green",
        orange: "border-orange bg-orange-soft text-orange",
        red: "border-red bg-red-soft text-red",
        yellow: "border-yellow bg-yellow-soft text-yellow",
      },
      density: {
        compact: "h-5 w-5",
        default: "h-6 w-6",
        comfortable: "h-7 w-7",
      },
    },
    defaultVariants: {
      color: "default",
      density: "default",
    },
  }
);

/**
 * Separator geometry per density. `left` is half the dot width (the line must
 * run through the dot's centre) and `top` is the dot height plus an 8px gap, so
 * the connector starts just below the dot.
 */
const timelineSpacing = {
  compact: { separator: "left-2.5 top-7", item: "gap-3 pb-4" },
  default: { separator: "left-3 top-8", item: "gap-4 pb-6" },
  comfortable: { separator: "left-3.5 top-9", item: "gap-5 pb-7" },
} as const;

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Row density. Falls back to the surrounding density, then to "default". */
  density?: TimelineDensity;
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, density, ...props }, ref) => {
    const globalDensity = useDensity();
    const resolvedDensity = density ?? globalDensity;
    return (
      <TimelineDensityContext.Provider value={resolvedDensity}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col",
            resolvedDensity === "compact"
              ? "gap-4"
              : resolvedDensity === "comfortable"
              ? "gap-7"
              : "gap-6",
            className
          )}
          {...props}
        />
      </TimelineDensityContext.Provider>
    );
  }
);
Timeline.displayName = "Timeline";

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLast?: boolean;
  /** Overrides the density inherited from `<Timeline>`. */
  density?: TimelineDensity;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, density, isLast = false, children, ...props }, ref) => {
    const ctx = React.useContext(TimelineDensityContext);
    const resolved = density ?? ctx;
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex last:pb-0",
          timelineSpacing[resolved].item,
          className
        )}
        {...props}
      >
        {!isLast && <TimelineSeparator />}
        {children}
      </div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

export interface TimelineSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineSeparator = React.forwardRef<
  HTMLDivElement,
  TimelineSeparatorProps
>(({ className, ...props }, ref) => {
  const density = React.useContext(TimelineDensityContext);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "absolute bottom-0 w-px bg-border",
        timelineSpacing[density].separator,
        className
      )}
      {...props}
    />
  );
});
TimelineSeparator.displayName = "TimelineSeparator";

export interface TimelineDotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof timelineDotVariants> {}

export const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, color, density, ...props }, ref) => {
    const ctx = React.useContext(TimelineDensityContext);
    return (
      <div
        ref={ref}
        className={cn(timelineDotVariants({ color, density: density ?? ctx, className }))}
        {...props}
      />
    );
  }
);
TimelineDot.displayName = "TimelineDot";

export interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Overrides the density inherited from `<Timeline>`. */
  density?: TimelineDensity;
}

export const TimelineContent = React.forwardRef<
  HTMLDivElement,
  TimelineContentProps
>(({ className, density, ...props }, ref) => {
  const ctx = React.useContext(TimelineDensityContext);
  const resolved = density ?? ctx;
  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 min-w-0",
        resolved === "compact" ? "pt-0" : "pt-0.5",
        className
      )}
      {...props}
    />
  );
});
TimelineContent.displayName = "TimelineContent";

export interface TimelineTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Overrides the density inherited from `<Timeline>`. */
  density?: TimelineDensity;
}

export const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  TimelineTitleProps
>(({ className, density, ...props }, ref) => {
  const ctx = React.useContext(TimelineDensityContext);
  const resolved = density ?? ctx;
  return (
    <h4
      ref={ref}
      className={cn(
        "font-medium",
        resolved === "compact"
          ? "text-xs"
          : resolved === "comfortable"
          ? "text-base"
          : "text-sm",
        className
      )}
      {...props}
    />
  );
});
TimelineTitle.displayName = "TimelineTitle";

export interface TimelineDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  TimelineDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-foreground-muted mt-1", className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

export interface TimelineTimeProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const TimelineTime = React.forwardRef<
  HTMLSpanElement,
  TimelineTimeProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-foreground-subtle", className)}
    {...props}
  />
));
TimelineTime.displayName = "TimelineTime";
