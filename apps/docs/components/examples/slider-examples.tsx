'use client';

import { useState } from 'react';

import { Stack, Text } from '@orkest/ui';
import { Slider } from '@orkest/ui/client';

export function SliderBasicExample() {
  return <Slider label="Volume" defaultValue={40} showValue />;
}

export function SliderRangeExample() {
  const [range, setRange] = useState<number[]>([20, 60]);

  return (
    <Stack gap={2} style={{ width: '100%', maxWidth: '28rem' }}>
      <Slider
        label="Price range"
        value={range}
        onValueChange={(value) => {
          if (Array.isArray(value)) {
            setRange([...value]);
          }
        }}
        showValue
      />
      <Text size="sm" tone="muted">
        Selected: {range.join(' – ')}
      </Text>
    </Stack>
  );
}

export function SliderVerticalExample() {
  return (
    <Slider
      label="Zoom"
      defaultValue={50}
      orientation="vertical"
      showValue
      style={{ width: '9rem' }}
    />
  );
}
