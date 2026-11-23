'use client';

import { Button, Stack, Text } from '@orkest/ui';
import {
  Field,
  FieldLabel,
  Input,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@orkest/ui/client';

export function SheetBasicExample() {
  return (
    <Sheet>
      <SheetTrigger>Edit profile</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Update the details shown on your account.</SheetDescription>
        </SheetHeader>
        <SheetBody>
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
        </SheetBody>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
          <SheetClose render={<Button>Save changes</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const sides = [
  { side: 'right', label: 'Right' },
  { side: 'left', label: 'Left' },
  { side: 'top', label: 'Top' },
  { side: 'bottom', label: 'Bottom' },
] as const;

export function SheetSidesExample() {
  return (
    <Stack direction="row" gap={2} wrap>
      {sides.map(({ side, label }) => (
        <Sheet key={side}>
          <SheetTrigger>{label}</SheetTrigger>
          <SheetContent side={side} size="sm">
            <SheetHeader>
              <SheetTitle>{label} sheet</SheetTitle>
              <SheetDescription>
                This panel is anchored to the {side} edge of the viewport.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <Text as="p" size="sm" tone="muted">
                Resize the browser window to see how the panel keeps a safe size.
              </Text>
            </SheetBody>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </Stack>
  );
}
