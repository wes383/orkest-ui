'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { DateRangePicker, Field, FieldDescription, FieldLabel } from '@orkest/ui/client';
import type { DateRange } from '@orkest/ui/client';

export function DateRangePickerBasicExample() {
  const [value, setValue] = useState<DateRange | null>({
    start: '2026-11-18',
    end: '2026-11-22',
  });

  return (
    <Stack gap={2} align="start" style={{ width: '100%', maxWidth: '20rem' }}>
      <DateRangePicker value={value} onChange={setValue} />
      <Text size="sm" tone="muted">
        Value: {value ? `${value.start} → ${value.end}` : 'none'}
      </Text>
    </Stack>
  );
}

export function DateRangePickerLimitsExample() {
  const [value, setValue] = useState<DateRange | null>(null);

  return (
    <DateRangePicker
      value={value}
      onChange={setValue}
      minDate="2026-11-10"
      maxDate="2026-12-20"
      disabledDates={(date) => date.endsWith('-15') || date.endsWith('-16')}
      style={{ width: '100%', maxWidth: '20rem' }}
    />
  );
}

export function DateRangePickerSingleMonthExample() {
  const [value, setValue] = useState<DateRange | null>(null);

  return (
    <DateRangePicker
      value={value}
      onChange={setValue}
      months={1}
      style={{ width: '100%', maxWidth: '20rem' }}
    />
  );
}

export function DateRangePickerFieldExample() {
  const [value, setValue] = useState<DateRange | null>(null);

  return (
    <Field required style={{ width: '100%', maxWidth: '20rem' }}>
      <FieldLabel>Stay</FieldLabel>
      <DateRangePicker value={value} onChange={setValue} placeholder="Check in – Check out" />
      <FieldDescription>Both ends are submitted with the form.</FieldDescription>
    </Field>
  );
}

export function DateRangePickerSizesExample() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: '20rem' }}>
      <DateRangePicker
        defaultValue={{ start: '2026-11-18', end: '2026-11-22' }}
        size="sm"
      />
      <DateRangePicker
        defaultValue={{ start: '2026-11-18', end: '2026-11-22' }}
        size="md"
      />
      <DateRangePicker
        defaultValue={{ start: '2026-11-18', end: '2026-11-22' }}
        size="lg"
      />
    </Stack>
  );
}
