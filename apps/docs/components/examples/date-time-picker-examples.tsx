'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { DateTimePicker, Field, FieldDescription, FieldLabel } from '@orkest/ui/client';

export function DateTimePickerBasicExample() {
  const [value, setValue] = useState<string | null>('2026-11-18T09:30');

  return (
    <Stack gap={2} align="start" style={{ width: '100%', maxWidth: '16rem' }}>
      <DateTimePicker value={value} onChange={setValue} />
      <Text size="sm" tone="muted">
        Value: {value ?? 'none'}
      </Text>
    </Stack>
  );
}

export function DateTimePickerTwelveHourExample() {
  const [value, setValue] = useState<string | null>('2026-11-18T14:45');

  return (
    <DateTimePicker
      value={value}
      onChange={setValue}
      timeFormat="12h"
      minuteStep={15}
      style={{ width: '100%', maxWidth: '16rem' }}
    />
  );
}

export function DateTimePickerSecondsExample() {
  const [value, setValue] = useState<string | null>('2026-11-18T09:30:15');

  return (
    <DateTimePicker
      value={value}
      onChange={setValue}
      showSeconds
      style={{ width: '100%', maxWidth: '16rem' }}
    />
  );
}

export function DateTimePickerFieldExample() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Field style={{ width: '100%', maxWidth: '16rem' }}>
      <FieldLabel>Publish at</FieldLabel>
      <DateTimePicker value={value} onChange={setValue} />
      <FieldDescription>Stored as local wall-clock time.</FieldDescription>
    </Field>
  );
}

export function DateTimePickerSizesExample() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: '16rem' }}>
      <DateTimePicker defaultValue="2026-11-18T09:30" size="sm" />
      <DateTimePicker defaultValue="2026-11-18T09:30" size="md" />
      <DateTimePicker defaultValue="2026-11-18T09:30" size="lg" />
    </Stack>
  );
}
