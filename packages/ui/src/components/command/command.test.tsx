import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Command, CommandDialog } from './command';

function renderCommand(onSelect = vi.fn()) {
  render(
    <Command label="Command menu">
      <Command.Input placeholder="Type a command" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Pages">
          <Command.Item value="Home" onSelect={onSelect}>
            Home
          </Command.Item>
          <Command.Item value="Settings" keywords={['preferences']} onSelect={onSelect}>
            Settings
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Actions">
          <Command.Item value="Create task" disabled onSelect={onSelect}>
            Create task
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command>,
  );

  return {
    input: screen.getByRole('combobox', { name: 'Search commands' }),
    onSelect,
  };
}

describe('Command', () => {
  it('lists every command under its group', () => {
    renderCommand();

    expect(screen.getByRole('listbox', { name: 'Command menu' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters commands as the user types', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();

    await user.type(input, 'set');

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Settings' })).toBeInTheDocument();
  });

  it('matches keywords that do not appear in the label', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();

    await user.type(input, 'preferences');

    expect(screen.getByRole('option', { name: 'Settings' })).toBeInTheDocument();
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();

    await user.type(input, 'zzz');

    expect(screen.getByText('No results found.')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('highlights the first enabled command and follows the arrow keys', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();
    await user.click(input);

    const [home, settings] = screen.getAllByRole('option');

    expect(home).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', home?.id);

    await user.keyboard('{ArrowDown}');
    expect(settings).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowUp}');
    expect(home).toHaveAttribute('aria-selected', 'true');
  });

  it('skips disabled commands while moving', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();
    await user.click(input);

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowUp}');
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Home' }).id,
    );

    expect(screen.getByRole('option', { name: 'Create task' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('runs the highlighted command with Enter', async () => {
    const user = userEvent.setup();
    const { input, onSelect } = renderCommand();
    await user.click(input);

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledWith('Settings');
  });

  it('runs a command on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderCommand(onSelect);

    await user.click(screen.getByRole('option', { name: 'Settings' }));

    expect(onSelect).toHaveBeenCalledWith('Settings');
  });

  it('does not run a disabled command', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { input } = renderCommand(onSelect);

    await user.type(input, 'create');
    await user.keyboard('{Enter}');

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('option', { name: 'Create task' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();
    await user.click(input);

    await user.keyboard('{End}');
    expect(screen.getByRole('option', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{Home}');
    expect(screen.getByRole('option', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps the highlight when loop is on', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();
    await user.click(input);

    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Home' }).id,
    );
  });

  it('reports the visible result count to assistive technology', async () => {
    const user = userEvent.setup();
    const { input } = renderCommand();

    expect(screen.getByRole('status')).toHaveTextContent('3 results');

    await user.type(input, 'set');
    expect(screen.getByRole('status')).toHaveTextContent('1 result');
  });

  it('skips filtering when shouldFilter is false', async () => {
    const user = userEvent.setup();

    render(
      <Command shouldFilter={false}>
        <Command.Input placeholder="Search" />
        <Command.List>
          <Command.Item value="Home">Home</Command.Item>
        </Command.List>
      </Command>,
    );

    await user.type(screen.getByRole('combobox'), 'zzz');

    expect(screen.getByRole('option', { name: 'Home' })).toBeVisible();
  });
});

describe('Command.Dialog', () => {
  it('opens a palette, focuses the input, and closes on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <CommandDialog defaultOpen title="Command menu" onOpenChange={onOpenChange}>
        <Command.Input placeholder="Type a command" />
        <Command.List>
          <Command.Item value="Home">Home</Command.Item>
        </Command.List>
      </CommandDialog>,
    );

    expect(await screen.findByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
