'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { Field, FieldDescription, FieldLabel } from '@orkest/ui/client';
import { DatePicker } from '@orkest/ui/client';

export function DatePickerBasicExample() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Stack gap={2} align="start" style={{ width: '100%', maxWidth: '18rem' }}>
      <DatePicker value={value} onChange={setValue} />
      <Text size="sm" tone="muted">
        Value: {value ?? 'none'}
      </Text>
    </Stack>
  );
}

export function DatePickerRangeExample() {
  const [value, setValue] = useState<string | null>('2026-11-18');

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      minDate="2026-11-10"
      maxDate="2026-12-20"
      disabledDates={(date) => date.endsWith('-15') || date.endsWith('-16')}
      style={{ width: '100%', maxWidth: '18rem' }}
    />
  );
}

export function DatePickerFormatExample() {
  const [value, setValue] = useState<string | null>('2026-11-18');

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: '18rem' }}>
      <DatePicker value={value} onChange={setValue} format={(iso) => iso.replaceAll('-', '/')} />
      <DatePicker value={value} onChange={setValue} locale="en-GB" format="full" />
    </Stack>
  );
}

export function DatePickerFieldExample() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Field required style={{ width: '100%', maxWidth: '18rem' }}>
      <FieldLabel>Start date</FieldLabel>
      <DatePicker value={value} onChange={setValue} placeholder="Choose a start date" />
      <FieldDescription>Leave empty to start immediately.</FieldDescription>
    </Field>
  );
}

export function DatePickerSizesExample() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: '18rem' }}>
      <DatePicker defaultValue="2026-11-18" size="sm" placeholder="Small" />
      <DatePicker defaultValue="2026-11-18" size="md" placeholder="Medium" />
      <DatePicker defaultValue="2026-11-18" size="lg" placeholder="Large" />
    </Stack>
  );
}

export function DatePickerCaptionSelectExample() {
  const [value, setValue] = useState<string | null>('2026-11-18');

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      captionLayout="select"
      style={{ width: '100%', maxWidth: '18rem' }}
    />
  );
}

export function DatePickerBareExample() {
  const [value, setValue] = useState<string | null>('2026-11-18');

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      showIcon={false}
      showToday={false}
      clearable={false}
      style={{ width: '100%', maxWidth: '18rem' }}
    />
  );
}
