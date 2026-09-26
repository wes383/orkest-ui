"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { WheelPickerItem } from "@/components/ui/wheel-picker";
import { useControllableState } from "@/hooks/use-controllable-state";

/**
 * Shared building blocks for field-like pickers (DatePicker / TimePicker /
 * DateTimePicker): trigger styling, hidden input, controlled-state wiring,
 * and the hour/minute/period item builders for WheelPicker columns.
 *
 * Height values correspond one-to-one with inputVariants sizes in input.tsx.
 */

export type PickerSize = "sm" | "md" | "lg";

const fieldTriggerVariants = cva(
  "relative flex items-center w-full bg-surface border rounded-lg text-base text-foreground transition-colors duration-base cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-10",
        md: "h-12",
        lg: "h-14",
      },
      state: {
        default: "border-border focus-within:border-border-strong",
        disabled: "border-border bg-hover-bg cursor-not-allowed opacity-60",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface PickerTriggerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Ref for the hidden input that carries the form value. */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Extra attributes forwarded to the hidden input (name, required, etc.). */
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "type" | "disabled" | "ref"
  >;
  /** Serialized value carried by the hidden input for native form submission. */
  value?: string;
  /** Leading icon, rendered at a fixed 16px size. */
  icon: React.ReactNode;
  displayValue: string;
  placeholder?: string;
  size?: PickerSize;
  disabled?: boolean;
  open?: boolean;
}

/**
 * Shared combobox-style trigger: visible div (role="combobox", receives the
 * accessible label) + hidden input (carries the form value).
 */
export const PickerTrigger = React.forwardRef<HTMLDivElement, PickerTriggerProps>(
  (
    {
      inputRef,
      inputProps,
      value,
      icon,
      displayValue,
      placeholder,
      size = "md",
      disabled,
      open,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          fieldTriggerVariants({
            size,
            state: disabled ? "disabled" : "default",
          }),
          className
        )}
        // Make the div behave like an input: focusable and activatable by a label
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-disabled={disabled || undefined}
        {...props}
      >
        <input
          ref={inputRef}
          type="hidden"
          value={value ?? ""}
          disabled={disabled}
          {...inputProps}
        />
        <span
          className="pointer-events-none absolute left-3 flex items-center justify-center text-foreground-subtle [&>svg]:h-4 [&>svg]:w-4"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span
          className={cn(
            "pl-10 pr-3 flex-1 truncate",
            !displayValue && "text-foreground-subtle"
          )}
        >
          {displayValue || placeholder}
        </span>
      </div>
    );
  }
);
PickerTrigger.displayName = "PickerTrigger";

/**
 * Detect whether 12-hour mode should be used by default.
 *
 * Judges only by the browser's preferred language (`navigator.language`)
 * BCP-47 tag: `en-*` / `es-*` / `ar-*` etc. use 12-hour; `zh-*` / `ja-*` /
 * `de-*` etc. use 24-hour. Returns false during SSR (default 24h).
 */
export function detectDefault12Hour(): boolean {
  if (typeof navigator === "undefined") return false;
  const lang = (navigator.language || "").toLowerCase();
  return (
    lang.startsWith("en") ||
    lang.startsWith("es") ||
    lang.startsWith("ar") ||
    lang.startsWith("hi") ||
    lang.startsWith("pt") ||
    lang.startsWith("ms") ||
    lang.startsWith("fil") ||
    lang.startsWith("sw")
  );
}

/** Lazily-detected 12-hour default, stable across re-renders. */
export function useDefault12Hour(): boolean {
  const [auto] = React.useState(detectDefault12Hour);
  return auto;
}

/** Validate minuteStep; warn and fall back to 1 in development. */
export function normalizeMinuteStep(component: string, minuteStep: number): number {
  if (minuteStep > 0 && 60 % minuteStep === 0) return minuteStep;
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[${component}] minuteStep must evenly divide 60, got ${minuteStep}, falling back to 1.`
    );
  }
  return 1;
}

/** Resolve a 12-hour clock value (1-12) + period into a 24-hour hour. */
export function resolveHour(hour12: number, isPM: boolean): number {
  if (hour12 === 12) return isPM ? 12 : 0;
  return isPM ? hour12 + 12 : hour12;
}

export function buildHourItems(use12Hour: boolean): WheelPickerItem[] {
  const arr: WheelPickerItem[] = [];
  const maxHour = use12Hour ? 12 : 23;
  const startHour = use12Hour ? 1 : 0;
  for (let h = startHour; h <= maxHour; h++) {
    arr.push({
      value: h,
      label: use12Hour ? String(h) : String(h).padStart(2, "0"),
    });
  }
  return arr;
}

export function buildMinuteItems(minuteStep: number): WheelPickerItem[] {
  const arr: WheelPickerItem[] = [];
  for (let m = 0; m < 60; m += minuteStep) {
    arr.push({ value: m, label: String(m).padStart(2, "0") });
  }
  return arr;
}

export const PERIOD_ITEMS: WheelPickerItem[] = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

/**
 * Locate the nearest `[role="dialog"]` ancestor so popovers opened from a
 * picker inside a dialog portal into that dialog instead of the body.
 */
export function usePopoverContainer() {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setContainer(
      triggerRef.current?.closest('[role="dialog"]') as HTMLElement | null
    );
  }, []);

  return { triggerRef, container };
}

/** Re-export so pickers share one controlled-state implementation. */
export { useControllableState };
export type { WheelPickerItem };
