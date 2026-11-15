'use client';

import { useState } from 'react';

import { Heading, Stack } from '@orkest/ui';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldMessage,
  Fieldset,
  Input,
  Legend,
  Radio,
  RadioGroup,
  Select,
} from '@orkest/ui/client';

export function FieldDemo() {
  const [plan, setPlan] = useState('team');

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Form fields
      </Heading>
      <Field required>
        <FieldLabel>Work email</FieldLabel>
        <Input type="email" placeholder="you@company.com" />
        <FieldDescription>Used for account recovery.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel optional>Display name</FieldLabel>
        <Input placeholder="Ada Lovelace" />
        <FieldDescription>Shown on your profile.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Workspace URL</FieldLabel>
        <Input defaultValue="admin" />
        <FieldMessage icon>This workspace name is reserved.</FieldMessage>
      </Field>
      <Field>
        <FieldLabel>Region</FieldLabel>
        <Select
          options={[
            { value: 'eu', label: 'Europe' },
            { value: 'us', label: 'United States' },
            { value: 'apac', label: 'Asia Pacific' },
          ]}
        />
        <FieldDescription>Data stays in the selected region.</FieldDescription>
      </Field>
      <Fieldset>
        <Legend>Plan</Legend>
        <Field required>
          <FieldLabel>Billing plan</FieldLabel>
          <RadioGroup value={plan} onValueChange={setPlan}>
            <Radio value="personal" label="Personal" />
            <Radio value="team" label="Team" />
            <Radio value="enterprise" label="Enterprise" />
          </RadioGroup>
          <FieldDescription>Change your plan at any time.</FieldDescription>
        </Field>
      </Fieldset>
    </Stack>
  );
}
