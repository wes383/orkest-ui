"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {}

export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface text-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = "Command";

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {}

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-border px-4"
    cmdk-input-wrapper=""
  >
    <Search className="mr-3 h-4 w-4 shrink-0 text-foreground-subtle" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

export interface CommandListProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {}

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-80 overflow-y-auto overflow-x-hidden p-1",
      className
    )}
    {...props}
  />
));
CommandList.displayName = "CommandList";

export interface CommandEmptyProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> {}

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-6 text-center text-sm text-foreground-muted")}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

export interface CommandGroupProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {}

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-foreground-muted",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {}

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
      "data-[selected=true]:bg-hover-bg",
      "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

export interface CommandShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  CommandShortcutProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "ml-auto text-xs tracking-wide text-foreground-subtle",
      className
    )}
    {...props}
  />
));
CommandShortcut.displayName = "CommandShortcut";

export interface CommandSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> {}

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("h-px bg-border my-1", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

export interface CommandLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandLabel = React.forwardRef<
  HTMLDivElement,
  CommandLabelProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    cmdk-label=""
    className={cn(
      "px-2 py-1.5 text-xs font-medium tracking-wide text-foreground-muted",
      className
    )}
    {...props}
  />
));
CommandLabel.displayName = "CommandLabel";

export interface CommandDialogProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  children?: React.ReactNode;
}

export const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-modal bg-overlay backdrop-blur-sm",
            "data-[state=open]:animate-fade-in"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            // Horizontal centering intentionally avoids `left-1/2 -translate-x-1/2`:
            // the enter animation animates `transform`, which overrides the
            // `-translate-x-1/2` utility for the animation's duration and makes
            // the panel appear off-center, then snap to the middle.
            // `inset-x-0 mx-auto` centers without touching `transform`.
            "fixed inset-x-0 top-[20%] z-modal mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-dialog",
            "data-[state=open]:animate-fade-slide-in"
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            Command palette
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search for a command to run.
          </DialogPrimitive.Description>
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground-muted [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            {children}
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export { CommandPrimitive, DialogPrimitive as Dialog };
