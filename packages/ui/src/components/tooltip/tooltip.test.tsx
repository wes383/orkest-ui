import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
} from './tooltip';

function ExampleTooltip({
  contentProps,
  disabled = false,
}: {
  contentProps?: TooltipContentProps;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delay={0}>
      <Tooltip disabled={disabled}>
        <TooltipTrigger aria-label="Settings">Settings</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent {...contentProps}>
            <TooltipArrow data-testid="tooltip-arrow" />
            Manage workspace settings
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('shows on hover and hides when the pointer leaves', async () => {
    const user = userEvent.setup();
    render(<ExampleTooltip />);

    const trigger = screen.getByRole('button', { name: 'Settings' });
    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Manage workspace settings');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument();

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows on keyboard focus and hides on blur', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ExampleTooltip />
        <button type="button">After</button>
      </div>,
    );

    await user.tab();

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.tab();

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    render(<ExampleTooltip />);

    await user.hover(screen.getByRole('button', { name: 'Settings' }));
    await screen.findByRole('tooltip');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports controlled open state', async () => {
    render(
      <TooltipProvider delay={0}>
        <Tooltip open>
          <TooltipTrigger aria-label="Help">Help</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>Help content</TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<ExampleTooltip disabled />);

    await user.hover(screen.getByRole('button', { name: 'Settings' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('applies positioning and sizing props', async () => {
    render(
      <TooltipProvider delay={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger aria-label="Details">Details</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              side="bottom"
              align="start"
              maxWidth="12rem"
              maxHeight="8rem"
            >
              Details
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>,
    );

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-side', 'bottom');
    expect(tooltip).toHaveAttribute('data-align', 'start');
    expect(tooltip).toHaveStyle({
      maxWidth: '12rem',
      maxHeight: '8rem',
    });
  });

  it('forwards refs to the tooltip content', async () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <TooltipProvider delay={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger aria-label="Ref">Ref</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent ref={ref}>Ref content</TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>,
    );

    const tooltip = await screen.findByRole('tooltip');
    expect(ref.current).toBe(tooltip);
  });
});
