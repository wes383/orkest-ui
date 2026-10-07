"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn, clamp } from "@/lib/utils";
import { useDensity, type Density } from "@/components/density-provider";

/** Size tier of the stepper shell, mirroring Input's size scale. */
export type InputNumberSize = "xs" | "sm" | "md" | "lg";

const INPUT_NUMBER_SIZE: Record<
  InputNumberSize,
  { shell: string; input: string; button: string }
> = {
  // Radius lives here so the compact tier stays a rounded rect: at h-8 an
  // --radius-lg (16px) corner would be exactly half the height (a capsule).
  xs: { shell: "h-8 rounded-md", input: "text-xs", button: "px-2" },
  sm: { shell: "h-10 rounded-lg", input: "text-sm", button: "px-2.5" },
  md: { shell: "h-12 rounded-lg", input: "text-base", button: "px-3" },
  lg: { shell: "h-14 rounded-lg", input: "text-lg", button: "px-3.5" },
};

/** Size used when no explicit `size` is given, derived from the global density. */
const INPUT_NUMBER_SIZE_FOR_DENSITY: Record<Density, InputNumberSize> = {
  compact: "xs",
  default: "md",
  comfortable: "lg",
};

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "type" | "size" | "value" | "defaultValue" | "min" | "max" | "step"
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Shell size. Omit to follow the global density tier. */
  size?: InputNumberSize;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      value,
      defaultValue = 0,
      onValueChange,
      size,
      disabled,
      ...props
    },
    ref
  ) => {
    const globalDensity = useDensity();
    const sizing = INPUT_NUMBER_SIZE[size ?? INPUT_NUMBER_SIZE_FOR_DENSITY[globalDensity]];

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(() => {
      const v = typeof defaultValue === "number" ? defaultValue : Number(defaultValue) || 0;
      return Number.isFinite(min) && Number.isFinite(max)
        ? clamp(v, min, max)
        : Number.isFinite(min)
        ? Math.max(min, v)
        : Number.isFinite(max)
        ? Math.min(max, v)
        : v;
    });

    const currentValue = isControlled
      ? typeof value === "number"
        ? value
        : Number(value) || 0
      : internalValue;

    const update = (next: number) => {
      let clamped = next;
      if (Number.isFinite(min)) clamped = Math.max(min, clamped);
      if (Number.isFinite(max)) clamped = Math.min(max, clamped);
      if (!isControlled) setInternalValue(clamped);
      onValueChange?.(clamped);
    };

    const stepBy = (direction: 1 | -1) => {
      const next = currentValue + direction * step;
      update(next);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === "") {
        update(Number.isFinite(min) ? min : 0);
        return;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) return;
      update(num);
    };

    const isMinDisabled = disabled || (Number.isFinite(min) && currentValue <= min);
    const isMaxDisabled = disabled || (Number.isFinite(max) && currentValue >= max);

    return (
      <div
        className={cn(
          "flex items-stretch overflow-hidden border border-border bg-surface",
          sizing.shell,
          disabled && "opacity-60",
          className
        )}
      >
        <button
          type="button"
          onClick={() => stepBy(-1)}
          disabled={isMinDisabled}
          className={cn(
            "flex items-center justify-center hover:bg-hover-bg disabled:pointer-events-none disabled:opacity-40 transition-colors text-foreground-muted",
            sizing.button
          )}
          aria-label="Decrease"
          tabIndex={-1}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          ref={ref}
          type="number"
          inputMode="numeric"
          value={currentValue}
          min={Number.isFinite(min) ? min : undefined}
          max={Number.isFinite(max) ? max : undefined}
          step={step}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            "w-full min-w-0 border-0 bg-transparent text-center text-foreground outline-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            sizing.input
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => stepBy(1)}
          disabled={isMaxDisabled}
          className={cn(
            "flex items-center justify-center hover:bg-hover-bg disabled:pointer-events-none disabled:opacity-40 transition-colors text-foreground-muted",
            sizing.button
          )}
          aria-label="Increase"
          tabIndex={-1}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }
);
InputNumber.displayName = "InputNumber";

export { InputNumber };
