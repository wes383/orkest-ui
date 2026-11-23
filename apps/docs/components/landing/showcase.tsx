'use client';

import { useState } from 'react';

import { Button, Stack, Text } from '@orkest/ui';
import {
  Checkbox,
  DatePicker,
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
  Input,
  Select,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  toast,
  type SelectItem,
} from '@orkest/ui/client';

const fruitOptions: SelectItem[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

export function InputShowcase() {
  const [value, setValue] = useState('');

  return (
    <Stack gap={2} align="center" style={{ width: '100%' }}>
      <Input
        aria-label="Your name"
        placeholder="Type your name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Text size="sm" tone="muted">
        Hello, {value || 'stranger'}
      </Text>
    </Stack>
  );
}

export function SelectShowcase() {
  return <Select aria-label="Favorite fruit" options={fruitOptions} defaultValue="apple" />;
}

export function DatePickerShowcase() {
  const [value, setValue] = useState<string | null>('2026-11-18');

  return <DatePicker value={value} onChange={setValue} style={{ width: '100%' }} />;
}

export function TabsShowcase() {
  return (
    <Tabs defaultValue="overview" style={{ width: '100%' }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="overview">
        <Text size="sm" tone="muted">
          All changes in one place.
        </Text>
      </TabsContent>
      <TabsContent value="activity">
        <Text size="sm" tone="muted">
          Recent commits and reviews.
        </Text>
      </TabsContent>
    </Tabs>
  );
}

export function SwitchShowcase() {
  const [enabled, setEnabled] = useState(true);

  return <Switch label="Notifications" checked={enabled} onCheckedChange={setEnabled} />;
}

export function CheckboxShowcase() {
  const [checked, setChecked] = useState(true);

  return <Checkbox label="Remember me" checked={checked} onCheckedChange={setChecked} />;
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
