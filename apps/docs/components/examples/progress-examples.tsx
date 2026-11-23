'use client';

import { useEffect, useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { Progress } from '@orkest/ui/client';

export function ProgressSizesExample() {
  const [value, setValue] = useState(20);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) => (current >= 100 ? 0 : current + 10));
    }, 800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: '32rem' }}>
      <Progress label="Small" value={value} size="sm" showValue />
      <Progress label="Medium" value={value} size="md" showValue />
      <Progress label="Large" value={value} size="lg" showValue />
    </Stack>
  );
}

export function ProgressIndeterminateExample() {
  return (
    <Stack gap={2}>
      <Progress label="Preparing export" value={null} />
      <Text size="sm" tone="muted">
        The value stays unknown until the archive is ready.
      </Text>
    </Stack>
  );
}
