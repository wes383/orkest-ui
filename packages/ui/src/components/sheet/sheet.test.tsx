import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../button';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from './sheet';

function ExampleSheet({ contentProps }: { contentProps?: SheetContentProps } = {}) {
  return (
    <Sheet>
      <SheetTrigger>Open filters</SheetTrigger>
      <SheetContent {...contentProps}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the results shown in the table.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Button>Apply filters</Button>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

async function openSheet(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open filters' }));
  return screen.getByRole('dialog');
}

describe('Sheet', () => {
  it('opens from the trigger and renders through a portal', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExampleSheet />);

    const sheet = await openSheet(user);

    expect(container.contains(sheet)).toBe(false);
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBe(sheet);
    expect(sheet).toHaveAttribute('aria-modal', 'true');
    expect(sheet).toHaveAttribute('data-side', 'right');
    expect(sheet).toHaveAttribute('data-size', 'md');
    expect(screen.getByText('Refine the results shown in the table.')).toBeInTheDocument();
  });

  it('renders the trigger as an outline button by default', () => {
    render(<ExampleSheet />);

    expect(screen.getByRole('button', { name: 'Open filters' })).toHaveAttribute(
      'data-variant',
      'outline',
    );
  });

  it('applies side and size presets', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="left" size="lg">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    const sheet = screen.getByRole('dialog');

    expect(sheet).toHaveAttribute('data-side', 'left');
    expect(sheet).toHaveAttribute('data-size', 'lg');
  });

  it('keeps focus inside the sheet while tabbing', async () => {
    const user = userEvent.setup();
    render(<ExampleSheet />);

    const sheet = await openSheet(user);

    await waitFor(() => {
      expect(sheet.contains(document.activeElement)).toBe(true);
    });

    for (let index = 0; index < 6; index += 1) {
      await user.tab();
      await waitFor(() => {
        expect(sheet.contains(document.activeElement)).toBe(true);
      });
    }
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ExampleSheet />);

    const trigger = screen.getByRole('button', { name: 'Open filters' });
    await openSheet(user);
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes when the overlay is pressed', async () => {
    const user = userEvent.setup();
    render(<ExampleSheet />);

    await openSheet(user);

    const overlay = document.querySelector<HTMLElement>('[data-sheet-overlay]');

    if (!overlay) {
      throw new Error('Expected the sheet overlay to render.');
    }

    await user.click(overlay);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes from the built-in close action', async () => {
    const user = userEvent.setup();
    render(<ExampleSheet />);

    await openSheet(user);
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('can hide the built-in close action', () => {
    render(<ExampleSheet contentProps={{ showCloseButton: false }} />);

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('forwards refs and class names to the sheet surface', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Sheet defaultOpen>
        <SheetContent ref={ref} className="custom-sheet">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    const sheet = screen.getByRole('dialog');

    expect(ref.current).toBe(sheet);
    expect(sheet).toHaveClass('custom-sheet');
  });
});
