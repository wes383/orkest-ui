import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Row density tiers shared by Menu, MenuItem and MenuLabel. */
export type MenuDensity = Density;

const menuItemVariants = cva(
  "flex items-center rounded-md text-sm cursor-pointer select-none transition-colors",
  {
    variants: {
      density: {
        compact: "gap-2 px-2 py-1",
        default: "gap-3 px-3 py-2",
        comfortable: "gap-3 px-3 py-2.5",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
);

const menuLabelVariants = cva(
  "text-xs font-medium tracking-wide text-foreground-muted",
  {
    variants: {
      density: {
        compact: "px-2 py-1",
        default: "px-3 py-1.5",
        comfortable: "px-3 py-2",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
);

/**
 * Propagates the density set on `<Menu>` down to `<MenuItem>` / `<MenuLabel>`
 * so only the menu root needs the prop.
 */
const MenuDensityContext = React.createContext<MenuDensity>("default");

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Row density. Falls back to the surrounding density, then to "default". */
  density?: MenuDensity;
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, as: Comp = "div", density, ...props }, ref) => {
    const Element = Comp as React.ElementType;
    const globalDensity = useDensity();
    const resolvedDensity = density ?? globalDensity;
    return (
      <MenuDensityContext.Provider value={resolvedDensity}>
        <Element
          ref={ref}
          className={cn("min-w-48 bg-surface border border-border rounded-lg p-1", className)}
          {...props}
        />
      </MenuDensityContext.Provider>
    );
  }
);
Menu.displayName = "Menu";

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: MenuDensity;
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, density, ...props }, ref) => {
    const ctx = React.useContext(MenuDensityContext);
    return (
      <div
        ref={ref}
        className={cn(menuLabelVariants({ density: density ?? ctx, className }))}
        {...props}
      />
    );
  }
);
MenuLabel.displayName = "MenuLabel";

export interface MenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ className, as: Comp = "div", ...props }, ref) => {
    const Element = Comp as React.ElementType;
    return <Element ref={ref} className={cn(className)} {...props} />;
  }
);
MenuGroup.displayName = "MenuGroup";

export interface MenuItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantProps<typeof menuItemVariants>, "density"> {
  variant?: "default" | "danger";
  as?: React.ElementType;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, variant = "default", density, as: Comp = "div", ...props }, ref) => {
    const ctx = React.useContext(MenuDensityContext);
    const Element = Comp as React.ElementType;
    return (
      <Element
        ref={ref}
        data-variant={variant}
        className={cn(
          menuItemVariants({ density: density ?? ctx }),
          "hover:bg-hover-bg",
          "data-[variant=danger]:text-red data-[variant=danger]:hover:bg-red-soft",
          className
        )}
        {...props}
      />
    );
  }
);
MenuItem.displayName = "MenuItem";

export interface MenuDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuDivider = React.forwardRef<HTMLDivElement, MenuDividerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("h-px bg-border my-1", className)} {...props} />
  )
);
MenuDivider.displayName = "MenuDivider";
