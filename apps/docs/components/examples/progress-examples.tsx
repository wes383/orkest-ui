'use client';

import { Stack, Text } from '@orkest/ui';
import { Progress } from '@orkest/ui/client';

export function ProgressSizesExample() {
  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: '32rem' }}>
      <Progress label="Small" value={35} size="sm" showValue />
      <Progress label="Medium" value={60} size="md" showValue />
      <Progress label="Large" value={85} size="lg" showValue />
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
