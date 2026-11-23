'use client';

import { ToggleGroup, ToggleGroupItem } from '@orkest/ui/client';

export function ToggleGroupBasicExample() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={['left']}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
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
