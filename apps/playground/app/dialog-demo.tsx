'use client';

import { useState } from 'react';

import { Button, Heading, Stack } from '@orkest/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
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

export function DialogDemo() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Dialogs
      </Heading>
      <Stack direction="row" gap={2} wrap>
        <Dialog>
          <DialogTrigger>Edit profile</DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Update the name shown on your account.</DialogDescription>
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
        <AlertDialog>
          <AlertDialogTrigger variant="destructive">Delete project</AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes the project and its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete project</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
        <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
          Open controlled dialog
        </Button>
      </Stack>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Workspace settings</DialogTitle>
              <DialogDescription>This dialog is controlled by the playground.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Stack gap={4}>
                <Field>
                  <FieldLabel>Workspace name</FieldLabel>
                  <Input defaultValue="Orkest" />
                </Field>
                <Field>
                  <FieldLabel optional>Billing email</FieldLabel>
                  <Input type="email" defaultValue="billing@example.com" />
                </Field>
              </Stack>
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
