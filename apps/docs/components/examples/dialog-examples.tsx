'use client';

import { useState } from 'react';

import { Box, Button, Stack, Text } from '@orkest/ui';
import {
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
  Field,
  FieldLabel,
  Input,
} from '@orkest/ui/client';

export function DialogBasicExample() {
  return (
    <Dialog>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update the name and email shown on your account.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Stack gap={4}>
              <Field>
                <FieldLabel>Display name</FieldLabel>
                <Input defaultValue="Ada Lovelace" />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" defaultValue="ada@example.com" />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose render={<Button>Save changes</Button>} />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export function DialogControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="row" gap={3} wrap align="center">
      <Button onClick={() => setOpen(true)}>Open settings</Button>
      <Text size="sm" tone="muted">
        {open ? 'Status: open' : 'Status: closed'}
      </Text>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Workspace settings</DialogTitle>
              <DialogDescription>
                The dialog state is owned by the parent component.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Text as="p" size="sm" tone="muted">
                Change the state with the button or close the dialog.
              </Text>
            </DialogBody>
            <DialogFooter>
              <DialogClose>Done</DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </Stack>
  );
}

const dialogSizes = [
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
  { size: 'xl', label: 'Extra large' },
  { size: 'full', label: 'Full screen' },
] as const;

export function DialogSizesExample() {
  return (
    <Box width="100%" maxWidth="30rem">
      <Stack direction="row" gap={2} wrap>
        {dialogSizes.map(({ size, label }) => (
          <Dialog key={size}>
            <DialogTrigger variant="outline">{label}</DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent size={size}>
                <DialogHeader>
                  <DialogTitle>{label} dialog</DialogTitle>
                  <DialogDescription>
                    Resize the viewport to see the responsive constraints.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <Text as="p" size="sm" tone="muted">
                    This dialog uses the {size} size preset.
                  </Text>
                </DialogBody>
                <DialogFooter>
                  <DialogClose>Close</DialogClose>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        ))}
      </Stack>
    </Box>
  );
}

const clauses = Array.from(
  { length: 40 },
  (_, index) =>
    `Clause ${index + 1}. This section is long enough to demonstrate a scrollable dialog body while the header and footer stay visible. It includes additional wording so the example overflows on large screens as well.`,
);

export function DialogScrollExample() {
  return (
    <Dialog>
      <DialogTrigger variant="secondary">View terms</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Service terms</DialogTitle>
            <DialogDescription>
              Review the full text before accepting.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Stack gap={3}>
              {clauses.map((clause) => (
                <Text key={clause} as="p" size="sm" tone="muted">
                  {clause}
                </Text>
              ))}
            </Stack>
          </DialogBody>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <DialogClose render={<Button>Accept terms</Button>} />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
