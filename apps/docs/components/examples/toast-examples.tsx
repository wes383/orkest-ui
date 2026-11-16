'use client';

import { useState } from 'react';

import { Button, Stack, Text } from '@orkest/ui';
import {
  createToast,
  toast,
  ToastProvider,
  ToastViewport,
  type ToastPosition,
} from '@orkest/ui/client';

const positions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export function ToastTypesExample() {
  return (
    <Stack direction="row" gap={2} wrap>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Changes saved', {
            description: 'Your profile is up to date.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Could not save', {
            description: 'Check your connection and try again.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Unsaved changes', {
            description: 'Leaving this page will discard them.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Copied to clipboard', {
            description: 'The link is ready to paste.',
          })
        }
      >
        Info
      </Button>
    </Stack>
  );
}

export function ToastActionExample() {
  function deleteTask() {
    let toastId = '';

    toastId = toast.show({
      title: 'Task deleted',
      description: 'The task moved to Trash.',
      action: {
        label: 'Undo',
        onClick: () => toast.dismiss(toastId),
      },
    });
  }

  return (
    <Button variant="outline" onClick={deleteTask}>
      Delete task
    </Button>
  );
}

function simulateUpload() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1600);
  });
}

export function ToastPromiseExample() {
  return (
    <Button
      onClick={() =>
        toast.promise(simulateUpload(), {
          loading: 'Uploading file…',
          success: 'Upload complete',
          error: 'Upload failed',
        })
      }
    >
      Upload file
    </Button>
  );
}

export function ToastPositionsExample() {
  const [host] = useState(() => createToast());
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  return (
    <ToastProvider toastManager={host.manager}>
      <Stack gap={3}>
        <Stack direction="row" gap={2} wrap>
          {positions.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={position === item ? 'primary' : 'outline'}
              onClick={() => {
                setPosition(item);
                host.toast.info(`Position: ${item}`, {
                  description: 'Toasts stack from this corner.',
                });
              }}
            >
              {item}
            </Button>
          ))}
        </Stack>
        <Text size="sm" tone="muted">
          A local viewport opens in the selected corner.
        </Text>
      </Stack>
      <ToastViewport position={position} />
    </ToastProvider>
  );
}

export function ToastQueueExample() {
  const [host] = useState(() => createToast());
  const [count, setCount] = useState(0);

  return (
    <ToastProvider toastManager={host.manager} limit={2}>
      <Stack direction="row" gap={2} wrap>
        <Button
          variant="outline"
          onClick={() => {
            const next = count + 1;
            setCount(next);
            host.toast.info(`Notification ${next}`);
          }}
        >
          Add notification
        </Button>
        <Button variant="ghost" onClick={() => host.toast.dismissAll()}>
          Dismiss all
        </Button>
      </Stack>
      <ToastViewport position="bottom-left" />
    </ToastProvider>
  );
}
