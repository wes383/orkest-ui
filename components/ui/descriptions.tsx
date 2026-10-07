"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Density tiers shared by Descriptions, its items and label / content parts. */
export type DescriptionsDensity = Density;

/**
 * Propagates the density set on `<Descriptions>` down to the rows so only the
 * root needs the prop.
 */
const DescriptionsDensityContext =
  React.createContext<DescriptionsDensity>("default");

const descriptionCell = {
  compact: { label: "px-3 py-1.5", content: "px-3 py-1.5 text-xs" },
  default: { label: "px-4 py-2.5", content: "px-4 py-2.5 text-sm" },
  comfortable: { label: "px-5 py-3", content: "px-5 py-3 text-base" },
} as const;

const LABEL_BASE =
  "flex items-center text-xs font-medium tracking-wide text-foreground-muted bg-muted sm:w-1/3";

export interface DescriptionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  column?: number;
  /** Row density. Falls back to the surrounding density, then to "default". */
  density?: DescriptionsDensity;
}

export const Descriptions = React.forwardRef<
  HTMLDivElement,
  DescriptionsProps
>(({ className, column: _column, density, ...props }, ref) => {
  const globalDensity = useDensity();
  const resolvedDensity = density ?? globalDensity;
  return (
    <DescriptionsDensityContext.Provider value={resolvedDensity}>
      <div
        ref={ref}
        className={cn(
          "border border-border rounded-lg overflow-hidden divide-y divide-border",
          className
        )}
        {...props}
      />
    </DescriptionsDensityContext.Provider>
  );
});
Descriptions.displayName = "Descriptions";

export interface DescriptionsItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** Overrides the density inherited from `<Descriptions>`. */
  density?: DescriptionsDensity;
}

export const DescriptionsItem = React.forwardRef<
  HTMLDivElement,
  DescriptionsItemProps
>(({ className, label, density, children, ...props }, ref) => {
  const ctx = React.useContext(DescriptionsDensityContext);
  const cells = descriptionCell[density ?? ctx];
  return (
    <div
      ref={ref}
      className={cn(
        // Stretch (the flex default) keeps both columns the same height, so the
        // muted label background always fills the row. Using `items-center`
        // here leaves the label shorter than a taller value column and exposes
        // the row background around it.
        "flex flex-col sm:flex-row",
        className
      )}
      {...props}
    >
      {label !== undefined && (
        <div className={cn(LABEL_BASE, cells.label)}>{label}</div>
      )}
      <div className={cn("flex-1", cells.content)}>{children}</div>
    </div>
  );
});
DescriptionsItem.displayName = "DescriptionsItem";

export interface DescriptionsLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Overrides the density inherited from `<Descriptions>`. */
  density?: DescriptionsDensity;
}

export const DescriptionsLabel = React.forwardRef<
  HTMLDivElement,
  DescriptionsLabelProps
>(({ className, density, ...props }, ref) => {
  const ctx = React.useContext(DescriptionsDensityContext);
  const cells = descriptionCell[density ?? ctx];
  return (
    <div
      ref={ref}
      className={cn(LABEL_BASE, cells.label, className)}
      {...props}
    />
  );
});
DescriptionsLabel.displayName = "DescriptionsLabel";

export interface DescriptionsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Overrides the density inherited from `<Descriptions>`. */
  density?: DescriptionsDensity;
}

export const DescriptionsContent = React.forwardRef<
  HTMLDivElement,
  DescriptionsContentProps
>(({ className, density, ...props }, ref) => {
  const ctx = React.useContext(DescriptionsDensityContext);
  const cells = descriptionCell[density ?? ctx];
  return (
    <div
      ref={ref}
      className={cn("flex-1", cells.content, className)}
      {...props}
    />
  );
});
DescriptionsContent.displayName = "DescriptionsContent";
