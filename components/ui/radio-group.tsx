"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "relative aspect-square h-4 w-4 shrink-0 rounded-full border border-border-strong bg-surface text-accent shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent transition-colors after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-2 after:w-2 after:rounded-full after:bg-accent after:content-[''] after:scale-0 after:opacity-0 after:transition-all data-[state=checked]:after:scale-100 data-[state=checked]:after:opacity-100",
      className
    )}
    {...props}
  />
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export interface RadioCardProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    "title"
  > {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, title, description, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex w-full cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent data-[state=checked]:bg-accent-muted",
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
        <div className="text-sm font-medium text-foreground">{title}</div>
      )}
      {description && (
        <div className="text-xs text-foreground-subtle">{description}</div>
      )}
      {children}
    </div>
  </RadioGroupPrimitive.Item>
));
RadioCard.displayName = "RadioCard";

export { RadioGroup, RadioGroupItem, RadioCard };
