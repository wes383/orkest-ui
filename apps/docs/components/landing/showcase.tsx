'use client';

import { useState } from 'react';

import {
  Bold,
  Copy,
  Italic,
  Link2,
  Mail,
  Pencil,
  Plus,
  Settings,
  Share2,
  Trash2,
  Underline,
} from 'lucide-react';

import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Icon,
  IconButton,
  Stack,
  Tag,
  Text,
} from '@orkest/ui';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  BreadcrumbEllipsisMenu,
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Tabs,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TimePicker,
  ToggleGroup,
  ToggleGroupItem,
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
      <DropdownMenu>
        <DropdownMenuTrigger variant="outline" size="sm">
          More actions
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem leftIcon={Pencil}>Edit</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger leftIcon={Share2}>Share via</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem leftIcon={Mail}>Email</DropdownMenuItem>
                <DropdownMenuItem leftIcon={Link2}>Copy link</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" leftIcon={Trash2}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
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
    <Stack gap={4} align="center">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsIndicator />
        </TabsList>
      </Tabs>
      <Tabs defaultValue="day">
        <TabsList variant="pills">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsIndicator />
        </TabsList>
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

export function FormattingShowcase() {
  const [value, setValue] = useState<string[]>(['italic']);

  return (
    <ToggleGroup
      aria-label="Text style"
      value={value}
      onValueChange={(next) => {
        if (next.length > 0) {
          setValue(next);
        }
      }}
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Icon icon={Bold} size="sm" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Icon icon={Italic} size="sm" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Icon icon={Underline} size="sm" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function RangeShowcase() {
  const [volume, setVolume] = useState(60);

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: '13rem' }}>
      <Slider
        label="Volume"
        showValue
        value={volume}
        onValueChange={(next) => {
          if (typeof next === 'number') {
            setVolume(next);
          }
        }}
      />
      <Progress label="Upload" showValue value={68} />
    </Stack>
  );
}

export function SheetShowcase() {
  return (
    <Sheet>
      <SheetTrigger>Open sheet</SheetTrigger>
      <SheetContent side="right" size="sm">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the results shown in the table.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Text size="sm" tone="muted">
            Choose a status, then apply the filters.
          </Text>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
          <SheetClose render={<Button>Apply</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function BreadcrumbShowcase() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsisMenu
            items={[
              { label: 'Documentation', href: '/docs/' },
              { label: 'Theming', href: '/docs/guides/theming/' },
            ]}
          />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
