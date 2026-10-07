"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

type Orientation = "horizontal" | "vertical";
type StepState = "waiting" | "active" | "complete";

/** Density tiers shared by Steps and its indicators / labels. */
export type StepsDensity = Density;

const stepIndicatorVariants = {
  compact: "h-6 w-6 text-xs",
  default: "h-8 w-8 text-sm",
  comfortable: "h-9 w-9 text-sm",
} as const;

const stepSeparatorSpacing = {
  compact: { horizontal: "mx-2", vertical: "my-0.5" },
  default: { horizontal: "mx-3", vertical: "my-1" },
  comfortable: { horizontal: "mx-4", vertical: "my-1.5" },
} as const;

interface StepsContextValue {
  current: number;
  orientation: Orientation;
  total: number;
  density: StepsDensity;
}

const StepsContext = React.createContext<StepsContextValue | null>(null);

function useStepsContext() {
  const ctx = React.useContext(StepsContext);
  if (!ctx) {
    throw new Error("Step subcomponents must be used within <Steps>");
  }
  return ctx;
}

interface StepItemContextValue {
  index: number;
  state: StepState;
  isLast: boolean;
  orientation: Orientation;
  density: StepsDensity;
}

const StepItemContext = React.createContext<StepItemContextValue | null>(null);

function useStepItemContext() {
  const ctx = React.useContext(StepItemContext);
  if (!ctx) {
    throw new Error(
      "StepIndicator / StepSeparator / StepIcon must be used within <Step>"
    );
  }
  return ctx;
}

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 0-indexed active step.
   * - Steps with index < current are "complete"
   * - Step with index === current is "active"
   * - Steps with index > current are "waiting"
   * - When current >= total, all steps are "complete"
   */
  current?: number;
  orientation?: Orientation;
  /** Density for the whole step set. Falls back to the surrounding density. */
  density?: StepsDensity;
}

/**
 * Steps container. Iterates children once with React.Children.map and injects
 * a stable index via cloneElement, so the index/state computation is
 * deterministic and identical on server and client (avoids hydration mismatch
 * that occurs with mutable counter refs during render).
 */
export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  (
    {
      current = 0,
      orientation = "horizontal",
      density,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const globalDensity = useDensity();
    const resolvedDensity = density ?? globalDensity;
    const total = React.Children.count(children);

    const contextValue = React.useMemo<StepsContextValue>(
      () => ({ current, orientation, total, density: resolvedDensity }),
      [current, orientation, total, resolvedDensity]
    );

    const items = React.useMemo(() => {
      let i = 0;
      return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const index = i++;
        const state: StepState =
          index < current
            ? "complete"
            : index === current
              ? "active"
              : "waiting";
        const isLast = index === total - 1;
        const itemCtx: StepItemContextValue = {
          index,
          state,
          isLast,
          orientation,
          density: resolvedDensity,
        };
        return (
          <StepItemContext.Provider value={itemCtx}>
            {child}
          </StepItemContext.Provider>
        );
      });
    }, [children, current, orientation, total, resolvedDensity]);

    return (
      <StepsContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="list"
          className={cn(
            "flex",
            orientation === "horizontal" ? "flex-row items-start" : "flex-col items-stretch",
            className
          )}
          {...props}
        >
          {items}
        </div>
      </StepsContext.Provider>
    );
  }
);
Steps.displayName = "Steps";

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Step layout:
 * - Horizontal: a row with [content | horizontal connector]
 *   The connector (StepSeparator) extends to the right to the next step.
 * - Vertical: a column with [content | vertical connector]
 *   The connector extends downward to the next step.
 */
export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useStepsContext();
    const itemCtx = useStepItemContext();
    const { state, index, isLast } = itemCtx;

    return (
      <div
        ref={ref}
        role="listitem"
        aria-current={state === "active" ? "step" : undefined}
        data-state={state}
        data-index={index}
        className={cn(
          "flex",
          ctx.orientation === "horizontal"
            ? "flex-row items-center"
            : "w-full flex-col items-stretch",
          className
        )}
        {...props}
      >
        <StepItemContext.Provider value={itemCtx}>
          {children}
        </StepItemContext.Provider>
      </div>
    );
  }
);
Step.displayName = "Step";

/** StepItem — alias for {@link Step}. Provided so consumers can use either name. */
export const StepItem = Step;
StepItem.displayName = "StepItem";

export interface StepIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Overrides the density inherited from `<Steps>`. */
  density?: StepsDensity;
}

export const StepIndicator = React.forwardRef<
  HTMLDivElement,
  StepIndicatorProps
>(({ className, density, children, ...props }, ref) => {
  const { state, index, density: ctxDensity } = useStepItemContext();
  const resolved = density ?? ctxDensity;
  return (
    <div
      ref={ref}
      data-state={state}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-medium border-2 transition-colors duration-base ease-out z-[1]",
        stepIndicatorVariants[resolved],
        "data-[state=waiting]:border-border data-[state=waiting]:text-foreground-subtle data-[state=waiting]:bg-background",
        "data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-background",
        "data-[state=complete]:bg-accent data-[state=complete]:text-accent-fg data-[state=complete]:border-accent",
        className
      )}
      {...props}
    >
      {children ??
        (state === "complete" ? (
          <Check className={resolved === "compact" ? "h-3 w-3" : "h-4 w-4"} />
        ) : (
          index + 1
        ))}
    </div>
  );
});
StepIndicator.displayName = "StepIndicator";

export interface StepIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const StepIcon = React.forwardRef<HTMLSpanElement, StepIconProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("flex h-4 w-4 items-center justify-center", className)}
      {...props}
    />
  )
);
StepIcon.displayName = "StepIcon";

export interface StepLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Overrides the density inherited from `<Steps>`. */
  density?: StepsDensity;
}

export const StepLabel = React.forwardRef<HTMLSpanElement, StepLabelProps>(
  ({ className, density, ...props }, ref) => {
    const ctx = useStepItemContext();
    const resolved = density ?? ctx.density;
    return (
      <span
        ref={ref}
        className={cn(
          "font-medium text-foreground",
          resolved === "compact" ? "text-xs" : "text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
StepLabel.displayName = "StepLabel";

export interface StepDescriptionProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const StepDescription = React.forwardRef<
  HTMLSpanElement,
  StepDescriptionProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-foreground-muted mt-0.5", className)}
    {...props}
  />
));
StepDescription.displayName = "StepDescription";

/**
 * Connector line between steps.
 * - Horizontal mode: a horizontal line extending to the right of the step content.
 * - Vertical mode: a vertical line extending downward from the step content.
 * Hidden for the last step.
 */
export interface StepSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const StepSeparator = React.forwardRef<
  HTMLDivElement,
  StepSeparatorProps
>(({ className, ...props }, ref) => {
  const { state, isLast, orientation, density } = useStepItemContext();
  if (isLast) return null;
  const spacing = stepSeparatorSpacing[density];
  return (
    <div
      ref={ref}
      data-state={state}
      aria-hidden="true"
      className={cn(
        "transition-colors duration-base ease-out bg-border data-[state=complete]:bg-accent",
        orientation === "horizontal"
          ? cn("flex-1 h-px min-w-4", spacing.horizontal)
          : cn("self-center w-px min-h-4", spacing.vertical),
        className
      )}
      {...props}
    />
  );
});
StepSeparator.displayName = "StepSeparator";

export { type Orientation, type StepState };
