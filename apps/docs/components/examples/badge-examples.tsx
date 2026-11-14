'use client';

import { useState } from 'react';

import { Badge, Stack } from '@orkest/ui';

export function RemovableBadgeExample() {
  const [tags, setTags] = useState(['Design', 'Engineering', 'Product']);

  return (
    <Stack direction="row" gap={2} wrap>
      {tags.map((tag) => (
        <Badge
          key={tag}
          removable
          onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
        >
          {tag}
        </Badge>
      ))}
    </Stack>
  );
}

export function InteractiveBadgeExample() {
  const [active, setActive] = useState(false);

  return (
    <Badge
      interactive
      variant={active ? 'success' : 'outline'}
      onClick={() => setActive((value) => !value)}
    >
      {active ? 'Selected' : 'Select tag'}
    </Badge>
  );
}
