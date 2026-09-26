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
import {
  PickerTrigger,
  useControllableState,
  usePopoverContainer,
} from "@/components/ui/picker-shared";
import { useT } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export type DatePickerMode = "single" | "range";

export interface DateRange {
  from: Date;
  to?: Date;
}

export interface DatePickerShortcut {
  label: string;
  getValue: () => Date | DateRange;
}

export interface DatePickerProps {
  mode?: DatePickerMode;
  value?: Date | DateRange | null;
  defaultValue?: Date | DateRange | null;
  onChange?: (value: Date | DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  shortcuts?: DatePickerShortcut[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
}

function getDefaultShortcuts(
  mode: DatePickerMode,
  t: (key: string) => string
): DatePickerShortcut[] {
  const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const addDays = (n: number) => {
    const d = today();
    d.setDate(d.getDate() + n);
    return d;
  };
  const startOfWeek = () => {
    const d = today();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  };
  const endOfWeek = () => {
    const d = startOfWeek();
    d.setDate(d.getDate() + 6);
    return d;
  };
  const startOfMonth = () => {
    const d = today();
    d.setDate(1);
    return d;
  };
  const endOfMonth = () => {
    const d = startOfMonth();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  };

  if (mode === "range") {
    return [
      {
        label: t("datePicker.thisWeek"),
        getValue: () => ({ from: startOfWeek(), to: endOfWeek() }),
      },
      {
        label: t("datePicker.lastWeek"),
        getValue: () => {
          const s = startOfWeek();
          s.setDate(s.getDate() - 7);
          const e = endOfWeek();
          e.setDate(e.getDate() - 7);
          return { from: s, to: e };
        },
      },
      {
        label: t("datePicker.thisMonth"),
        getValue: () => ({ from: startOfMonth(), to: endOfMonth() }),
      },
      {
        label: t("datePicker.lastMonth"),
        getValue: () => {
          const s = startOfMonth();
          s.setMonth(s.getMonth() - 1);
          const e = new Date(s.getFullYear(), s.getMonth() + 1, 0);
          return { from: s, to: e };
        },
      },
      {
        label: t("datePicker.last7Days"),
        getValue: () => ({ from: addDays(-6), to: today() }),
      },
      {
        label: t("datePicker.last30Days"),
        getValue: () => ({ from: addDays(-29), to: today() }),
      },
    ];
  }

  return [
    { label: t("datePicker.today"), getValue: today },
    { label: t("datePicker.yesterday"), getValue: () => addDays(-1) },
    { label: t("datePicker.tomorrow"), getValue: () => addDays(1) },
    { label: t("datePicker.startOfWeek"), getValue: startOfWeek },
    { label: t("datePicker.startOfMonth"), getValue: startOfMonth },
  ];
}

function formatDate(
  date: Date | DateRange | undefined,
  mode: DatePickerMode,
  t: (key: string) => string
): string {
  if (!date) return "";
  if (mode === "range") {
    const r = date as DateRange;
    if (!r.from) return "";
    const lang =
      typeof document !== "undefined"
        ? document.documentElement.lang || "en"
        : "en";
    const locale = lang.startsWith("zh") ? "zh-CN" : "en-US";
    const fmt = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    if (!r.to) return fmt.format(r.from);
    return `${fmt.format(r.from)} ${t("datePicker.rangeSeparator")} ${fmt.format(
      r.to
    )}`;
  }
  const d = date as Date;
  const lang =
    typeof document !== "undefined"
      ? document.documentElement.lang || "en"
      : "en";
  const locale = lang.startsWith("zh") ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      mode = "single",
      value: valueProp,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      disabledDates,
      shortcuts,
      placeholder,
      size = "md",
      disabled,
      className,
      contentClassName,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const t = useT();

    const [value, setValue] = useControllableState<
      Date | DateRange | null | undefined
    >({
      value: valueProp,
      defaultValue: defaultValue ?? undefined,
      onChange: onChange as
        | ((value: Date | DateRange | null | undefined) => void)
        | undefined,
    });

    const [open, setOpen] = React.useState(false);
    const { triggerRef, container } = usePopoverContainer();

    const finalShortcuts =
      shortcuts === undefined
        ? getDefaultShortcuts(mode, t)
        : shortcuts;

    const disabledConfig = React.useMemo(() => {
      type Matcher = NonNullable<DayPickerProps["disabled"]>;
      const arr: Exclude<Matcher, Date | ((d: Date) => boolean)>[] = [];
      if (minDate || maxDate) {
        const m: Record<string, Date> = {};
        if (minDate) m.before = minDate;
        if (maxDate) m.after = maxDate;
        arr.push(m as unknown as (typeof arr)[number]);
      }
      if (disabledDates?.length) {
        for (const d of disabledDates) arr.push(d as unknown as (typeof arr)[number]);
      }
      return arr.length ? (arr as unknown as Matcher) : undefined;
    }, [minDate, maxDate, disabledDates]);

    const commit = React.useCallback(
      (next: Date | DateRange | undefined) => {
        setValue(next);
      },
      [setValue]
    );

    const handleDayPickerSelect = React.useCallback(
      (selected: unknown) => {
        if (mode === "single") {
          commit(selected as Date | undefined);
          if (selected) setOpen(false);
        } else {
          commit(selected as DateRange | undefined);
        }
      },
      [mode, commit]
    );

    const handleShortcutClick = React.useCallback(
      (shortcut: DatePickerShortcut) => {
        const v = shortcut.getValue();
        commit(v);
        if (mode === "single") setOpen(false);
      },
      [mode, commit]
    );

    const handleClear = React.useCallback(() => {
      commit(undefined);
      if (mode === "single") setOpen(false);
    }, [mode, commit]);

    const displayValue = formatDate(value ?? undefined, mode, t);

    type DayPickerProps = React.ComponentProps<typeof DayPicker>;

    const calendarElement = mode === "single" ? (
      <Calendar
        mode="single"
        selected={value as Date | undefined}
        onSelect={(d) => handleDayPickerSelect(d)}
        disabled={disabledConfig}
        numberOfMonths={1}
      />
    ) : (
      <Calendar
        mode="range"
        selected={value as DateRange | undefined}
        onSelect={(r) => handleDayPickerSelect(r)}
        disabled={disabledConfig}
        numberOfMonths={2}
      />
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PickerTrigger
            ref={triggerRef}
            inputRef={ref}
            value={
              value
                ? mode === "single"
                  ? (value as Date).toISOString()
                  : JSON.stringify({
                      from: (value as DateRange).from?.toISOString(),
                      to: (value as DateRange).to?.toISOString(),
                    })
                : ""
            }
            icon={<CalendarIcon />}
            displayValue={displayValue}
            placeholder={placeholder || t("datePicker.today")}
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
          className={cn("w-auto p-0", contentClassName)}
        >
          <div className="flex">
            {finalShortcuts.length > 0 && (
              <div className="flex flex-col gap-1 p-2 min-w-24">
                {finalShortcuts.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleShortcutClick(s)}
                    className="text-left text-sm px-3 py-1.5 rounded-md hover:bg-hover-bg transition-colors duration-base"
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-auto text-left text-sm px-3 py-1.5 rounded-md text-foreground-muted hover:bg-hover-bg hover:text-foreground transition-colors duration-base"
                >
                  {t("datePicker.clear")}
                </button>
              </div>
            )}
            <div className="p-0">{calendarElement}</div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
