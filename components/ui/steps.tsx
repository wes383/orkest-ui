"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";
type StepState = "waiting" | "active" | "complete";

interface StepsContextValue {
  current: number;
  orientation: Orientation;
  total: number;
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
}

/**
 * Steps container. Iterates children once with React.Children.map and injects
 * a stable index via cloneElement, so the index/state computation is
 * deterministic and identical on server and client (avoids hydration mismatch
 * that occurs with mutable counter refs during render).
 */
export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  (
    { current = 0, orientation = "horizontal", className, children, ...props },
    ref
  ) => {
    const total = React.Children.count(children);

    const contextValue = React.useMemo<StepsContextValue>(
      () => ({ current, orientation, total }),
      [current, orientation, total]
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
        };
        return (
          <StepItemContext.Provider value={itemCtx}>
            {child}
          </StepItemContext.Provider>
        );
      });
    }, [children, current, orientation, total]);

    return (
      <StepsContext.Provider value={contextValue}>
        <div
          ref={ref}
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
  extends React.HTMLAttributes<HTMLDivElement> {}

export const StepIndicator = React.forwardRef<
  HTMLDivElement,
  StepIndicatorProps
>(({ className, children, ...props }, ref) => {
  const { state, index } = useStepItemContext();
  return (
    <div
      ref={ref}
      data-state={state}
      className={cn(
        "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium border-2 transition-colors duration-base ease-out z-[1]",
        "data-[state=waiting]:border-border data-[state=waiting]:text-foreground-subtle data-[state=waiting]:bg-background",
        "data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-background",
        "data-[state=complete]:bg-accent data-[state=complete]:text-accent-fg data-[state=complete]:border-accent",
        className
      )}
      {...props}
    >
      {children ?? (state === "complete" ? <Check className="h-4 w-4" /> : index + 1)}
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
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const StepLabel = React.forwardRef<HTMLSpanElement, StepLabelProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
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
  const { state, isLast, orientation } = useStepItemContext();
  if (isLast) return null;
  return (
    <div
      ref={ref}
      data-state={state}
      aria-hidden="true"
      className={cn(
        "transition-colors duration-base ease-out bg-border data-[state=complete]:bg-accent",
        orientation === "horizontal"
          ? "flex-1 h-px mx-3 min-w-4"
          : "self-center w-px my-1 min-h-4",
        className
      )}
      {...props}
    />
  );
});
StepSeparator.displayName = "StepSeparator";

export { type Orientation, type StepState };
