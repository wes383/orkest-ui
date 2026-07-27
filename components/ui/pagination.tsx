import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps
  extends React.ComponentPropsWithoutRef<"nav"> {}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
);
Pagination.displayName = "Pagination";

export interface PaginationContentProps
  extends React.OlHTMLAttributes<HTMLOListElement> {}

export const PaginationContent = React.forwardRef<
  HTMLOListElement,
  PaginationContentProps
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export interface PaginationItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  PaginationItemProps
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "onClick"> {
  isActive?: boolean;
  asChild?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const PaginationLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationLinkProps
>(
  (
    { className, isActive = false, asChild = false, href, onClick, children, ...props },
    ref
  ) => {
    const base = cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm transition-colors cursor-pointer select-none",
      "hover:bg-hover-bg",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isActive && "bg-accent text-accent-fg pointer-events-none",
      className
    );

    if (asChild) {
      return (
        <Slot ref={ref as React.Ref<HTMLElement>} className={base} {...props}>
          {children as React.ReactElement}
        </Slot>
      );
    }

    if (href != null) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-current={isActive ? "page" : undefined}
          className={base}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-current={isActive ? "page" : undefined}
        onClick={onClick}
        className={base}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);
PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps
  extends Omit<PaginationLinkProps, "children"> {
  children?: React.ReactNode;
}

export const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationPreviousProps
>(({ className, children = "Previous", ...props }, ref) => (
  <PaginationLink
    ref={ref as React.Ref<HTMLAnchorElement | HTMLButtonElement>}
    aria-label="Go to previous page"
    className={cn("gap-1.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{children}</span>
  </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps
  extends Omit<PaginationLinkProps, "children"> {
  children?: React.ReactNode;
}

export const PaginationNext = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationNextProps
>(({ className, children = "Next", ...props }, ref) => (
  <PaginationLink
    ref={ref as React.Ref<HTMLAnchorElement | HTMLButtonElement>}
    aria-label="Go to next page"
    className={cn("gap-1.5", className)}
    {...props}
  >
    <span>{children}</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

export interface PaginationEllipsisProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-9 min-w-9 items-center justify-center text-foreground-subtle",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";
