"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { WheelPicker } from "@/components/ui/wheel-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PickerTrigger,
  useControllableState,
  useDefault12Hour,
  usePopoverContainer,
  normalizeMinuteStep,
  resolveHour,
  buildHourItems,
  buildMinuteItems,
  PERIOD_ITEMS,
} from "@/components/ui/picker-shared";
import { useT } from "@/components/language-provider";

/**
 * TimePicker — iOS-style wheel time picker.
 *
 * - Trigger is a field-style div (role="combobox") + hidden input for forms; click opens a Popover.
 * - Popover contains two WheelPicker columns: hour and minute.
 * - 12/24-hour mode is controlled by the `use12Hour` prop, defaulting to the browser language
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
  /** Whether to use 12-hour mode + AM/PM column. Omit to follow the browser language. */
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
      minuteStep: minuteStepProp = 1,
      use12Hour: use12HourProp,
      size = "md",
      disabled,
      placeholder = "HH:mm",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const minuteStep = normalizeMinuteStep("TimePicker", minuteStepProp);

    const [value, setValue] = useControllableState<string>({
      value: valueProp,
      defaultValue: defaultValue ?? "",
      onChange,
    });
    const t = useT();

    const auto12Hour = useDefault12Hour();
    const use12Hour = use12HourProp ?? auto12Hour;

    const [open, setOpen] = React.useState(false);
    const { triggerRef, container } = usePopoverContainer();
    const { hour, minute } = parseTime(value);

    const hourItems = React.useMemo(() => buildHourItems(use12Hour), [use12Hour]);
    const minuteItems = React.useMemo(
      () => buildMinuteItems(minuteStep),
      [minuteStep]
    );

    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const currentPeriod = hour < 12 ? "AM" : "PM";

    const handleHourChange = React.useCallback(
      (next: string | number) => {
        const nextH = Number(next);
        // In 12-hour mode, restore to 24-hour based on AM/PM
        const newHour = use12Hour ? resolveHour(nextH, hour >= 12) : nextH;
        setValue(
          `${String(newHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      },
      [use12Hour, hour, minute, setValue]
    );

    const handleMinuteChange = React.useCallback(
      (next: string | number) => {
        setValue(
          `${String(hour).padStart(2, "0")}:${String(Number(next)).padStart(2, "0")}`
        );
      },
      [hour, setValue]
    );

    const handlePeriodChange = React.useCallback(
      (next: string | number) => {
        let newHour = hour;
        if (next === "PM" && hour < 12) newHour = hour + 12;
        else if (next === "AM" && hour >= 12) newHour = hour - 12;
        setValue(
          `${String(newHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      },
      [hour, minute, setValue]
    );

    const displayValue = formatDisplay(value, use12Hour);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PickerTrigger
            ref={triggerRef}
            inputRef={ref}
            inputProps={props}
            value={value}
            icon={<Clock />}
            displayValue={displayValue}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
            open={open}
            aria-label={ariaLabel}
            className={className}
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          container={container}
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
                items={PERIOD_ITEMS}
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
