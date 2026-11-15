import { createRef, useRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../input';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogProps,
} from './dialog';

function ExampleDialog(props: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogPortal>
        <DialogOverlay data-testid="overlay" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your account details.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input aria-label="Display name" defaultValue="Ada Lovelace" />
          </DialogBody>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Edit profile' }));
  return screen.getByRole('dialog');
}

describe('Dialog', () => {
  it('opens from the trigger and renders through a portal', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExampleDialog />);

    const dialog = await openDialog(user);

    expect(dialog).toBeInTheDocument();
    expect(container.contains(dialog)).toBe(false);
    expect(
      screen.getByRole('heading', { name: 'Edit profile' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Update your account details.'),
    ).toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ExampleDialog />);

    const trigger = screen.getByRole('button', { name: 'Edit profile' });
    await openDialog(user);
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('does not close on Escape when closeOnEscape is false', async () => {
    const user = userEvent.setup();
    render(<ExampleDialog closeOnEscape={false} />);

    await openDialog(user);
    await user.keyboard('{Escape}');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes when the overlay is pressed', async () => {
    const user = userEvent.setup();
    render(<ExampleDialog />);

    await openDialog(user);
    await user.click(screen.getByTestId('overlay'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('does not close on overlay press when closeOnOverlayClick is false', async () => {
    const user = userEvent.setup();
    render(<ExampleDialog closeOnOverlayClick={false} />);

    await openDialog(user);
    await user.click(screen.getByTestId('overlay'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes from the built-in close action', async () => {
    const user = userEvent.setup();
    render(<ExampleDialog />);

    await openDialog(user);
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('supports controlled open state and reports changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<ExampleDialog open onOpenChange={onOpenChange} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('accepts a custom initial focus target', async () => {
    function InitialFocusExample() {
      const inputRef = useRef<HTMLInputElement>(null);

      return (
        <Dialog defaultOpen>
          <DialogPortal>
            <DialogContent initialFocus={inputRef}>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Input ref={inputRef} aria-label="Display name" />
              </DialogBody>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      );
    }

    render(<InitialFocusExample />);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveFocus();
    });
  });

  it('applies size presets and can hide the built-in close action', () => {
    render(
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogContent size="lg" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'lg');
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('forwards refs to the dialog surface', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogContent ref={ref}>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    );

    expect(ref.current).toBe(screen.getByRole('dialog'));
  });
});
