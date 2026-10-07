"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Row density tiers shared by ContextMenuContent and its item components. */
export type ContextMenuDensity = Density;

/*
 * The variants below intentionally mirror dropdown-menu.tsx value for value.
 * A context menu and a dropdown are the same visual species — only the way they
 * open differs — so any divergence here would read as a bug.
 */

const contextMenuItemVariants = cva(
  "relative flex items-center rounded-md text-sm cursor-pointer select-none outline-none transition-colors",
  {
    variants: {
      density: {
        compact: "gap-2 px-2 py-1.5",
        default: "gap-2 px-3 py-2",
        comfortable: "gap-2 px-3 py-2.5",
      },
    },
    defaultVariants: { density: "default" },
  }
);

const contextMenuCheckItemVariants = cva(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-md text-sm outline-none transition-colors",
  {
    variants: {
      density: {
        compact: "py-1.5 pl-8 pr-2",
        default: "py-2 pl-8 pr-3",
        comfortable: "py-2.5 pl-8 pr-3",
      },
    },
    defaultVariants: { density: "default" },
  }
);

const contextMenuLabelVariants = cva(
  "text-xs font-medium tracking-wide text-foreground-muted",
  {
    variants: {
      density: {
        compact: "px-2 py-1",
        default: "px-3 py-1.5",
        comfortable: "px-3 py-2",
      },
    },
    defaultVariants: { density: "default" },
  }
);

const contextMenuSubTriggerVariants = cva(
  "flex cursor-default select-none items-center gap-2 rounded-md text-sm outline-none",
  {
    variants: {
      density: {
        compact: "px-2 py-1.5",
        default: "px-3 py-2",
        comfortable: "px-3 py-2.5",
      },
    },
    defaultVariants: { density: "default" },
  }
);

/**
 * Propagates the density set on `<ContextMenuContent>` down to its items, so
 * only the content root needs the prop.
 */
const ContextMenuDensityContext =
  React.createContext<ContextMenuDensity>("default");

/**
 * ContextMenu root wrapper. Defaults `modal` to `false` for the same reason as
 * DropdownMenu: a modal menu locks body scroll and compensates with
 * `padding-right`, which fights `scrollbar-gutter: stable` on the html element
 * and makes the page shake. A context menu needs no focus trap.
 */
function ContextMenu({
  modal = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root modal={modal} {...props} />;
}
ContextMenu.displayName = "ContextMenu";

/**
 * The right-click target. Radix renders a `<span>`, so pass `asChild` (or a
 * `className` that sets a display) when it has to cover a block-level area.
 */
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<
      typeof ContextMenuPrimitive.SubTrigger
    >,
    Pick<VariantProps<typeof contextMenuSubTriggerVariants>, "density"> {
  inset?: boolean;
}

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, density, children, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuDensityContext);
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        contextMenuSubTriggerVariants({ density: density ?? ctx }),
        "data-[highlighted]:bg-hover-bg data-[state=open]:bg-hover-bg",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4 text-foreground-subtle" />
    </ContextMenuPrimitive.SubTrigger>
  );
});
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<
    typeof ContextMenuPrimitive.SubContent
  > {}

/**
 * Nested (second-level) menu panel. Radix already defaults it to `side="right"`
 * with a 2px offset, so no positioning props are needed here.
 */
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-dropdown min-w-48 overflow-hidden bg-surface border border-border rounded-lg shadow-pop p-1",
      // Use Radix data-state + CSS transition for enter/exit animation.
      // Avoid keyframe animations because their transform conflicts with
      // Radix's transform-based content positioning, causing misplacement on open.
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-none",
      className
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {
  /** Optional Portal target for menus used inside scroll-locked overlays. */
  container?: HTMLElement | null;
  /** Row density applied to all items in this menu. Falls back to the surrounding density. */
  density?: ContextMenuDensity;
}

/*
 * No `side` / `sideOffset` / `align` here on purpose: Radix pins a context menu
 * to the pointer position, and its ContextMenu.Content type omits those props.
 * SubContent (the second level) is the one that needs a placement, and Radix
 * already defaults it to the right of its trigger.
 */
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, container, density, ...props }, ref) => {
  const globalDensity = useDensity();
  const resolvedDensity = density ?? globalDensity;
  return (
    <ContextMenuPrimitive.Portal container={container ?? undefined}>
      <ContextMenuDensityContext.Provider value={resolvedDensity}>
        <ContextMenuPrimitive.Content
          ref={ref}
          className={cn(
            "z-dropdown min-w-48 overflow-hidden bg-surface border border-border rounded-lg shadow-pop p-1",
            // Use Radix data-state + CSS transition for enter/exit animation.
            // Avoid keyframe animations because their transform conflicts with
            // Radix's transform-based content positioning, causing misplacement on open.
            "data-[state=open]:animate-fade-in data-[state=closed]:animate-none",
            className
          )}
          {...props}
        />
      </ContextMenuDensityContext.Provider>
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    Pick<VariantProps<typeof contextMenuItemVariants>, "density"> {
  inset?: boolean;
  variant?: "default" | "destructive";
}

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, variant = "default", density, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuDensityContext);
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      data-variant={variant}
      className={cn(
        contextMenuItemVariants({ density: density ?? ctx }),
        "data-[highlighted]:bg-hover-bg",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        "focus:bg-hover-bg",
        inset && "pl-8",
        "data-[variant=destructive]:text-red data-[variant=destructive]:data-[highlighted]:bg-red-soft",
        className
      )}
      {...props}
    />
  );
});
ContextMenuItem.displayName = "ContextMenuItem";

export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<
      typeof ContextMenuPrimitive.CheckboxItem
    >,
    Pick<VariantProps<typeof contextMenuCheckItemVariants>, "density"> {}

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, density, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuDensityContext);
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(
        contextMenuCheckItemVariants({ density: density ?? ctx }),
        "data-[highlighted]:bg-hover-bg",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>,
    Pick<VariantProps<typeof contextMenuCheckItemVariants>, "density"> {}

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, density, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuDensityContext);
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        contextMenuCheckItemVariants({ density: density ?? ctx }),
        "data-[highlighted]:bg-hover-bg",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="h-2.5 w-2.5 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

export interface ContextMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>,
    Pick<VariantProps<typeof contextMenuLabelVariants>, "density"> {
  inset?: boolean;
}

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, density, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuDensityContext);
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(
        contextMenuLabelVariants({ density: density ?? ctx }),
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
});
ContextMenuLabel.displayName = "ContextMenuLabel";

export interface ContextMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> {}

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("h-px bg-border my-1", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export interface ContextMenuShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  ContextMenuShortcutProps
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
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export interface ContextMenuArrowProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Arrow> {}

const ContextMenuArrow = ContextMenuPrimitive.Arrow;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuArrow,
  ContextMenuPrimitive,
};
