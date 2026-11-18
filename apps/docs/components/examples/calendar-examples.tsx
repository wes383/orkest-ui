'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { Calendar } from '@orkest/ui/client';

export function CalendarBasicExample() {
  const [value, setValue] = useState('2026-11-18');

  return (
    <Stack gap={3} align="start">
      <Calendar value={value} onChange={setValue} month="2026-11" />
      <Text size="sm" tone="muted">
        Selected: {value}
      </Text>
    </Stack>
  );
}

export function CalendarCaptionSelectExample() {
  const [value, setValue] = useState('2026-11-18');

  return (
    <Calendar
      value={value}
      onChange={setValue}
      month="2026-11"
      captionLayout="select"
    />
  );
}

export function CalendarRangeExample() {
  const [value, setValue] = useState('2026-11-16');

  return (
    <Calendar
      value={value}
      onChange={setValue}
      month="2026-11"
      minDate="2026-11-10"
      maxDate="2026-11-24"
      disabledDates={['2026-11-13', '2026-11-20']}
    />
  );
}

export function CalendarSizesExample() {
  return (
    <Stack gap={5} align="start">
      <Calendar defaultMonth="2026-11" defaultValue="2026-11-18" size="sm" />
      <Calendar defaultMonth="2026-11" defaultValue="2026-11-18" size="lg" />
    </Stack>
  );
}
