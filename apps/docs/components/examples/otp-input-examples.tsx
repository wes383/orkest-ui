'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { OTPInput } from '@orkest/ui/client';

export function OTPInputBasicExample() {
  return (
    <OTPInput
      aria-label="Verification code"
      length={6}
      separator={<span aria-hidden="true">·</span>}
    />
  );
}

export function OTPInputMaskedExample() {
  const [value, setValue] = useState('');
  const [complete, setComplete] = useState(false);

  return (
    <Stack gap={2}>
      <OTPInput
        aria-label="One-time password"
        length={6}
        mask
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          setComplete(false);
        }}
        onValueComplete={() => setComplete(true)}
      />
      <Text size="sm" tone="muted">
        {complete ? 'Code complete.' : `${value.length} of 6 digits entered.`}
      </Text>
    </Stack>
  );
}
