import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  FileQuestion,
  Lock,
  ServerCrash,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const resultIconVariants = cva("h-12 w-12", {
  variants: {
    status: {
      success: "text-green",
      error: "text-red",
      warning: "text-orange",
      info: "text-blue",
      "404": "text-foreground-faint",
      "403": "text-foreground-faint",
      "500": "text-foreground-faint",
    },
  },
  defaultVariants: {
    status: "info",
  },
});

const iconMap: Record<NonNullable<ResultProps["status"]>, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  "404": FileQuestion,
  "403": Lock,
  "500": ServerCrash,
};

export interface ResultProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "success" | "error" | "warning" | "info" | "404" | "403" | "500";
}

export const Result = React.forwardRef<HTMLDivElement, ResultProps>(
  ({ className, status = "info", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8",
        className
      )}
      {...props}
    >
      <ResultIcon status={status} />
      {children}
    </div>
  )
);
Result.displayName = "Result";

export interface ResultIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof resultIconVariants> {
  icon?: LucideIcon;
}

export const ResultIcon = React.forwardRef<HTMLDivElement, ResultIconProps>(
  ({ className, status = "info", icon: CustomIcon, ...props }, ref) => {
    const Icon = CustomIcon ?? iconMap[status ?? "info"] ?? Info;
    return (
      <div
        ref={ref}
        className={cn("mb-4", className)}
        {...props}
      >
        <Icon className={cn(resultIconVariants({ status }))} aria-hidden="true" />
      </div>
    );
  }
);
ResultIcon.displayName = "ResultIcon";

export interface ResultTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const ResultTitle = React.forwardRef<
  HTMLHeadingElement,
  ResultTitleProps
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        "font-display text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
});
ResultTitle.displayName = "ResultTitle";

export interface ResultSubtitleProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ResultSubtitle = React.forwardRef<
  HTMLParagraphElement,
  ResultSubtitleProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-foreground-muted mt-2", className)}
      {...props}
    />
  );
});
ResultSubtitle.displayName = "ResultSubtitle";

export interface ResultActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ResultActions = React.forwardRef<
  HTMLDivElement,
  ResultActionsProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 mt-6", className)}
      {...props}
    />
  );
});
ResultActions.displayName = "ResultActions";
