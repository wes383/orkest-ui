import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const sizeMap = {
  xs: "h-5 w-5",
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-24 w-24",
} as const;

const textMap = {
  xs: "text-[8px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
  "2xl": "text-3xl",
} as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  name?: string;
  size?: keyof typeof sizeMap;
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, alt, name, size = "md", fallback, ...props }, ref) => {
  const initials = name ? getInitials(name) : "";
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-hover-bg-strong",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt ?? name ?? ""}
          className="h-full w-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center font-medium text-foreground-muted",
          textMap[size]
        )}
        delayMs={src ? 300 : 0}
      >
        {fallback ?? initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visible = max ? childrenArray.slice(0, max) : childrenArray;
    const overflow = max ? Math.max(0, childrenArray.length - max) : 0;

    return (
      <div ref={ref} className={cn("inline-flex items-center", className)} {...props}>
        {visible.map((child, i) => {
          if (!React.isValidElement(child)) {
            return <span key={i}>{child}</span>;
          }
          return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
            key: i,
            className: cn(
              "border-2 border-surface",
              i !== 0 && "-ml-2",
              (child.props as { className?: string })?.className
            ),
          });
        })}
        {overflow > 0 && (
          <Avatar
            key="overflow"
            size="md"
            fallback={`+${overflow}`}
            className="border-2 border-surface -ml-2"
          />
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";
