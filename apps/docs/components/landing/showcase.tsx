'use client';

import { useState } from 'react';

import { Button, Stack, Text } from '@orkest/ui';
import {
  Calendar,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  toast,
} from '@orkest/ui/client';

export function CalendarShowcase() {
  const [value, setValue] = useState('2026-11-18');

  return (
    <Stack gap={3} align="center">
      <Calendar value={value} onChange={setValue} defaultMonth="2026-11" />
      <Text size="sm" tone="muted">
        Selected: {value}
      </Text>
    </Stack>
  );
}

export function DialogShowcase() {
  return (
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>
              They will get an email with a link to join this workspace.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Text size="sm" tone="muted">
              Focus trapping, Escape handling, and focus restoration come with the component.
            </Text>
          </DialogBody>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose render={<Button>Send invite</Button>} />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export function ToastShowcase() {
  return (
    <Stack direction="row" gap={2} wrap>
      <Button variant="outline" onClick={() => toast.success('Changes saved')}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Link copied', {
            description: 'The link is ready to paste.',
          })
        }
      >
        Info
      </Button>
    </Stack>
  );
}
