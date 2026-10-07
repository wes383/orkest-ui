"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Density tiers shared by Accordion, AccordionTrigger and AccordionContent. */
export type AccordionDensity = Density;

/**
 * Propagates the density set on `<Accordion>` down to trigger / content so only
 * the root needs the prop.
 */
const AccordionDensityContext = React.createContext<AccordionDensity>("default");

const accordionTriggerVariants = {
  compact: "py-2.5 text-xs",
  default: "py-4 text-sm",
  comfortable: "py-5 text-sm",
} as const;

const accordionContentVariants = {
  compact: "pb-2.5 pt-0 text-xs",
  default: "pb-4 pt-0 text-sm",
  comfortable: "pb-5 pt-0 text-sm",
} as const;

/**
 * A type alias (not an interface) because Radix's Root props are a union of the
 * single/multiple prop sets, which an interface cannot extend.
 */
export type AccordionProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  /** Row density. Falls back to the surrounding density, then to "default". */
  density?: AccordionDensity;
};

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ density, ...props }, ref) => {
  const globalDensity = useDensity();
  const resolvedDensity = density ?? globalDensity;
  return (
    <AccordionDensityContext.Provider value={resolvedDensity}>
      <AccordionPrimitive.Root ref={ref} {...props} />
    </AccordionDensityContext.Provider>
  );
});
Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-border", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /** Overrides the density inherited from `<Accordion>`. */
  density?: AccordionDensity;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, density, ...props }, ref) => {
  const ctx = React.useContext(AccordionDensityContext);
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between font-medium hover:text-foreground-muted transition-colors duration-base ease-out",
          accordionTriggerVariants[density ?? ctx],
          "focus-visible:outline-none focus-visible:text-foreground-muted",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-base ease-out"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
  /** Overrides the density inherited from `<Accordion>`. */
  density?: AccordionDensity;
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, density, ...props }, ref) => {
  const ctx = React.useContext(AccordionDensityContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className={cn("text-foreground-muted", accordionContentVariants[density ?? ctx])}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionPrimitive,
};
