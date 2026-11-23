'use client';

import { useState } from 'react';

import { Copy, Pencil, Plus, Settings, Trash2 } from 'lucide-react';

import { Badge, Button, IconButton, Stack, Tag } from '@orkest/ui';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TimePicker,
  toast,
  type SelectItem,
} from '@orkest/ui/client';

const roleOptions: SelectItem[] = [
  { value: 'designer', label: 'Designer' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'product', label: 'Product' },
];

export function ActionsShowcase() {
  return (
    <Stack gap={3} align="center">
      <Stack direction="row" gap={2} wrap>
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          Ghost
        </Button>
      </Stack>
      <Stack direction="row" gap={2} wrap align="center">
        <IconButton icon={Plus} label="Add" size="sm" />
        <IconButton icon={Settings} label="Settings" size="sm" variant="outline" />
        <Tag size="sm">Beta</Tag>
        <Badge size="sm" variant="success">
          Active
        </Badge>
      </Stack>
    </Stack>
  );
}

export function FieldsShowcase() {
  return (
    <Stack gap={2} style={{ width: '100%', maxWidth: '16rem' }}>
      <Input aria-label="Full name" placeholder="Full name" />
      <Select aria-label="Role" options={roleOptions} defaultValue="designer" />
    </Stack>
  );
}

export function TogglesShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [remember, setRemember] = useState(false);
  const [plan, setPlan] = useState('pro');

  return (
    <Stack gap={3} align="start">
      <Switch label="Notifications" checked={notifications} onCheckedChange={setNotifications} />
      <Checkbox label="Remember me" checked={remember} onCheckedChange={setRemember} />
      <RadioGroup aria-label="Plan" value={plan} onValueChange={setPlan} orientation="horizontal">
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>
    </Stack>
  );
}

export function TabsShowcase() {
  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="overview">
          <Stack direction="row" gap={2} wrap>
            <Tag size="sm">Design</Tag>
            <Tag size="sm">Engineering</Tag>
          </Stack>
        </TabsContent>
        <TabsContent value="activity">
          <Stack direction="row" gap={2} wrap>
            <Tag size="sm">Commits</Tag>
            <Tag size="sm">Reviews</Tag>
          </Stack>
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="day">
        <TabsList variant="pills">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="day">
          <Badge size="sm" variant="info">
            Today
          </Badge>
        </TabsContent>
        <TabsContent value="week">
          <Badge size="sm" variant="outline">
            This week
          </Badge>
        </TabsContent>
        <TabsContent value="month">
          <Badge size="sm" variant="outline">
            This month
          </Badge>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}

export function PickersShowcase() {
  const [date, setDate] = useState<string | null>('2026-11-18');
  const [time, setTime] = useState<string | null>('09:30');

  return (
    <Stack gap={2} style={{ width: '100%', maxWidth: '14rem' }}>
      <DatePicker value={date} onChange={setDate} />
      <TimePicker value={time} onChange={setTime} />
    </Stack>
  );
}

export function DisplayShowcase() {
  return (
    <Stack gap={3} align="center">
      <AvatarGroup size="md" spacing={2} max={4}>
        <Avatar>
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>TW</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>RB</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <Stack direction="row" gap={2} wrap>
        <Badge size="sm" variant="success">
          Active
        </Badge>
        <Badge size="sm" variant="warning">
          Pending
        </Badge>
        <Badge size="sm" variant="info">
          New
        </Badge>
        <Badge size="sm" variant="outline">
          Draft
        </Badge>
      </Stack>
    </Stack>
  );
}

export function MenuShowcase() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem leftIcon={Pencil}>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem leftIcon={Copy}>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" leftIcon={Trash2}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function FeedbackShowcase() {
  return (
    <Stack gap={2} align="center">
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
              <Input aria-label="Email" placeholder="name@example.com" type="email" />
            </DialogBody>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <DialogClose render={<Button>Send invite</Button>} />
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Stack direction="row" gap={2}>
        <Button size="sm" variant="outline" onClick={() => toast.success('Changes saved')}>
          Success
        </Button>
        <Button size="sm" variant="ghost" onClick={() => toast.info('Link copied')}>
          Info
        </Button>
      </Stack>
    </Stack>
  );
}
