"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { WheelPicker, type WheelPickerItem } from "@/components/ui/wheel-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useT } from "@/components/language-provider";
import { cn } from "@/lib/utils";

/**
 * TimePicker — iOS-style wheel time picker.
 *
 * - Trigger is a read-only input (readonly input + clock icon); click opens a Popover.
 * - Popover contains two WheelPicker columns: hour and minute.
 * - 12/24-hour mode is controlled by the `use12Hour` prop, defaulting to follow `<html lang>`
 *   (`en` → 12-hour + AM/PM column, otherwise → 24-hour).
 * - `minuteStep` controls the minute step (must evenly divide 60), default 1.
 * - Controlled value format: "HH:mm" (24-hour string, consistent with `<input type="time">`).
 * - Supports both controlled (value + onChange) and uncontrolled (defaultValue) usage.
 *
 * @example
 * // Controlled
 * const [time, setTime] = useState("09:30");
 * <TimePicker value={time} onChange={setTime} />
 *
 * // Follow language
 * <TimePicker defaultValue="14:30" />  // English pages auto-switch to 12h + AM/PM
 */

export interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type" | "size"> {
  /** Controlled value, format "HH:mm" (24-hour). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Value change callback; receives an "HH:mm" string. */
  onChange?: (value: string) => void;
  /** Minute step; must evenly divide 60. @default 1 */
  minuteStep?: number;
  /** Whether to use 12-hour mode + AM/PM column. Omit to follow `<html lang>`. */
  use12Hour?: boolean;
  /** Size variant of the Popover trigger. */
  size?: "sm" | "md" | "lg";
}

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 5;

/** Parse an "HH:mm" string into { hour, minute }. */
function parseTime(value: string | undefined): { hour: number; minute: number } {
  if (!value) return { hour: 9, minute: 0 };
  const m = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!m) return { hour: 9, minute: 0 };
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return { hour: 9, minute: 0 };
  return {
    hour: Math.max(0, Math.min(23, h)),
    minute: Math.max(0, Math.min(59, min)),
  };
}

/**
 * Detect whether 12-hour mode should be used by default.
 *
 * Per requirements: judge **only** by the browser's preferred language
 * (`navigator.language`) BCP-47 tag, without considering OS locale settings.
 *
 * - `en-*` / `es-*` / `ar-*` / `hi-*` etc. (languages that conventionally use 12-hour) return true
 * - `zh-*` / `ja-*` / `ko-*` / `de-*` / `fr-*` etc. (languages that conventionally use 24-hour) return false
 *
 * Returns false during SSR (default 24h).
 */
