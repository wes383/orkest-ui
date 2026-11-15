'use client';

import { Box, Stack } from '@orkest/ui';
import {
  Checkbox,
  Field,
  FieldDescription,
  FieldLabel,
  FieldMessage,
  Input,
  Select,
} from '@orkest/ui/client';

export function FieldBasicExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" />
        <FieldDescription>We only use this for account notices.</FieldDescription>
      </Field>
    </Box>
  );
}

export function FieldHorizontalExample() {
  return (
    <Box width="100%" maxWidth="26rem">
      <Field orientation="horizontal">
        <FieldLabel>Display name</FieldLabel>
        <Input placeholder="Ada Lovelace" />
        <FieldDescription>Shown on your profile.</FieldDescription>
      </Field>
    </Box>
  );
}

export function FieldValidationExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Field
        validate={(value) =>
          value === 'admin' ? 'This workspace name is reserved.' : null
        }
        validationMode="onChange"
      >
        <FieldLabel>Workspace URL</FieldLabel>
        <Input placeholder="acme" />
        <FieldDescription>Try typing admin to see validation.</FieldDescription>
        <FieldMessage icon />
      </Field>
    </Box>
  );
}

export function FieldMessagesExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Stack gap={4}>
        <Field>
          <FieldLabel>API key</FieldLabel>
          <Input defaultValue="ok_live_9f2c" />
          <FieldMessage type="success" icon>
            Your key is active.
          </FieldMessage>
        </Field>
        <Field>
          <FieldLabel>Storage</FieldLabel>
          <Input defaultValue="8.4 GB" />
          <FieldMessage type="warning" icon>
            You are close to your quota.
          </FieldMessage>
        </Field>
        <Field>
          <FieldLabel>Region</FieldLabel>
          <Input defaultValue="eu-west-1" />
          <FieldMessage type="info" icon>
            Data stays in the EU.
          </FieldMessage>
        </Field>
      </Stack>
    </Box>
  );
}

export function FieldRequiredExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Stack gap={4}>
        <Field required>
          <FieldLabel>Full name</FieldLabel>
          <Input placeholder="Ada Lovelace" />
        </Field>
        <Field>
          <FieldLabel optional>Job title</FieldLabel>
          <Input placeholder="Engineer" />
        </Field>
      </Stack>
    </Box>
  );
}

export function FieldDisabledExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Field disabled>
        <FieldLabel>Account ID</FieldLabel>
        <Input defaultValue="acct_9f2c" />
        <FieldDescription>Managed by your organization.</FieldDescription>
      </Field>
    </Box>
  );
}

export function FieldCheckboxExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Field>
        <Checkbox label="Product updates" defaultChecked />
        <FieldDescription>At most one email per month.</FieldDescription>
        <FieldMessage type="info">You can unsubscribe at any time.</FieldMessage>
      </Field>
    </Box>
  );
}

export function FieldSelectExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Field>
        <FieldLabel>Country</FieldLabel>
        <Select
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'gb', label: 'United Kingdom' },
          ]}
        />
        <FieldDescription>Used to calculate tax.</FieldDescription>
      </Field>
    </Box>
  );
}
