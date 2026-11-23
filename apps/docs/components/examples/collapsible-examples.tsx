'use client';

import { useState } from 'react';

import { Button, Stack, Text } from '@orkest/ui';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@orkest/ui/client';

export function CollapsibleBasicExample() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsiblePanel>
        Retries, timeouts, and proxy settings stay hidden until they are needed.
      </CollapsiblePanel>
    </Collapsible>
  );
}

export function CollapsibleCustomTriggerExample() {
  return (
    <Collapsible>
      <CollapsibleTrigger render={<Button variant="outline">Toggle advanced settings</Button>} />
      <CollapsiblePanel>Retries, timeouts, and proxy configuration.</CollapsiblePanel>
    </Collapsible>
  );
}

export function CollapsibleControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsiblePanel>Retries, timeouts, and proxy configuration.</CollapsiblePanel>
      </Collapsible>
      <Text size="sm" tone="muted">
        {open ? 'Open' : 'Closed'}
      </Text>
    </Stack>
  );
}
