import * as React from "react";
import { cn } from "@/lib/utils";
import { useDensity } from "@/components/density-provider";

/**
 * Layout helpers for the showcase page only.
 *
 * They follow the global density so the header switch visibly reflows the whole
 * page, not just the components inside it. Not part of the published library.
 */

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background font-display font-extrabold",
        className
      )}
      aria-hidden="true"
    >
      O
    </div>
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  id?: string;
}

export function Section({
  title,
  description,
  id,
  className,
  children,
  ...props
}: SectionProps) {
  const compact = useDensity() === "compact";
  return (
    <section
      id={id}
      className={cn("scroll-mt-24", compact ? "mb-10" : "mb-14", className)}
      {...props}
    >
      <h2 className="font-display text-[28px] font-semibold tracking-tight mb-2">
        {title}
      </h2>
      {description && (
        <p className={cn("text-sm text-foreground-muted max-w-2xl", compact ? "mb-4" : "mb-6")}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export function SubsectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const compact = useDensity() === "compact";
  return (
    <span
      className={cn(
        "inline-block text-[13px] font-medium tracking-wide text-foreground-muted",
        compact ? "mb-2" : "mb-3",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const compact = useDensity() === "compact";
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface",
        compact ? "p-4" : "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SwatchProps {
  name: string;
  hex: string;
  description?: string;
}

export function Swatch({ name, hex, description }: SwatchProps) {
  const compact = useDensity() === "compact";
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div
        className={compact ? "h-12" : "h-16"}
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between bg-surface px-3 py-2.5">
        <span className="text-[11px] text-foreground-muted">
          {description ?? name}
        </span>
        <span className="font-mono text-[11px] text-foreground-muted uppercase">
          {hex}
        </span>
      </div>
    </div>
  );
}

export function Grid({
  cols = 2,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  cols?: 2 | 3 | 4;
}) {
  const compact = useDensity() === "compact";
  const colMap: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  };
  return (
    <div
      className={cn("grid", compact ? "gap-3" : "gap-4", colMap[cols], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Row({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const compact = useDensity() === "compact";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        compact ? "gap-2" : "gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Stack({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const compact = useDensity() === "compact";
  return (
    <div
      className={cn("flex flex-col", compact ? "gap-2" : "gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}
