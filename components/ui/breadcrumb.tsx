import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbProps
  extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
);
Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps
  extends React.OlHTMLAttributes<HTMLOListElement> {}

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  BreadcrumbListProps
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 text-sm text-foreground-muted flex-wrap break-all",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

export interface BreadcrumbItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  as?: React.ElementType;
}

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ className, asChild = false, as: Comp = "a", ...props }, ref) => {
  const Element = asChild ? Slot : (Comp as React.ElementType);
  return (
    <Element
      ref={ref}
      className={cn(
        "rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbPageProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("text-foreground font-medium", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("text-foreground-subtle inline-flex items-center", className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-4 w-4" />}
  </li>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export interface BreadcrumbEllipsisProps
  extends React.HTMLAttributes<HTMLLIElement> {}

export const BreadcrumbEllipsis = React.forwardRef<
  HTMLLIElement,
  BreadcrumbEllipsisProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    aria-hidden="true"
    className={cn("flex h-6 w-6 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </li>
));
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
