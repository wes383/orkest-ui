'use client';

import { useState } from 'react';

import { Box } from '@orkest/ui';
import {
  Field,
  FieldDescription,
  FieldLabel,
  Fieldset,
  Input,
  Legend,
  Radio,
  RadioGroup,
} from '@orkest/ui/client';

export function FieldsetBasicExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Fieldset>
        <Legend>Shipping address</Legend>
        <Field>
          <FieldLabel>Street</FieldLabel>
          <Input placeholder="221B Baker Street" />
        </Field>
        <Field>
          <FieldLabel>City</FieldLabel>
          <Input placeholder="London" />
        </Field>
      </Fieldset>
    </Box>
  );
}

export function FieldsetDisabledExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Fieldset disabled>
        <Legend>Billing contact</Legend>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input defaultValue="Grace Hopper" />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input defaultValue="grace@example.com" />
        </Field>
      </Fieldset>
    </Box>
  );
}

export function FieldsetRadioExample() {
  const [frequency, setFrequency] = useState('weekly');

  return (
    <Box width="100%" maxWidth="22rem">
      <Fieldset>
        <Legend>Email digest</Legend>
        <Field required>
          <FieldLabel>Frequency</FieldLabel>
          <RadioGroup value={frequency} onValueChange={setFrequency}>
            <Radio value="daily" label="Daily" />
            <Radio value="weekly" label="Weekly" />
            <Radio value="monthly" label="Monthly" />
          </RadioGroup>
          <FieldDescription>Choose when we send your summary.</FieldDescription>
        </Field>
      </Fieldset>
    </Box>
  );
}
