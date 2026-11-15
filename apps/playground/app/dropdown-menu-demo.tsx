'use client';

import { useState } from 'react';

import { Heading, Stack } from '@orkest/ui';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Archive, Copy, Mail, Pencil, Share2, Trash2 } from 'lucide-react';

export function DropdownMenuDemo() {
  const [density, setDensity] = useState('comfortable');

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Dropdown menus
      </Heading>
      <Stack direction="row" gap={2} wrap>
        <DropdownMenu>
          <DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
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
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

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
                <DropdownMenuLabel>Density</DropdownMenuLabel>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

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
                  <DropdownMenuItem>Message</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </Stack>
    </Stack>
  );
}
