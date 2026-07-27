import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const timelineDotVariants = cva(
  "h-6 w-6 rounded-full border-2 border-border bg-surface flex items-center justify-center shrink-0",
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
    },
    defaultVariants: {
      color: "default",
    },
  }
);

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
);
Timeline.displayName = "Timeline";

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLast?: boolean;
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, isLast = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex gap-4 pb-6 last:pb-0",
        className
      )}
      {...props}
    >
      {!isLast && <TimelineSeparator />}
      {children}
    </div>
  )
);
TimelineItem.displayName = "TimelineItem";

export interface TimelineSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineSeparator = React.forwardRef<
  HTMLDivElement,
  TimelineSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "absolute left-3 top-8 bottom-0 w-px bg-border",
      className
    )}
    {...props}
  />
));
TimelineSeparator.displayName = "TimelineSeparator";

export interface TimelineDotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof timelineDotVariants> {}

export const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, color, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(timelineDotVariants({ color, className }))}
      {...props}
    />
  )
);
TimelineDot.displayName = "TimelineDot";

export interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineContent = React.forwardRef<
  HTMLDivElement,
  TimelineContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 pt-0.5 min-w-0", className)}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

export interface TimelineTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  TimelineTitleProps
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("font-medium text-sm", className)}
    {...props}
  />
));
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