function detectDefault12Hour(): boolean {
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

/** Format an "HH:mm" string into a display string via Intl.DateTimeFormat. */
function formatDisplay(value: string | undefined, use12Hour: boolean): string {
  if (!value) return "";
  const { hour, minute } = parseTime(value);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  // Use en-US locale on both server and client for a stable format, avoiding hydration mismatch
  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: use12Hour,
  });
  return fmt.format(date);
}

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue,
      onChange,
      minuteStep = 1,
      use12Hour: use12HourProp,
      size = "md",
      disabled,
      placeholder = "HH:mm",
      ...props
    },
    ref
  ) => {
    if (minuteStep <= 0 || 60 % minuteStep !== 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[TimePicker] minuteStep must evenly divide 60, got ${minuteStep}, falling back to 1.`
        );
      }
      minuteStep = 1;
    }

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue ?? ""
    );
    const value = isControlled ? (valueProp as string) : internalValue;
    const t = useT();

    const [auto12Hour] = React.useState(detectDefault12Hour);
    const use12Hour = use12HourProp ?? auto12Hour;

    const [open, setOpen] = React.useState(false);
    const { hour, minute } = parseTime(value);

    const commit = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    // Controlled value is read directly each render, so no extra sync state is needed.
    const hourItems: WheelPickerItem[] = React.useMemo(() => {
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
    }, [use12Hour]);

    const minuteItems: WheelPickerItem[] = React.useMemo(() => {
      const arr: WheelPickerItem[] = [];
      for (let m = 0; m < 60; m += minuteStep) {
        arr.push({ value: m, label: String(m).padStart(2, "0") });
      }
      return arr;
    }, [minuteStep]);

    const periodItems: WheelPickerItem[] = React.useMemo(
      () => [
        { value: "AM", label: "AM" },
        { value: "PM", label: "PM" },
      ],
      []
    );

    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const currentPeriod = hour < 12 ? "AM" : "PM";

    const handleHourChange = React.useCallback(
      (next: string | number) => {
        const nextH = Number(next);
        let newHour = nextH;
        if (use12Hour) {
          // In 12-hour mode, restore to 24-hour based on AM/PM
          const isPM = hour >= 12;
          if (isPM && nextH !== 12) newHour = nextH + 12;
          else if (!isPM && nextH === 12) newHour = 0;
          else if (isPM && nextH === 12) newHour = 12;
          else newHour = nextH;
        }
        commit(
          `${String(newHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      },
      [use12Hour, hour, minute, commit]
    );

    const handleMinuteChange = React.useCallback(
      (next: string | number) => {
        const nextMin = Number(next);
        commit(
          `${String(hour).padStart(2, "0")}:${String(nextMin).padStart(2, "0")}`
        );
      },
      [hour, commit]
    );

    const handlePeriodChange = React.useCallback(
      (next: string | number) => {
        let newHour = hour;
        if (next === "PM" && hour < 12) newHour = hour + 12;
        else if (next === "AM" && hour >= 12) newHour = hour - 12;
        commit(
          `${String(newHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      },
      [hour, minute, commit]
    );

    const displayValue = formatDisplay(value, use12Hour);

    const heightClass =
      size === "sm" ? "h-10" : size === "lg" ? "h-14" : "h-12";

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative flex items-center w-full bg-surface border rounded-lg text-base text-foreground transition-colors duration-base",
              "border-border focus-within:border-border-strong",
              disabled && "bg-hover-bg cursor-not-allowed opacity-60",
              "cursor-pointer",
              heightClass,
              className
            )}
            // Make the div behave like an input: focusable and activatable by a label
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-disabled={disabled || undefined}
          >
            {/* Hidden real input: carries the form value and name attribute for native form submission */}
            <input
              ref={ref}
              type="hidden"
              value={value}
              disabled={disabled}
              {...props}
            />
            <Clock
              className="pointer-events-none absolute left-3 h-4 w-4 text-foreground-subtle"
              aria-hidden="true"
            />
            <span
              className={cn(
                "pl-10 pr-3 flex-1 truncate",
                !displayValue && "text-foreground-subtle"
              )}
            >
              {displayValue || placeholder}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-3"
          // The wheel popover does not need the default padding
        >
          <div className="flex items-center justify-center gap-2">
            <WheelPicker
              aria-label="Hour"
              items={hourItems}
              value={use12Hour ? hour12 : hour}
              onChange={handleHourChange}
              itemHeight={ITEM_HEIGHT}
              visibleCount={VISIBLE_COUNT}
              className="w-12"
            />
            <span
              aria-hidden="true"
              className="text-foreground-muted font-medium select-none"
            >
              :
            </span>
            <WheelPicker
              aria-label="Minute"
              items={minuteItems}
              value={minute}
              onChange={handleMinuteChange}
              itemHeight={ITEM_HEIGHT}
              visibleCount={VISIBLE_COUNT}
              className="w-12"
            />
            {use12Hour && (
              <WheelPicker
                aria-label="AM / PM"
                items={periodItems}
                value={currentPeriod}
                onChange={handlePeriodChange}
                itemHeight={ITEM_HEIGHT}
                visibleCount={VISIBLE_COUNT}
                className="w-14"
              />
            )}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              {t("dateTimePicker.ok")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

TimePicker.displayName = "TimePicker";
