"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
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
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showClose?: boolean;
  /** aria-label for the close button. */
  closeLabel?: string;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showClose = true, closeLabel = "Close", ...props }, ref) => (
  <DialogPortal>
    {/* Overlay and Content are siblings under Portal per Radix recommended
        structure, avoiding animation / focus-trap / pointer-events ordering issues. */}
    <DialogOverlay />
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // `relative` is required: it keeps the absolutely positioned close
          // button anchored to the dialog. Without it, the entry animation's
          // transform is the only containing block, so the button jumps to the
          // viewport corner as soon as the animation ends.
          //
          // `flex flex-col` + a viewport-derived `max-h` is what keeps a dialog
          // from growing past the screen. The wrapper's `p-4` is the 2rem being
          // subtracted here, so the panel always fits the space it is centred in
          // — without it, a child that can size itself (a `resize-y` textarea,
          // a long form) just pushes the footer out of the viewport.
          //
          // `overflow-y-auto` here is the graceful-degradation case for content
          // that is *not* wrapped in `DialogBody`: it scrolls as a whole rather
          // than being clipped. With a body in place the body absorbs the
          // overflow, this never comes into play, and nothing double-scrolls.
          "relative flex flex-col w-full max-w-lg max-h-[calc(100dvh_-_2rem)] overflow-y-auto overflow-x-hidden bg-surface border border-border rounded-xl shadow-dialog animate-fade-slide-in p-0 focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted hover:bg-hover-bg hover:text-foreground transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The scrolling middle region of a dialog — put the form between
 * `DialogHeader` and `DialogFooter` inside one of these.
 *
 * `min-h-0` is what actually makes it scroll: a flex item defaults to
 * `min-height: auto`, so without it the body refuses to shrink below its
 * content, grows the panel, and the footer lands off screen.
 */
const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 min-h-0 overflow-y-auto px-7 pb-2", className)}
      {...props}
    />
  )
);
DialogBody.displayName = "DialogBody";

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("shrink-0 p-7 pb-2", className)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 flex justify-end gap-2 p-5 border-t border-border",
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
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
DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-foreground-muted mt-1", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPrimitive,
};
