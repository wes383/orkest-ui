import { Button, Stack, VisuallyHidden } from '@orkest/ui';
import { Search } from 'lucide-react';

export function VisuallyHiddenExample() {
  return (
    <Stack direction="row" gap={3} align="center">
      <Button iconOnly leftIcon={Search}>
        <VisuallyHidden>Search</VisuallyHidden>
      </Button>
      <Button variant="outline">
        Read the guide
        <VisuallyHidden> on keyboard navigation</VisuallyHidden>
      </Button>
    </Stack>
  );
}
