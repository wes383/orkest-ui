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
import { WheelPicker } from "@/components/ui/wheel-picker";
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

export interface DateTimePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Must evenly divide 60. @default 1 */
  minuteStep?: number;
  /** Override 12-hour detection; defaults to the browser language. */
  use12Hour?: boolean;
  placeholder?: string;
  /** Trigger size. Omit to follow the global density tier. */
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

// Row height follows the WheelPicker density default, so the wheel densifies
// along with the rest of the UI in compact mode.
const VISIBLE_COUNT = 5;

function isoToDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
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
      minuteStep: minuteStepProp = 1,
      use12Hour: use12HourProp,
      placeholder,
      size,
      disabled,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const minuteStep = normalizeMinuteStep("DateTimePicker", minuteStepProp);

    const [valueIso, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue: defaultValue,
      onChange,
    });
    const valueDate = isoToDate(valueIso);
    const t = useT();

    const auto12Hour = useDefault12Hour();
    const use12Hour = use12HourProp ?? auto12Hour;

    const [open, setOpen] = React.useState(false);
    const { triggerRef, container } = usePopoverContainer();

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

    const handleConfirm = React.useCallback(() => {
      if (!draftDate) {
        setOpen(false);
        return;
      }
      const merged = new Date(draftDate);
      merged.setHours(draftHour, draftMinute, 0, 0);
      setValue(merged.toISOString());
      setOpen(false);
    }, [draftDate, draftHour, draftMinute, setValue]);

    const handleClear = React.useCallback(() => {
      setValue(undefined);
      setDraftDate(undefined);
      setOpen(false);
    }, [setValue]);

    const disabledConfig = React.useMemo(() => {
      type DayPickerProps = React.ComponentProps<typeof DayPicker>;
      type Matcher = NonNullable<DayPickerProps["disabled"]>;
      if (!minDate && !maxDate) return undefined;
      const m: Record<string, Date> = {};
      if (minDate) m.before = minDate;
      if (maxDate) m.after = maxDate;
      return m as unknown as Matcher;
    }, [minDate, maxDate]);

    const hourItems = React.useMemo(() => buildHourItems(use12Hour), [use12Hour]);
    const minuteItems = React.useMemo(
      () => buildMinuteItems(minuteStep),
      [minuteStep]
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

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PickerTrigger
            ref={triggerRef}
            inputRef={ref}
            value={valueIso ?? ""}
            icon={<CalendarIcon />}
            displayValue={displayValue}
            placeholder={placeholder || "—"}
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
                  visibleCount={VISIBLE_COUNT}
                  className="w-12"
                />
                {use12Hour && (
                  <WheelPicker
                    aria-label="AM / PM"
                    items={PERIOD_ITEMS}
                    value={isPM ? "PM" : "AM"}
                    onChange={handlePeriodChange}
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
