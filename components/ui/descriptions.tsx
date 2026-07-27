import * as React from "react";
import { cn } from "@/lib/utils";

export interface DescriptionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  column?: number;
}

export const Descriptions = React.forwardRef<
  HTMLDivElement,
  DescriptionsProps
>(({ className, column: _column, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border border-border rounded-lg overflow-hidden divide-y divide-border",
        className
      )}
      {...props}
    />
  );
});
Descriptions.displayName = "Descriptions";

export interface DescriptionsItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export const DescriptionsItem = React.forwardRef<
  HTMLDivElement,
  DescriptionsItemProps
>(({ className, label, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center",
        className
      )}
      {...props}
    >
      {label !== undefined && (
        <div className="text-xs font-medium tracking-wide text-foreground-muted bg-muted px-4 py-2.5 sm:w-1/3">
          {label}
        </div>
      )}
      <div className="px-4 py-2.5 text-sm flex-1">{children}</div>
    </div>
  );
});
DescriptionsItem.displayName = "DescriptionsItem";

export interface DescriptionsLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DescriptionsLabel = React.forwardRef<
  HTMLDivElement,
  DescriptionsLabelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "text-xs font-medium tracking-wide text-foreground-muted bg-muted px-4 py-2.5 sm:w-1/3",
        className
      )}
      {...props}
    />
  );
});
DescriptionsLabel.displayName = "DescriptionsLabel";

export interface DescriptionsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DescriptionsContent = React.forwardRef<
  HTMLDivElement,
  DescriptionsContentProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-4 py-2.5 text-sm flex-1", className)}
      {...props}
    />
  );
});
DescriptionsContent.displayName = "DescriptionsContent";
