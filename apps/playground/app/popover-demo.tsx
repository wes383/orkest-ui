'use client';

import { useState } from 'react';

import { Heading, IconButton, Stack, Text } from '@orkest/ui';
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
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@orkest/ui/client';
import { Settings } from 'lucide-react';

export function PopoverDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Popover and tooltip
      </Heading>
      <Stack direction="row" gap={3} wrap align="center">
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

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>Controlled popover</PopoverTrigger>
          <PopoverPortal>
            <PopoverPositioner side="bottom" align="start">
              <PopoverContent maxWidth="18rem">
                <Stack gap={2}>
                  <PopoverTitle>Controlled popover</PopoverTitle>
                  <PopoverDescription>The playground owns the open state.</PopoverDescription>
                  <PopoverClose>Close</PopoverClose>
                </Stack>
              </PopoverContent>
            </PopoverPositioner>
          </PopoverPortal>
        </Popover>

        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger
              render={<IconButton icon={Settings} label="Settings" variant="outline" />}
            />
            <TooltipPortal>
              <TooltipContent>
                Manage workspace settings
                <TooltipArrow />
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger variant="link">What is a workspace?</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent maxWidth="14rem">
                A workspace groups projects, members, and billing.
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>

        <Text size="sm" tone="muted">
          {open ? 'Controlled popover: open' : 'Controlled popover: closed'}
        </Text>
      </Stack>
    </Stack>
  );
}
