import * as React from "react";
import { cn } from "@/lib/utils";

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
  return (
    <section
      id={id}
      className={cn("mb-14 scroll-mt-24", className)}
      {...props}
    >
      <h2 className="font-display text-[28px] font-semibold tracking-tight mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-foreground-muted mb-6 max-w-2xl">
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
  return (
    <span
      className={cn(
        "inline-block text-[13px] font-medium tracking-wide text-foreground-muted mb-3",
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
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
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
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div
        className="h-16"
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
  const colMap: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  };
  return (
    <div className={cn("grid gap-4", colMap[cols], className)} {...props}>
      {children}
    </div>
  );
}

export function Row({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3", className)}
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
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  );
}
