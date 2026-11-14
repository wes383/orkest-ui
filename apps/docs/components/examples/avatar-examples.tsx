'use client';

import { Bot } from 'lucide-react';

import { Avatar, AvatarFallback } from '@orkest/ui/client';

export {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@orkest/ui/client';

export function AvatarIconExample() {
  return (
    <Avatar size="lg" label="Orkest assistant">
      <AvatarFallback>
        <Bot aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  );
}
