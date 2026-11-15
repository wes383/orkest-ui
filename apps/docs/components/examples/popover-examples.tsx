'use client';

import { useState } from 'react';

import { Button, Stack, Text } from '@orkest/ui';
import {
  Field,
  FieldLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverPortal,
  PopoverPositioner,
  PopoverTitle,
  PopoverTrigger,
} from '@orkest/ui/client';

export function PopoverBasicExample() {
  return (
    <Popover>
      <PopoverTrigger>Open filters</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner>
          <PopoverContent width="20rem">
            <PopoverArrow />
            <Stack gap={3}>
              <Stack gap={1}>
                <PopoverTitle>Filters</PopoverTitle>
                <PopoverDescription>
                  Narrow the result list without leaving the page.
                </PopoverDescription>
              </Stack>
              <Field>
                <FieldLabel>Search</FieldLabel>
                <Input placeholder="Project name" />
              </Field>
              <PopoverClose>Done</PopoverClose>
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}

export function PopoverPositionExample() {
  return (
    <Popover>
      <PopoverTrigger variant="outline">Open on the right</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side="right" align="start" sideOffset={12}>
          <PopoverContent maxWidth="18rem">
            <PopoverArrow />
            <Stack gap={2}>
              <PopoverTitle>Positioned content</PopoverTitle>
              <PopoverDescription>
                This popover prefers the right side and aligns to the trigger start.
              </PopoverDescription>
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}

export function PopoverControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="row" gap={3} wrap align="center">
      <Button onClick={() => setOpen((current) => !current)}>
        Toggle popover
      </Button>
      <Text size="sm" tone="muted">
        {open ? 'Status: open' : 'Status: closed'}
      </Text>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverPortal>
          <PopoverPositioner>
            <PopoverContent maxWidth="18rem">
              <Stack gap={2}>
                <PopoverTitle>Controlled popover</PopoverTitle>
                <PopoverDescription>
                  The parent owns the open state.
                </PopoverDescription>
                <PopoverClose>Close</PopoverClose>
              </Stack>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </Stack>
  );
}

export function PopoverRegionExample() {
  return (
    <Popover>
      <PopoverTrigger variant="outline">Show inline help</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner>
          <PopoverContent role="region" maxWidth="18rem">
            <Stack gap={2}>
              <Text size="sm" weight="medium">
                Keyboard shortcuts
              </Text>
              <Text as="p" size="sm" tone="muted">
                Press <Text as="span" size="sm">⌘K</Text> to search. Use arrow keys to move between
                results.
              </Text>
              <PopoverClose>Got it</PopoverClose>
            </Stack>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}
