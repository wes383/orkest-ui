"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";
import { useDensity, type Density } from "@/components/density-provider";

/** Density tiers shared by the pagination parts. */
export type PaginationDensity = Density;

/**
 * Propagates the density set on `<Pagination>` down to links / ellipsis so only
 * the root needs the prop.
 */
const PaginationDensityContext = React.createContext<PaginationDensity>("default");

const paginationContentVariants = {
  compact: "gap-0.5",
  default: "gap-1",
  comfortable: "gap-1.5",
} as const;

const paginationLinkVariants = {
  compact: "h-7 min-w-7 rounded-md px-2 text-xs",
  default: "h-9 min-w-9 rounded-md px-3 text-sm",
  comfortable: "h-10 min-w-10 rounded-md px-3.5 text-sm",
} as const;

export interface PaginationProps
  extends React.ComponentPropsWithoutRef<"nav"> {
  /** Density for the whole pagination bar. Falls back to the surrounding density. */
  density?: PaginationDensity;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, density, ...props }, ref) => {
    const globalDensity = useDensity();
    const resolvedDensity = density ?? globalDensity;
    return (
      <PaginationDensityContext.Provider value={resolvedDensity}>
        <nav
          ref={ref}
          role="navigation"
          aria-label="pagination"
          className={cn("mx-auto flex w-full justify-center", className)}
          {...props}
        />
      </PaginationDensityContext.Provider>
    );
  }
);
Pagination.displayName = "Pagination";

export interface PaginationContentProps
  extends React.OlHTMLAttributes<HTMLOListElement> {
  /** Overrides the density inherited from `<Pagination>`. */
  density?: PaginationDensity;
}

export const PaginationContent = React.forwardRef<
  HTMLOListElement,
  PaginationContentProps
>(({ className, density, ...props }, ref) => {
  const ctx = React.useContext(PaginationDensityContext);
  const resolved = density ?? ctx;
  return (
    <ol
      ref={ref}
      className={cn(
        "flex items-center",
        paginationContentVariants[resolved],
        className
      )}
      {...props}
    />
  );
});
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
  /** Overrides the density inherited from `<Pagination>`. */
  density?: PaginationDensity;
}

export const PaginationLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationLinkProps
>(
  (
    {
      className,
      isActive = false,
      asChild = false,
      density,
      href,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const ctx = React.useContext(PaginationDensityContext);
    const resolved = density ?? ctx;
    const base = cn(
      "inline-flex items-center justify-center transition-colors cursor-pointer select-none",
      paginationLinkVariants[resolved],
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
>(({ className, children, ...props }, ref) => {
  const t = useT();
  return (
    <PaginationLink
      ref={ref as React.Ref<HTMLAnchorElement | HTMLButtonElement>}
      aria-label={t("pagination.gotoPrevious")}
      className={cn("gap-1.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{children ?? t("pagination.previous")}</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps
  extends Omit<PaginationLinkProps, "children"> {
  children?: React.ReactNode;
}

export const PaginationNext = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationNextProps
>(({ className, children, ...props }, ref) => {
  const t = useT();
  return (
    <PaginationLink
      ref={ref as React.Ref<HTMLAnchorElement | HTMLButtonElement>}
      aria-label={t("pagination.gotoNext")}
      className={cn("gap-1.5", className)}
      {...props}
    >
      <span>{children ?? t("pagination.next")}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
});
PaginationNext.displayName = "PaginationNext";

export interface PaginationEllipsisProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Overrides the density inherited from `<Pagination>`. */
  density?: PaginationDensity;
}

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ className, density, ...props }, ref) => {
  const t = useT();
  const ctx = React.useContext(PaginationDensityContext);
  const resolved = density ?? ctx;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center text-foreground-subtle",
        resolved === "compact"
          ? "h-7 min-w-7"
          : resolved === "comfortable"
          ? "h-10 min-w-10"
          : "h-9 min-w-9",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t("pagination.morePages")}</span>
    </span>
  );
});
PaginationEllipsis.displayName = "PaginationEllipsis";
