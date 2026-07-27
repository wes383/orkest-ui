import * as React from "react";
import { cn, softColorTriple } from "@/lib/utils";
import { PROJECT_PALETTE } from "@/lib/tokens";

function resolveColor(color: string): string {
  if (color.startsWith("#")) return color;
  const fromPalette = PROJECT_PALETTE[color];
  if (fromPalette) return fromPalette;
  return color;
}

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  color: string;
}

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, color, children, style, ...props }, ref) => {
    const hex = resolveColor(color);
    const triple = softColorTriple(hex);
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
          className
        )}
        style={{
          backgroundColor: triple.bg,
          borderColor: triple.border,
          color: triple.text,
          ...style,
        }}
        {...props}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: hex }}
          aria-hidden="true"
        />
        {children}
      </span>
    );
  }
);
Pill.displayName = "Pill";
