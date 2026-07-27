"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { WheelPicker, type WheelPickerItem } from "@/components/ui/wheel-picker";
import { useT } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export interface DateTimePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Must evenly divide 60. @default 1 */
  minuteStep?: number;
  /** Override 12-hour detection; defaults to navigator.language. */
  use12Hour?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 5;

function isoToDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// Detect 12-hour default from browser language only (not OS locale).
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

function formatDisplay(date: Date | undefined, use12Hour: boolean): string {
  if (!date) return "";
  const lang =
    typeof document !== "undefined"
      ? document.documentElement.lang || "en"
      : "en";
  const locale = lang.startsWith("zh") ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: use12Hour,
  }).format(date);
}

function resolveHour(hour12: number, isPM: boolean): number {
  if (hour12 === 12) return isPM ? 12 : 0;
  return isPM ? hour12 + 12 : hour12;
}

export const DateTimePicker = React.forwardRef<
  HTMLInputElement,
  DateTimePickerProps
>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      minuteStep = 1,
      use12Hour: use12HourProp,
      placeholder,
      size = "md",
      disabled,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    if (minuteStep <= 0 || 60 % minuteStep !== 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[DateTimePicker] minuteStep must evenly divide 60, got ${minuteStep}, falling back to 1.`
        );
      }
      minuteStep = 1;
    }

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string | undefined>(
      defaultValue
    );
    const valueIso = isControlled ? valueProp : internalValue;
    const valueDate = isoToDate(valueIso);
    const t = useT();

    const [auto12Hour] = React.useState(detectDefault12Hour);
    const use12Hour = use12HourProp ?? auto12Hour;

    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const [dialogContainer, setDialogContainer] =
      React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
      setDialogContainer(
        triggerRef.current?.closest('[role="dialog"]') as HTMLElement | null
      );
    }, []);

    // Draft state: edit date/time locally, commit only on "OK".
    const [draftDate, setDraftDate] = React.useState<Date | undefined>(
      valueDate
    );
    const [draftHour, setDraftHour] = React.useState<number>(
      valueDate?.getHours() ?? 9
    );
    const [draftMinute, setDraftMinute] = React.useState<number>(
      valueDate?.getMinutes() ?? 0
    );

    React.useEffect(() => {
      if (open) {
        setDraftDate(valueDate);
        setDraftHour(valueDate?.getHours() ?? 9);
        setDraftMinute(valueDate?.getMinutes() ?? 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const commit = React.useCallback(
      (nextIso: string | undefined) => {
        if (!isControlled) setInternalValue(nextIso);
        onChange?.(nextIso);
      },
      [isControlled, onChange]
    );

    const handleConfirm = React.useCallback(() => {
      if (!draftDate) {
        setOpen(false);
        return;
      }
      const merged = new Date(draftDate);
      merged.setHours(draftHour, draftMinute, 0, 0);
      commit(merged.toISOString());
      setOpen(false);
    }, [draftDate, draftHour, draftMinute, commit]);

    const handleClear = React.useCallback(() => {
      commit(undefined);
      setDraftDate(undefined);
      setOpen(false);
    }, [commit]);

    const disabledConfig = React.useMemo(() => {
      type DayPickerProps = React.ComponentProps<typeof DayPicker>;
      type Matcher = NonNullable<DayPickerProps["disabled"]>;
      if (!minDate && !maxDate) return undefined;
      const m: Record<string, Date> = {};
      if (minDate) m.before = minDate;
      if (maxDate) m.after = maxDate;
      return m as unknown as Matcher;
    }, [minDate, maxDate]);

    const hourItems: WheelPickerItem[] = React.useMemo(() => {
      const arr: WheelPickerItem[] = [];
      const max = use12Hour ? 12 : 23;
      const start = use12Hour ? 1 : 0;
      for (let h = start; h <= max; h++) {
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

    const hour12 = draftHour === 0 ? 12 : draftHour > 12 ? draftHour - 12 : draftHour;
    const isPM = draftHour >= 12;

    const handleHourChange = React.useCallback(
      (next: string | number) => {
        const nextH = Number(next);
        if (use12Hour) {
          setDraftHour(resolveHour(nextH, isPM));
        } else {
          setDraftHour(nextH);
        }
      },
      [use12Hour, isPM]
    );

    const handleMinuteChange = React.useCallback(
      (next: string | number) => setDraftMinute(Number(next)),
      []
    );

    const handlePeriodChange = React.useCallback(
      (next: string | number) => {
        const nextIsPM = next === "PM";
        setDraftHour(resolveHour(hour12, nextIsPM));
      },
      [hour12]
    );

    const displayValue = formatDisplay(valueDate, use12Hour);
    const heightClass =
      size === "sm" ? "h-10" : size === "lg" ? "h-14" : "h-12";

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={triggerRef}
            className={cn(
              "relative flex items-center w-full bg-surface border rounded-lg text-base text-foreground transition-colors duration-base cursor-pointer",
              "border-border focus-within:border-border-strong",
              disabled && "bg-hover-bg cursor-not-allowed opacity-60",
              heightClass,
              className
            )}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={ariaLabel}
            aria-disabled={disabled || undefined}
          >
            <input
              ref={ref}
              type="hidden"
              value={valueIso ?? ""}
              disabled={disabled}
            />
            <CalendarIcon
              className="pointer-events-none absolute left-3 h-4 w-4 text-foreground-subtle"
              aria-hidden="true"
            />
            <span
              className={cn(
                "pl-10 pr-3 flex-1 truncate",
                !displayValue && "text-foreground-subtle"
              )}
            >
              {displayValue || placeholder || "—"}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          container={dialogContainer}
          className="w-auto p-0"
        >
          <div className="flex flex-col sm:flex-row">
            <div>
              <Calendar
                mode="single"
                selected={draftDate}
                onSelect={(d) => d && setDraftDate(d)}
                disabled={disabledConfig}
              />
            </div>
            <div className="flex flex-col p-3">
              <div className="flex items-center justify-center gap-2">
                <WheelPicker
                  aria-label="Hour"
                  items={hourItems}
                  value={use12Hour ? hour12 : draftHour}
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
                  value={draftMinute}
                  onChange={handleMinuteChange}
                  itemHeight={ITEM_HEIGHT}
                  visibleCount={VISIBLE_COUNT}
                  className="w-12"
                />
                {use12Hour && (
                  <WheelPicker
                    aria-label="AM / PM"
                    items={periodItems}
                    value={isPM ? "PM" : "AM"}
                    onChange={handlePeriodChange}
                    itemHeight={ITEM_HEIGHT}
                    visibleCount={VISIBLE_COUNT}
                    className="w-14"
                  />
                )}
              </div>
              <div className="mt-3 flex justify-between gap-2">
                <Button size="sm" variant="ghost" onClick={handleClear}>
                  {t("dateTimePicker.clear")}
                </Button>
                <Button size="sm" onClick={handleConfirm}>
                  {t("dateTimePicker.ok")}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
