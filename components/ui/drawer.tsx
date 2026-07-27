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
  "fixed z-modal bg-surface border-border shadow-dialog flex flex-col focus:outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-border animate-slide-in-left",
        bottom: "inset-x-0 bottom-0 border-t border-border animate-slide-in-left",
        left: "inset-y-0 left-0 border-r border-border w-full max-w-[400px] animate-slide-in-left",
        right: "inset-y-0 right-0 border-l border-border w-full max-w-[400px] animate-slide-in-right",
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

export interface DrawerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-5 pb-2 flex flex-col gap-1.5", className)}
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
        "mt-auto flex justify-end gap-2 p-5 border-t border-border",
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
