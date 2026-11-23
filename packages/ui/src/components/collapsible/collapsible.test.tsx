import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { createRef, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from './collapsible';
import { Button } from '../button';

function renderCollapsible(props: Partial<ComponentProps<typeof Collapsible>> = {}) {
  render(
    <Collapsible {...props}>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsiblePanel>Hidden details</CollapsiblePanel>
    </Collapsible>,
  );

  return screen.getByRole('button', { name: 'Details' });
}

describe('Collapsible', () => {
  it('renders collapsed by default and toggles from the trigger', async () => {
    const user = userEvent.setup();
    const trigger = renderCollapsible();

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(await screen.findByText('Hidden details')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();
    });
  });

  it('starts open with defaultOpen', async () => {
    renderCollapsible({ defaultOpen: true });

    expect(await screen.findByText('Hidden details')).toBeInTheDocument();
  });

  it('reports changes without opening when controlled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const trigger = renderCollapsible({ open: false, onOpenChange });

    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();
  });

  it('ignores interactions when disabled', async () => {
    const user = userEvent.setup();
    const trigger = renderCollapsible({ disabled: true });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();
  });

  it('keeps the panel mounted when keepMounted is set', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel keepMounted>Hidden details</CollapsiblePanel>
      </Collapsible>,
    );

    const content = screen.getByText('Hidden details');

    expect(content).toBeInTheDocument();
    expect(content).not.toBeVisible();
  });

  it('renders a custom icon and hides it on request', () => {
    const { unmount } = render(
      <Collapsible>
        <CollapsibleTrigger icon={Plus}>Details</CollapsibleTrigger>
        <CollapsiblePanel>Hidden details</CollapsiblePanel>
      </Collapsible>,
    );

    expect(screen.getByRole('button', { name: 'Details' }).querySelector('svg')).not.toBeNull();
    unmount();

    render(
      <Collapsible>
        <CollapsibleTrigger icon={null}>Details</CollapsibleTrigger>
        <CollapsiblePanel>Hidden details</CollapsiblePanel>
      </Collapsible>,
    );

    expect(screen.getByRole('button', { name: 'Details' }).querySelector('svg')).toBeNull();
  });

  it('replaces the trigger with a custom render element', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible>
        <CollapsibleTrigger render={<Button variant="outline">Toggle details</Button>} />
        <CollapsiblePanel>Hidden details</CollapsiblePanel>
      </Collapsible>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle details' }));

    expect(await screen.findByText('Hidden details')).toBeInTheDocument();
  });

  it('forwards refs and class names', () => {
    const rootRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const panelRef = createRef<HTMLDivElement>();

    render(
      <Collapsible ref={rootRef} className="root-class" defaultOpen>
        <CollapsibleTrigger ref={triggerRef} className="trigger-class">
          Details
        </CollapsibleTrigger>
        <CollapsiblePanel ref={panelRef} className="panel-class">
          Hidden details
        </CollapsiblePanel>
      </Collapsible>,
    );

    expect(rootRef.current).toHaveClass('root-class');
    expect(triggerRef.current).toHaveClass('trigger-class');
    expect(panelRef.current).toHaveClass('panel-class');
  });
});
