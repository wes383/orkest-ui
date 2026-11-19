'use client';

import { IconButton, Stack, Text } from '@orkest/ui';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@orkest/ui/client';
import { Copy, Settings, SlidersHorizontal } from 'lucide-react';

export function TooltipBasicExample() {
  return (
    <TooltipProvider delay={300}>
      <Stack direction="row" gap={3} align="center">
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
          <TooltipTrigger
            render={<IconButton icon={SlidersHorizontal} label="Filters" variant="outline" />}
          />
          <TooltipPortal>
            <TooltipContent>Filter the current results</TooltipContent>
          </TooltipPortal>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<IconButton icon={Copy} label="Copy link" variant="outline" />} />
          <TooltipPortal>
            <TooltipContent>
              Copy link{' '}
              <Text as="span" size="xs">
                ⌘C
              </Text>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </Stack>
    </TooltipProvider>
  );
}

export function TooltipTextTriggerExample() {
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger variant="link">What is a workspace?</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent maxWidth="14rem">
            A workspace groups projects, members, and billing in one place.
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TooltipPositionExample() {
  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger variant="outline">Hover for details</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="right" align="start" sideOffset={10}>
            <TooltipArrow />
            Prefers the right side and aligns to the start of the trigger.
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
