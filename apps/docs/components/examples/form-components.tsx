'use client';

import { Check, Search } from 'lucide-react';

import { Box, Stack } from '@orkest/ui';
import { Input } from '@orkest/ui/client';

export { Input, Textarea } from '@orkest/ui/client';

export function InputIconsExample() {
  return (
    <Box width="100%" maxWidth="22rem">
      <Stack gap={2}>
        <Input leftIcon={Search} placeholder="Search components" aria-label="Search components" />
        <Input rightIcon={Check} defaultValue="Looks good" aria-label="Validation status" />
      </Stack>
    </Box>
  );
}
