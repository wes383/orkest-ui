'use client';

import { useState } from 'react';

import { Heading, Label, Stack } from '@orkest/ui';
import { Input, Textarea } from '@orkest/ui/client';

interface PlaygroundFormProps {
  idPrefix: string;
}

export function PlaygroundForm({ idPrefix }: PlaygroundFormProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Client components
      </Heading>
      <Stack gap={2}>
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type a name"
          clearable
          showCount
          maxLength={40}
        />
      </Stack>
      <Stack gap={2}>
        <Label htmlFor={`${idPrefix}-password`}>Password</Label>
        <Input
          id={`${idPrefix}-password`}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          passwordToggle
        />
      </Stack>
      <Stack gap={2}>
        <Label htmlFor={`${idPrefix}-notes`}>Notes</Label>
        <Textarea
          id={`${idPrefix}-notes`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Auto-resizing textarea"
          autoResize
          minRows={2}
          maxRows={6}
          showCount
          maxLength={200}
        />
      </Stack>
    </Stack>
  );
}
