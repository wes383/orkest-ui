'use client';

import { useState } from 'react';

import { Box, Heading, Stack, Text } from '@orkest/ui';
import {
  Calendar,
  DatePicker,
  Field,
  FieldDescription,
  FieldLabel,
  TimePicker,
} from '@orkest/ui/client';

export function DateTimeDemo() {
  const [date, setDate] = useState<string | null>('2026-11-18');
  const [time, setTime] = useState<string | null>('09:30');

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Date &amp; Time
      </Heading>
      <Box border radius="xl" padding={4}>
        <Stack gap={4}>
          <Stack gap={2}>
            <DatePicker
              value={date}
              onChange={setDate}
              captionLayout="select"
              minDate="2026-01-01"
              maxDate="2027-12-31"
            />
            <TimePicker
              value={time}
              onChange={setTime}
              format="12h"
              minuteStep={15}
              minTime="08:00"
              maxTime="18:00"
            />
            <Text size="sm" tone="muted">
              {date ?? 'no date'} at {time ?? 'no time'}
            </Text>
          </Stack>
          <Field>
            <FieldLabel>Due date</FieldLabel>
            <DatePicker placeholder="Pick a due date" />
            <FieldDescription>Stored as YYYY-MM-DD.</FieldDescription>
          </Field>
          <Calendar defaultMonth="2026-11" defaultValue="2026-11-18" size="sm" />
        </Stack>
      </Box>
    </Stack>
  );
}
