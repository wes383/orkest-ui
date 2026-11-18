'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { Field, FieldDescription, FieldLabel } from '@orkest/ui/client';
import { TimePicker } from '@orkest/ui/client';

export function TimePickerBasicExample() {
  const [value, setValue] = useState<string | null>('09:30');

  return (
    <Stack gap={2} align="start" style={{ width: '100%', maxWidth: '20rem' }}>
      <TimePicker value={value} onChange={setValue} />
      <Text size="sm" tone="muted">
        Value: {value ?? 'none'}
      </Text>
    </Stack>
  );
}

export function TimePickerTwelveHourExample() {
  const [value, setValue] = useState<string | null>('13:45');

  return (
    <Stack gap={3} align="start" style={{ width: '100%', maxWidth: '20rem' }}>
      <TimePicker value={value} onChange={setValue} format="12h" minuteStep={15} />
      <Text size="sm" tone="muted">
        Stored as {value ?? 'none'} — the display format never changes the value.
      </Text>
    </Stack>
  );
}

export function TimePickerSecondsExample() {
  const [value, setValue] = useState<string | null>('09:30:00');

  return (
    <TimePicker
      value={value}
      onChange={setValue}
      showSeconds
      minTime="08:00"
      maxTime="18:00"
    />
  );
}

export function TimePickerFieldExample() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Field>
      <FieldLabel>Reminder time</FieldLabel>
      <TimePicker value={value} onChange={setValue} placeholder="Set a reminder" />
      <FieldDescription>Sent in your local timezone, stored as HH:mm.</FieldDescription>
    </Field>
  );
}

export function TimePickerStatesExample() {
  return (
    <Stack gap={3}>
      <TimePicker defaultValue="09:30" size="sm" />
      <TimePicker defaultValue="09:30" size="md" />
      <TimePicker defaultValue="09:30" size="lg" />
      <TimePicker defaultValue="09:30" disabled />
    </Stack>
  );
}
