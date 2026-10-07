"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

/**
 * HoverCard — a panel of supplementary detail that opens on hover (and on
 * keyboard focus) without a click.
 *
 * Reaches for the same slot as `Tooltip` but for richer content: a tooltip is
 * one short line of text, a hover card is a block — avatar, name, role, links.
 * Because that content is interactive, Radix pauses its close timer once the
 * pointer is inside it, so the card survives the trip from the trigger to the
 * panel. For click-driven panels use `Popover`; for one-liners use `Tooltip`.
 *
 * Defaults mirror the Tooltip's 300ms feel rather than Radix's 700ms.
 *
 * @example
 * <HoverCard>
 *   <HoverCardTrigger asChild>
 *     <Button variant="link">@ava</Button>
 *   </HoverCardTrigger>
 *   <HoverCardContent>
 *     <Avatar name="Ava Chen" />
 *     <div className="text-sm font-medium">Ava Chen</div>
 *     <div className="text-xs text-foreground-muted">Frontend engineer</div>
 *   </HoverCardContent>
 * </HoverCard>
 */
function HoverCard({
  openDelay = 300,
  closeDelay = 120,
  ...props
}: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>) {
  return (
    <HoverCardPrimitive.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    />
  );
}
HoverCard.displayName = "HoverCard";

const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardPortal = HoverCardPrimitive.Portal;

export interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  /**
   * Optional Portal target. Use this for content that must stay inside a
   * scroll-locked parent, such as a Dialog. See `PopoverContent`.
   */
  container?: HTMLElement | null;
}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, align = "center", sideOffset = 8, container, ...props }, ref) => (
  <HoverCardPrimitive.Portal container={container ?? undefined}>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // Same surface treatment as Popover, so the two read as one family.
        "w-72 outline-none bg-surface text-foreground border border-border rounded-lg shadow-pop p-4",
        // Fade only: keyframe animations bring their own transform, which fights
        // Radix's transform-based positioning. Same reasoning as popover.tsx.
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-none",
        // !important: clear z-modal (60) so the card shows above a Dialog.
        "!z-[100]",
        className
      )}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardPortal, HoverCardContent };
