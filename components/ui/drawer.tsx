"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;

export interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-modal bg-overlay backdrop-blur-sm animate-fade-in",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

export const drawerVariants = cva(
  // Inset 8px from the viewport edge so the panel reads as a floating surface
  // rather than a slice of the screen. That is also why the border is drawn on
  // all four sides — an attached edge would have nothing to butt against.
  //
  // `overflow-y-auto` is what turns a tall child (a `resize-y` textarea, a long
  // form) into a scrollbar instead of a footer pushed past the bottom edge. For
  // the side-anchored variants the `inset-y-2` alone already bounds the height;
  // the `max-h` is for `top` / `bottom`, which only pin one axis. Both resolve
  // to the same value, so a single declaration covers all four sides. `dvh`, not
  // `vh`, so mobile browser chrome does not eat the bottom of the panel.
  "fixed z-modal max-h-[calc(100dvh_-_1rem)] bg-surface border border-border rounded-xl shadow-dialog flex flex-col overflow-y-auto overflow-x-hidden focus:outline-none",
  {
    variants: {
      side: {
        // `calc` keeps the gap on the attached side without letting the panel
        // spill past the opposite edge on a narrow viewport.
        top: "inset-x-2 top-2 animate-slide-in-left",
        bottom: "inset-x-2 bottom-2 animate-slide-in-left",
        left: "inset-y-2 left-2 w-[calc(100%_-_1rem)] max-w-[400px] animate-slide-in-left",
        right: "inset-y-2 right-2 w-[calc(100%_-_1rem)] max-w-[400px] animate-slide-in-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerVariants> {
  showClose?: boolean;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, side = "right", showClose = true, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(drawerVariants({ side, className }))}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close
          aria-label="Close"
          className={cn(
            "absolute inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted hover:bg-hover-bg hover:text-foreground transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            side === "left" || side === "right" ? "right-4 top-4" : "right-4 top-4"
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The scrolling middle region of a drawer — the form goes between
 * `DrawerHeader` and `DrawerFooter`.
 *
 * `min-h-0` is what actually makes it scroll: a flex item defaults to
 * `min-height: auto`, so without it the body refuses to shrink below its
 * content and pushes the footer out of the panel instead.
 */
const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 min-h-0 overflow-y-auto px-5 pb-4", className)}
      {...props}
    />
  )
);
DrawerBody.displayName = "DrawerBody";

export interface DrawerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("shrink-0 p-5 pb-2 flex flex-col gap-1.5", className)}
      {...props}
    />
  )
);
DrawerHeader.displayName = "DrawerHeader";

export interface DrawerFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 mt-auto flex justify-end gap-2 p-5 border-t border-border",
        className
      )}
      {...props}
    />
  )
);
DrawerFooter.displayName = "DrawerFooter";

export interface DrawerTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display text-lg font-semibold tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-foreground-muted", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
