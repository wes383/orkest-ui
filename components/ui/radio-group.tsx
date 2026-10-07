"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Density tiers for the radio dot and card padding. */
export type RadioGroupDensity = Density;

/**
 * The inner dot is a pseudo-element (`after:h-*`), so box and dot sizes have to
 * stay in the same variant string.
 */
const radioItemVariants = {
  compact:
    "h-3.5 w-3.5 after:h-1.5 after:w-1.5",
  default:
    "h-4 w-4 after:h-2 after:w-2",
  comfortable:
    "h-5 w-5 after:h-2.5 after:w-2.5",
} as const;

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Row density. Falls back to the surrounding density. */
  density?: RadioGroupDensity;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, density, ...props }, ref) => {
  const globalDensity = useDensity();
  const resolvedDensity = density ?? globalDensity;
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(
        "grid",
        resolvedDensity === "compact"
          ? "gap-1.5"
          : resolvedDensity === "comfortable"
          ? "gap-2.5"
          : "gap-2",
        className
      )}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /** Dot density. Falls back to the surrounding density. */
  density?: RadioGroupDensity;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, density, ...props }, ref) => {
  const globalDensity = useDensity();
  const resolvedDensity = density ?? globalDensity;
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "relative aspect-square shrink-0 rounded-full border border-border-strong bg-surface text-accent shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent transition-colors after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-accent after:content-[''] after:scale-0 after:opacity-0 after:transition-all data-[state=checked]:after:scale-100 data-[state=checked]:after:opacity-100",
        radioItemVariants[resolvedDensity],
        className
      )}
      {...props}
    />
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export interface RadioCardProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    "title"
  > {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Card density. Falls back to the surrounding density. */
  density?: RadioGroupDensity;
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, title, description, density, children, ...props }, ref) => {
  const globalDensity = useDensity();
  const resolvedDensity = density ?? globalDensity;
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative flex w-full cursor-pointer items-start rounded-lg border border-border bg-surface text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent data-[state=checked]:bg-accent-muted",
        resolvedDensity === "compact"
          ? "gap-2.5 p-3"
          : resolvedDensity === "comfortable"
          ? "gap-3.5 p-5"
          : "gap-3 p-4",
        className
      )}
      {...props}
    >
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors group-data-[state=checked]:border-accent">
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </RadioGroupPrimitive.Indicator>
        </span>
      </span>
      <div className="flex-1 space-y-0.5">
        {title && (
          <div
            className={cn(
              "font-medium text-foreground",
              resolvedDensity === "compact" ? "text-xs" : "text-sm"
            )}
          >
            {title}
          </div>
        )}
        {description && (
          <div className="text-xs text-foreground-subtle">{description}</div>
        )}
        {children}
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = "RadioCard";

export { RadioGroup, RadioGroupItem, RadioCard };
