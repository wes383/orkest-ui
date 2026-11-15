'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@orkest/ui/client';
import {
  Archive,
  Copy,
  Keyboard,
  Mail,
  MessageSquare,
  Pencil,
  Settings,
  Share2,
  Trash2,
} from 'lucide-react';

export function DropdownMenuBasicExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem leftIcon={Pencil}>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem leftIcon={Copy}>
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled leftIcon={Archive}>
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" leftIcon={Trash2}>
            Delete
            <DropdownMenuShortcut>⇧⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function DropdownMenuGroupExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">View options</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panels</DropdownMenuLabel>
            <DropdownMenuCheckboxItem defaultChecked>
              Show grid
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Show ruler</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Resources</DropdownMenuLabel>
            <DropdownMenuItem leftIcon={Settings}>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem leftIcon={Keyboard}>
              Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuLinkItem href="/docs/components/button/">
              Button documentation
            </DropdownMenuLinkItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function DropdownMenuRadioExample() {
  const [density, setDensity] = useState('comfortable');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">
        Density: {density}
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={density}
            onValueChange={(value) => setDensity(value)}
          >
            <DropdownMenuRadioItem value="compact">
              Compact
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">
              Comfortable
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="spacious">
              Spacious
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function DropdownMenuSubmenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Share</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem leftIcon={Copy}>Copy link</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger leftIcon={Share2}>
              Share via
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem leftIcon={Mail}>Email</DropdownMenuItem>
              <DropdownMenuItem leftIcon={MessageSquare}>
                Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More options…</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function DropdownMenuControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="row" gap={3} wrap align="center">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger variant="outline">
          Project actions
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem leftIcon={Pencil}>Rename</DropdownMenuItem>
            <DropdownMenuItem leftIcon={Copy}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" leftIcon={Trash2}>
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <Text size="sm" tone="muted">
        {open ? 'Status: open' : 'Status: closed'}
      </Text>
    </Stack>
  );
}

export function DropdownMenuSizingExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Sized menu</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent minWidth="18rem" maxWidth="22rem">
          <DropdownMenuItem>Rename project</DropdownMenuItem>
          <DropdownMenuItem>Move to folder</DropdownMenuItem>
          <DropdownMenuItem>Duplicate project</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLinkItem href="/docs/components/dropdown-menu/">
            Read the documentation
          </DropdownMenuLinkItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
