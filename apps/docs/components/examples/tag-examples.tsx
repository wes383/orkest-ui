'use client';

import { useState } from 'react';

import { Stack, Tag } from '@orkest/ui';

export function RemovableTagExample() {
  const [tags, setTags] = useState(['Design', 'Engineering', 'Product']);

  return (
    <Stack direction="row" gap={2} wrap>
      {tags.map((tag) => (
        <Tag
          key={tag}
          removable
          onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </Stack>
  );
}

export function InteractiveTagExample() {
  const [active, setActive] = useState(false);

  return (
    <Tag
      interactive
      variant={active ? 'success' : 'outline'}
      onClick={() => setActive((value) => !value)}
    >
      {active ? 'Selected' : 'Select tag'}
    </Tag>
  );
}
