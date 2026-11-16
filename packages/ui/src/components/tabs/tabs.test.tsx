import { createRef } from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Settings } from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  type TabsListProps,
  type TabsProps,
} from './tabs';

function ExampleTabs({
  rootProps,
  listProps,
}: {
  rootProps?: TabsProps;
  listProps?: TabsListProps;
} = {}) {
  return (
    <Tabs {...rootProps}>
      <TabsList {...listProps}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsIndicator data-testid="indicator" />
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
      <TabsContent value="settings">Settings panel</TabsContent>
    </Tabs>
  );
}

function getTabs() {
  return within(screen.getByRole('tablist')).getAllByRole('tab');
}

describe('Tabs', () => {
  it('renders a tablist and selects the first tab by default', () => {
    render(<ExampleTabs />);

    const tabs = getTabs();
    const panel = screen.getByRole('tabpanel');

    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(panel).toHaveTextContent('Overview panel');
    expect(panel).toHaveAccessibleName('Overview');
    expect(tabs[0]).toHaveAttribute('aria-controls', panel.id);
    expect(screen.getByTestId('indicator')).toBeInTheDocument();
  });

  it('switches panels on click and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ExampleTabs rootProps={{ onValueChange }} />);

    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    expect(onValueChange).toHaveBeenCalledWith(
      'activity',
      expect.objectContaining({ reason: 'none' }),
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('supports controlled values without changing internally', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ExampleTabs
        rootProps={{ value: 'overview', onValueChange }}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'Settings' }));

    expect(onValueChange).toHaveBeenCalledWith(
      'settings',
      expect.objectContaining({ reason: 'none' }),
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('activates on arrow-key focus in automatic mode', async () => {
    const user = userEvent.setup();
    render(<ExampleTabs />);

    const [first, second] = getTabs();
    first?.focus();
    await user.keyboard('{ArrowRight}');

    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('moves focus without activating in manual mode', async () => {
    const user = userEvent.setup();
    render(<ExampleTabs listProps={{ activationMode: 'manual' }} />);

    const [first, second] = getTabs();
    first?.focus();
    await user.keyboard('{ArrowRight}');

    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');

    await user.keyboard('{Enter}');

    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('moves to the first and last tab with Home and End', async () => {
    const user = userEvent.setup();
    render(<ExampleTabs />);

    const [first, , last] = getTabs();
    first?.focus();

    await user.keyboard('{End}');
    expect(last).toHaveFocus();
    expect(last).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('aria-selected', 'true');
  });

  it('supports vertical arrow keys and exposes the orientation', async () => {
    const user = userEvent.setup();
    render(<ExampleTabs rootProps={{ orientation: 'vertical' }} />);

    const [first, second] = getTabs();
    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );

    first?.focus();
    await user.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(first).toHaveFocus();
  });

  it('skips disabled tabs during keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two" disabled>
            Two
          </TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>
        <TabsContent value="one">One panel</TabsContent>
        <TabsContent value="two">Two panel</TabsContent>
        <TabsContent value="three">Three panel</TabsContent>
      </Tabs>,
    );

    const disabledTab = screen.getByRole('tab', { name: 'Two' });
    expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    expect(disabledTab).toHaveAttribute('data-disabled');

    screen.getByRole('tab', { name: 'One' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Three panel');
  });

  it('wraps focus by default and can disable looping', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ExampleTabs />);

    const first = getTabs()[0];
    first?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();

    unmount();

    render(<ExampleTabs listProps={{ loop: false }} />);
    const [firstWithoutLoop] = getTabs();
    firstWithoutLoop?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(firstWithoutLoop).toHaveFocus();
  });

  it('keeps hidden panels mounted when keepMounted is set', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity" keepMounted>
          Activity panel
        </TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    await user.click(screen.getByRole('tab', { name: 'Overview' }));

    const hiddenPanel = screen
      .getAllByRole('tabpanel', { hidden: true })
      .find((panel) => panel.textContent === 'Activity panel');

    expect(hiddenPanel).toBeDefined();
    expect(hiddenPanel).toHaveAttribute('hidden');
  });

  it('renders icons and badges inside triggers', () => {
    render(
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general" icon={Settings} badge={3}>
            General
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">General panel</TabsContent>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: /General/ });
    expect(tab.querySelector('svg')).toBeInTheDocument();
    expect(within(tab).getByText('3')).toBeInTheDocument();
  });

  it('applies list presentation props as data attributes', () => {
    render(
      <ExampleTabs
        listProps={{
          variant: 'pills',
          size: 'lg',
          fullWidth: true,
        }}
      />,
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('data-variant', 'pills');
    expect(tablist).toHaveAttribute('data-size', 'lg');
    expect(tablist).toHaveAttribute('data-full-width');
    expect(tablist).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('disables the whole list while keeping the panel visible', () => {
    render(<ExampleTabs rootProps={{ disabled: true }} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('inert');
    expect(tablist).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('forwards refs to every part', () => {
    const rootRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Tabs defaultValue="overview" ref={rootRef}>
        <TabsList ref={listRef}>
          <TabsTrigger ref={triggerRef} value="overview">
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent ref={contentRef} value="overview">
          Overview panel
        </TabsContent>
      </Tabs>,
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
