import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const trendVariants = cva(
  "inline-flex items-center gap-0.5 text-xs font-medium",
  {
    variants: {
      direction: {
        up: "text-green",
        down: "text-red",
      },
    },
    defaultVariants: {
      direction: "up",
    },
  }
);

export interface StatisticProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
);
Statistic.displayName = "Statistic";

export interface StatisticLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const StatisticLabel = React.forwardRef<
  HTMLSpanElement,
  StatisticLabelProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-xs font-medium tracking-wide text-foreground-muted",
      className
    )}
    {...props}
  />
));
StatisticLabel.displayName = "StatisticLabel";

export interface StatisticValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const StatisticValue = React.forwardRef<
  HTMLSpanElement,
  StatisticValueProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "font-display text-3xl font-semibold tracking-tight",
      className
    )}
    {...props}
  />
));
StatisticValue.displayName = "StatisticValue";

export interface StatisticPrefixProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const StatisticPrefix = React.forwardRef<
  HTMLSpanElement,
  StatisticPrefixProps
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("inline-flex items-center", className)} {...props} />
));
StatisticPrefix.displayName = "StatisticPrefix";

export interface StatisticSuffixProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const StatisticSuffix = React.forwardRef<
  HTMLSpanElement,
  StatisticSuffixProps
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("inline-flex items-center", className)} {...props} />
));
StatisticSuffix.displayName = "StatisticSuffix";

export interface StatisticTrendProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof trendVariants> {
  value?: React.ReactNode;
}

export const StatisticTrend = React.forwardRef<
  HTMLSpanElement,
  StatisticTrendProps
>(({ className, direction = "up", value, children, ...props }, ref) => {
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      ref={ref}
      className={cn(trendVariants({ direction, className }))}
      {...props}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {value !== undefined ? value : children}
    </span>
  );
});
StatisticTrend.displayName = "StatisticTrend";

export interface StatisticCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const StatisticCard = React.forwardRef<
  HTMLDivElement,
  StatisticCardProps
>(({ className, title, icon: Icon, action, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-surface p-5 transition-colors duration-base ease-out hover:border-border-strong",
      className
    )}
    {...props}
  >
    {(title || Icon || action) && (
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
          )}
          {title && (
            <span className="text-xs font-medium tracking-wide text-foreground-muted">
              {title}
            </span>
          )}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
));
StatisticCard.displayName = "StatisticCard";
