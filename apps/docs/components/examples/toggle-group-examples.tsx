'use client';

import { useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';

import { Icon } from '@orkest/ui';
import { ToggleGroup, ToggleGroupItem } from '@orkest/ui/client';

export function ToggleGroupBasicExample() {
  const [value, setValue] = useState<string[]>(['italic']);

  return (
    <ToggleGroup
      aria-label="Text style"
      value={value}
      onValueChange={(next) => {
        // Keep exactly one style active: pressing the active item is ignored.
        if (next.length > 0) {
          setValue(next);
        }
      }}
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Icon icon={Bold} size="md" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Icon icon={Italic} size="md" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Icon icon={Underline} size="md" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ToggleGroupMultipleExample() {
  return (
    <ToggleGroup aria-label="Text formatting" defaultValue={['bold']} multiple variant="outline">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ToggleGroupVerticalExample() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={['left']} orientation="vertical">
      <ToggleGroupItem value="left" aria-label="Align left">
        <Icon icon={AlignLeft} size="md" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <Icon icon={AlignCenter} size="md" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <Icon icon={AlignRight} size="md" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ToggleGroupDisabledExample() {
  return (
    <ToggleGroup aria-label="Text style" defaultValue={['bold']} disabled>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Icon icon={Bold} size="md" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Icon icon={Italic} size="md" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Icon icon={Underline} size="md" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
