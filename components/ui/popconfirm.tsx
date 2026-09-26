"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popconfirm = PopoverPrimitive.Root;
const PopconfirmTrigger = PopoverPrimitive.Trigger;
const PopconfirmAnchor = PopoverPrimitive.Anchor;

export interface PopconfirmContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** When true, the confirm button uses the destructive (red) style. */
  destructive?: boolean;
  /** Text for the confirm button. @default "OK" */
  confirmText?: React.ReactNode;
  /** Text for the cancel button. @default "Cancel" */
  cancelText?: React.ReactNode;
  /** Called when the confirm button is clicked. */
  onConfirm?: () => void;
  /** Called when the cancel button is clicked (or popover dismissed). */
  onCancel?: () => void;
}

const PopconfirmContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopconfirmContentProps
>(
  (
    {
      className,
      children,
      destructive = false,
      confirmText = "OK",
      cancelText = "Cancel",
      onConfirm,
      onCancel,
      align = "center",
      sideOffset = 8,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-popover w-72 outline-none bg-surface border border-border rounded-lg shadow-pop p-4 animate-fade-slide-in",
          className
        )}
        onEscapeKeyDown={() => onCancel?.()}
        onPointerDownOutside={() => onCancel?.()}
        {...props}
      >
        {children}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium leading-none select-none transition-all duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
              "h-8 px-3 text-sm bg-surface text-foreground border border-border hover:bg-hover-bg"
            )}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.()}
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium leading-none select-none transition-all duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
              "h-8 px-3 text-sm",
              destructive
                ? "bg-red text-white hover:bg-red-fg"
                : "bg-accent text-accent-fg hover:bg-accent-hover"
            )}
          >
            {confirmText}
          </button>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);
PopconfirmContent.displayName = "PopconfirmContent";

export interface PopconfirmTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const PopconfirmTitle = React.forwardRef<
  HTMLHeadingElement,
  PopconfirmTitleProps
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-display text-sm font-semibold tracking-tight", className)}
    {...props}
  />
));
PopconfirmTitle.displayName = "PopconfirmTitle";

export interface PopconfirmDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const PopconfirmDescription = React.forwardRef<
  HTMLParagraphElement,
  PopconfirmDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-foreground-muted mt-1", className)}
    {...props}
  />
));
PopconfirmDescription.displayName = "PopconfirmDescription";

export {
  Popconfirm,
  PopconfirmTrigger,
  PopconfirmAnchor,
  PopconfirmContent,
};
