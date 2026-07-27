"use client";

import * as React from "react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const CalendarDropdownMenuContainerContext =
  React.createContext<HTMLElement | null>(null);

function getMonthLabels(): string[] {
  const lang =
    typeof document !== "undefined"
      ? document.documentElement.lang || "zh"
      : "zh";
  const locale = lang.toLowerCase().startsWith("en") ? "en-US" : "zh-CN";
  const fmt = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, i) =>
    fmt.format(new Date(2026, i, 1))
  );
}

function CalendarMonthCaption({
  calendarMonth,
  displayIndex,
  ...divProps
}: {
  calendarMonth: { date: Date };
  displayIndex: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { months, goToMonth, dayPickerProps } = useDayPicker();
  const dropdownMenuContainer = React.useContext(
    CalendarDropdownMenuContainerContext
  );
  const date = calendarMonth.date;

  const startMonth = dayPickerProps?.startMonth;
  const endMonth = dayPickerProps?.endMonth;
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const prevDisabled =
    !!startMonth && prevMonth.getTime() < startMonth.getTime();
  const nextDisabled = !!endMonth && nextMonth.getTime() > endMonth.getTime();

  const yearRange = React.useMemo(() => {
    const currentYear = date.getFullYear();
    const startYear = startMonth
      ? startMonth.getFullYear()
      : currentYear - 10;
    const endYear = endMonth ? endMonth.getFullYear() : currentYear + 10;
    const arr: number[] = [];
    for (let y = startYear; y <= endYear; y++) arr.push(y);
    return arr;
  }, [date, startMonth, endMonth]);

  const monthLabels = React.useMemo(getMonthLabels, []);
  const [monthOpen, setMonthOpen] = React.useState(false);
  const [yearOpen, setYearOpen] = React.useState(false);

  const isFirst = displayIndex === 0;
  const isLast = displayIndex === months.length - 1;

  return (
    <div
      {...divProps}
      className={cn(
        "flex items-center justify-between gap-1 py-1",
        divProps.className
      )}
    >
      {isFirst ? (
        <button
          type="button"
          aria-label="Previous month"
          disabled={prevDisabled}
          onClick={() => goToMonth(prevMonth)}
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center text-foreground-muted transition-colors duration-base",
            "hover:text-foreground",
            "disabled:pointer-events-none disabled:opacity-30"
          )}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <span className="inline-flex h-6 w-6" aria-hidden="true" />
      )}

      <DropdownMenu open={monthOpen} onOpenChange={setMonthOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-sm font-medium font-display text-foreground",
              "transition-colors duration-base hover:text-foreground-strong",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            {monthLabels[date.getMonth()]}
            <ChevronDown className="h-3 w-3 text-foreground-subtle" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={4}
          container={dropdownMenuContainer}
          className="max-h-64 min-w-28 overflow-y-auto overscroll-contain !z-[100]"
        >
          {monthLabels.map((label, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={() => {
                goToMonth(new Date(date.getFullYear(), idx, 1));
                setMonthOpen(false);
              }}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu open={yearOpen} onOpenChange={setYearOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-sm font-medium font-display text-foreground",
              "transition-colors duration-base hover:text-foreground-strong",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            {date.getFullYear()}
            <ChevronDown className="h-3 w-3 text-foreground-subtle" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={4}
          container={dropdownMenuContainer}
          className="max-h-64 min-w-24 overflow-y-auto overscroll-contain !z-[100]"
        >
          {yearRange.map((y) => (
            <DropdownMenuItem
              key={y}
              onClick={() => {
                goToMonth(new Date(y, date.getMonth(), 1));
                setYearOpen(false);
              }}
            >
              {y}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isLast ? (
        <button
          type="button"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => goToMonth(nextMonth)}
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center text-foreground-muted transition-colors duration-base",
            "hover:text-foreground",
            "disabled:pointer-events-none disabled:opacity-30"
          )}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <span className="inline-flex h-6 w-6" aria-hidden="true" />
      )}
    </div>
  );
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, components, ...props }, ref) => {
    const [dropdownMenuContainer, setDropdownMenuContainer] =
      React.useState<HTMLDivElement | null>(null);

    const handleRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        setDropdownMenuContainer(node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <CalendarDropdownMenuContainerContext.Provider
        value={dropdownMenuContainer}
      >
        <div
          ref={handleRootRef}
          className={cn(
            "rounded-lg border border-border bg-surface p-2 shadow-pop",
            className
          )}
        >
          <DayPicker
            showOutsideDays={showOutsideDays}
            classNames={{
              months: "flex flex-col sm:flex-row gap-2",
              month: "flex flex-col gap-1",
              month_caption: "px-1",
              caption_label: "text-sm font-medium font-display",
              nav: "hidden",
              button_previous: "hidden",
              button_next: "hidden",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "flex-1 text-xs font-medium tracking-wide text-foreground-muted text-center py-0.5",
              week: "flex w-full mt-1",
              // No overflow-hidden: would clip range_middle connector bars.
              day: "flex-1 p-0 rounded-md",
              day_button: cn(
                "h-8 w-8 mx-auto rounded-md text-sm hover:bg-hover-bg focus:bg-hover-bg transition-colors duration-base ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "data-[disabled=true]:opacity-40 data-[disabled=true]:pointer-events-none"
              ),
              range_start: "bg-accent text-accent-fg rounded-l-md",
              range_end: "bg-accent text-accent-fg rounded-r-md",
              // !important to override selected's !bg-accent (both classes are
              // applied to middle days in range mode).
              range_middle: "!bg-accent-muted !text-foreground",
              hidden: "invisible",
              outside: "text-foreground-faint",
              // !important: react-day-picker applies both `today` and `selected`
              // to the same td when today is selected. Without !important, CSS
              // source order (not classNames key order) decides the winner.
              selected: "!bg-accent text-accent-fg rounded-md",
              today: "bg-hover-bg rounded-md",
              disabled: "opacity-40 pointer-events-none",
              ...classNames,
            }}
            components={{
              Nav: () => <></>,
              MonthCaption: CalendarMonthCaption,
              Chevron: ({ orientation, ...rest }: { orientation?: "left" | "right" | "up" | "down" } & React.SVGProps<SVGSVGElement>) => {
                if (orientation === "left") return <ChevronLeft className="h-4 w-4" aria-hidden="true" {...rest} />;
                if (orientation === "right") return <ChevronRight className="h-4 w-4" aria-hidden="true" {...rest} />;
                return <ChevronDown className="h-4 w-4" aria-hidden="true" {...rest} />;
              },
              ...components,
            }}
            {...props}
          />
        </div>
      </CalendarDropdownMenuContainerContext.Provider>
    );
  }
);
Calendar.displayName = "Calendar";
