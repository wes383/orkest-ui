'use client';

import { Heading, Stack } from '@orkest/ui';
import { Avatar, AvatarFallback, AvatarGroup } from '@orkest/ui/client';

export function AvatarDemo() {
  return (
    <Stack gap={2}>
      <Heading level={2} size="xl">
        Avatars
      </Heading>
      <Stack direction="row" gap={3} align="center" wrap>
        <Avatar status="online">
          <AvatarFallback>{'AM'}</AvatarFallback>
        </Avatar>
        <Avatar status="away" shape="square">
          <AvatarFallback>{'JL'}</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>{'SK'}</AvatarFallback>
        </Avatar>
        <AvatarGroup max={3} size="md">
          <Avatar>
            <AvatarFallback>{'A'}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{'B'}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{'C'}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{'D'}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{'E'}</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
