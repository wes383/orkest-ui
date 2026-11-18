'use client';

import { createContext, useContext } from 'react';

import type { CivilDate, Weekday } from './date-utils';

export type CalendarSize = 'sm' | 'md' | 'lg';

/** `label` shows a month caption; `select` swaps it for month and year pickers. */
export type CalendarCaptionLayout = 'label' | 'select';

export interface CalendarLabels {
  previousMonth: string;
  nextMonth: string;
  month: string;
  year: string;
}

export interface CalendarContextValue {
  visibleMonth: CivilDate;
  todayDate: CivilDate;
  selectedDate: CivilDate | null;
  focusedDate: CivilDate;
  locale: string;
  weekStartsOn: Weekday;
  size: CalendarSize;
  captionLayout: CalendarCaptionLayout;
  showOutsideDays: boolean;
  disabled: boolean;
  labels: CalendarLabels;
  minDate: CivilDate | null;
  maxDate: CivilDate | null;
  isDateDisabled: (date: CivilDate) => boolean;
  isDateSelected: (date: CivilDate) => boolean;
  isDateFocused: (date: CivilDate) => boolean;
  selectDate: (date: CivilDate) => void;
  focusDate: (date: CivilDate, options?: { focus?: boolean }) => void;
  goToMonth: (amount: number) => void;
  setVisibleMonth: (date: CivilDate) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

export const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendarContext(): CalendarContextValue {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      'Calendar parts must be rendered inside <Calendar>. Compose them as children of the calendar root.',
    );
  }

  return context;
}
