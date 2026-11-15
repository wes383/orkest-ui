import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../input';
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverPortal,
  PopoverPositioner,
  PopoverTitle,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverProps,
} from './popover';

function ExamplePopover(
  props: PopoverProps & { contentProps?: PopoverContentProps },
) {
  const { contentProps, ...rootProps } = props;

  return (
    <Popover {...rootProps}>
      <PopoverTrigger>Open filters</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner>
          <PopoverContent {...contentProps}>
            <PopoverArrow data-testid="arrow" />
            <PopoverTitle>Filters</PopoverTitle>
            <PopoverDescription>Choose how results are filtered.</PopoverDescription>
            <Input aria-label="Filter query" />
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}

async function openPopover(user: ReturnType<typeof userEvent.setup>) {
  const trigger = screen.getByRole('button', { name: 'Open filters' });
  await user.click(trigger);
  const popover = await screen.findByRole('dialog');
  return { trigger, popover };
}

describe('Popover', () => {
  it('opens from the trigger through a portal with dialog semantics', async () => {
    const user = userEvent.setup();
    const { container } = render(<ExamplePopover />);

    const { popover } = await openPopover(user);

    expect(container.contains(popover)).toBe(false);
    expect(popover).toHaveAccessibleName('Filters');
    expect(popover).toHaveAccessibleDescription(
      'Choose how results are filtered.',
    );
    const arrow = screen.getByTestId('arrow');
    expect(arrow).toBeInTheDocument();
    // The arrow must sit directly in the popup, outside the scrolling body,
    // so it is not clipped and animates together with the surface.
    expect(arrow.parentElement).toBe(popover);
  });

  it('moves focus into the content and restores it on Escape', async () => {
    const user = userEvent.setup();
    render(<ExamplePopover />);

    const { trigger } = await openPopover(user);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Filter query' })).toHaveFocus();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes when the trigger is pressed again', async () => {
    const user = userEvent.setup();
    render(<ExamplePopover />);
    const { trigger } = await openPopover(user);

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ExamplePopover />
        <button type="button">Outside</button>
      </div>,
    );
    await openPopover(user);

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes from PopoverClose', async () => {
    const user = userEvent.setup();
    render(<ExamplePopover />);
    await openPopover(user);

    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('supports controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<ExamplePopover open onOpenChange={onOpenChange} />);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('allows non-dialog roles', async () => {
    const user = userEvent.setup();
    render(<ExamplePopover contentProps={{ role: 'region' }} />);

    const trigger = screen.getByRole('button', { name: 'Open filters' });
    await user.click(trigger);

    expect(await screen.findByRole('region')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies positioning, sizing, and animation attributes', async () => {
    render(
      <Popover defaultOpen>
        <PopoverPortal>
          <PopoverPositioner side="top" align="start">
            <PopoverContent
              minWidth="16rem"
              maxWidth="20rem"
              maxHeight="12rem"
            >
              <PopoverTitle>Settings</PopoverTitle>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>,
    );

    const popover = await screen.findByRole('dialog');
    expect(popover).toHaveAttribute('data-side', 'top');
    expect(popover).toHaveAttribute('data-align', 'start');
    expect(popover).toHaveStyle({
      minWidth: '16rem',
      maxWidth: '20rem',
      maxHeight: '12rem',
    });
  });

  it('forwards refs to the content', async () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Popover defaultOpen>
        <PopoverPortal>
          <PopoverPositioner>
            <PopoverContent ref={ref}>
              <PopoverTitle>Settings</PopoverTitle>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>,
    );

    const popover = await screen.findByRole('dialog');
    expect(ref.current).toBe(popover);
  });
});
