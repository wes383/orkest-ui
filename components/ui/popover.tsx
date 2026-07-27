"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-popover w-72 outline-none bg-surface border border-border rounded-lg shadow-pop p-4",
        // Use Radix data-state + CSS transition for enter/exit animation.
        // Keyframe animations are avoided because their transform conflicts with
        // Radix's transform-based content positioning, causing position glitches on open.
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-none",
        className
      )}
      /**
       * Prevent Radix from programmatically returning focus to the Trigger on close,
       * avoiding :focus-visible state being inherited from inner elements to the
       * Trigger which would leave a lingering focus ring.
       * See dropdown-menu.tsx for the same issue.
       */
      onCloseAutoFocus={(e) => e.preventDefault()}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
