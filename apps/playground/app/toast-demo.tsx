'use client';

import { Button, Heading, Stack } from '@orkest/ui';
import { toast } from '@orkest/ui/client';

function simulateSave() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1200);
  });
}

export function ToastDemo() {
  return (
    <Stack gap={3}>
      <Heading level={2} size="xl">
        Toast
      </Heading>
      <Stack direction="row" gap={2} wrap>
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Saved', {
              description: 'The workspace settings were updated.',
            })
          }
        >
          Success toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: 'Task deleted',
              description: 'The task moved to Trash.',
              action: {
                label: 'Undo',
                onClick: () => toast.success('Task restored'),
              },
            })
          }
        >
          Toast with action
        </Button>
        <Button
          onClick={() =>
            toast.promise(simulateSave(), {
              loading: 'Saving…',
              success: 'Saved',
              error: 'Could not save',
            })
          }
        >
          Promise toast
        </Button>
        <Button variant="ghost" onClick={() => toast.dismissAll()}>
          Dismiss all
        </Button>
      </Stack>
    </Stack>
  );
}
