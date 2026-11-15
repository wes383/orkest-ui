import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogProps,
} from './alert-dialog';

function ExampleAlertDialog(props: AlertDialogProps) {
  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger variant="destructive">Delete project</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay data-testid="overlay" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

async function openAlertDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Delete project' }));
  return screen.getByRole('alertdialog');
}

describe('AlertDialog', () => {
  it('opens with alertdialog semantics and accessible text', async () => {
    const user = userEvent.setup();
    render(<ExampleAlertDialog />);

    const dialog = await openAlertDialog(user);

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      screen.getByRole('heading', { name: 'Delete project?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('This action cannot be undone.'),
    ).toBeInTheDocument();
  });

  it('does not close on Escape', async () => {
    const user = userEvent.setup();
    render(<ExampleAlertDialog />);

    await openAlertDialog(user);
    await user.keyboard('{Escape}');

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('does not close on overlay press', async () => {
    const user = userEvent.setup();
    render(<ExampleAlertDialog />);

    await openAlertDialog(user);
    await user.click(screen.getByTestId('overlay'));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('closes from the cancel action', async () => {
    const user = userEvent.setup();
    render(<ExampleAlertDialog />);

    await openAlertDialog(user);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('closes from the confirming action and reports the reason', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<ExampleAlertDialog defaultOpen onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    );
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('does not render the built-in close action', async () => {
    const user = userEvent.setup();
    render(<ExampleAlertDialog />);

    await openAlertDialog(user);

    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('focuses the cancel action by default', async () => {
    render(<ExampleAlertDialog defaultOpen />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    });
  });
});
