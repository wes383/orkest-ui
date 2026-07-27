import * as React from "react";
import { cn } from "@/lib/utils";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, as: Comp = "div", ...props }, ref) => {
    const Element = Comp as React.ElementType;
    return (
      <Element
        ref={ref}
        className={cn("min-w-48 bg-surface border border-border rounded-lg p-1", className)}
        {...props}
      />
    );
  }
);
Menu.displayName = "Menu";

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-3 py-1.5 text-xs font-medium tracking-wide text-foreground-muted",
        className
      )}
      {...props}
    />
  )
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
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger";
  as?: React.ElementType;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, variant = "default", as: Comp = "div", ...props }, ref) => {
    const Element = Comp as React.ElementType;
    return (
      <Element
        ref={ref}
        data-variant={variant}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer select-none transition-colors",
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
