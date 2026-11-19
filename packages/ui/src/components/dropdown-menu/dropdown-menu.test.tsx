import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Copy, Pencil, Settings, Share2, Trash2, type LucideIcon } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuProps,
} from './dropdown-menu';

type User = ReturnType<typeof userEvent.setup>;

interface ActionsMenuProps extends DropdownMenuProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
}

function ActionsMenu({
  onEdit = () => {},
  onDuplicate = () => {},
  onArchive = () => {},
  onDelete = () => {},
  onSettings = () => {},
  ...rootProps
}: ActionsMenuProps) {
  return (
    <DropdownMenu {...rootProps}>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem leftIcon={Pencil} onClick={onEdit}>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem leftIcon={Copy} onClick={onDuplicate}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem disabled onClick={onArchive}>
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" leftIcon={Trash2} onClick={onDelete}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLinkItem
            href="#settings"
            leftIcon={Settings}
            onClick={(event) => {
              event.preventDefault();
              onSettings();
            }}
          >
            Settings
          </DropdownMenuLinkItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

async function openActionsMenu(user: User) {
  const trigger = screen.getByRole('button', { name: 'Actions' });
  await user.click(trigger);
  const menu = await screen.findByRole('menu');
  return { trigger, menu };
}

function itemMenu(items: 'checkbox' | 'radio' | 'submenu') {
  if (items === 'checkbox') {
    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem defaultChecked>Show grid</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Show ruler</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    );
  }

  if (items === 'radio') {
    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup defaultValue="list">
              <DropdownMenuRadioItem value="list">List</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="grid">Grid</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens from the trigger, renders through a portal, and exposes menu semantics', async () => {
    const user = userEvent.setup();
    const { container } = render(<ActionsMenu />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const { menu } = await openActionsMenu(user);

    expect(container.contains(menu)).toBe(false);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('closes after a regular item is activated and restores focus', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<ActionsMenu onEdit={onEdit} />);
    const { trigger } = await openActionsMenu(user);

    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('suppresses the trigger focus ring after a keyboard selection', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ActionsMenu />
        <button type="button">After</button>
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await user.tab();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}{Enter}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('data-focus-ring', 'none');

    await user.tab();

    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await waitFor(() => {
      expect(trigger).not.toHaveAttribute('data-focus-ring');
    });

    await user.click(trigger);
    await screen.findByRole('menu');

    expect(trigger).not.toHaveAttribute('data-focus-ring');
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ActionsMenu />
        <button type="button">Outside</button>
      </div>,
    );
    await openActionsMenu(user);

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ActionsMenu />);
    const { trigger } = await openActionsMenu(user);

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('supports controlled open state and reports change reasons', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<ActionsMenu open onOpenChange={onOpenChange} />);
    await screen.findByRole('menu');

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('does not force a controlled closed menu open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<ActionsMenu open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ reason: 'trigger-press' }),
      );
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not open while disabled', async () => {
    const user = userEvent.setup();
    render(<ActionsMenu disabled />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await user.click(trigger);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('navigates with arrow keys, Home, and End', async () => {
    const user = userEvent.setup();
    render(<ActionsMenu />);

    await user.tab();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');

    const edit = screen.getByRole('menuitem', { name: 'Edit' });
    const duplicate = screen.getByRole('menuitem', { name: 'Duplicate' });
    const settings = screen.getByRole('menuitem', { name: 'Settings' });

    expect(edit).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(duplicate).toHaveFocus();

    await user.keyboard('{End}');
    expect(settings).toHaveFocus();

    await user.keyboard('{Home}');
    expect(edit).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(duplicate).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(edit).toHaveFocus();
  });

  it('skips disabled items during arrow navigation', async () => {
    const user = userEvent.setup();
    render(<ActionsMenu />);

    await user.tab();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('skips disabled items for Home and End', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Archive</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem disabled>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    await user.tab();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');

    const edit = screen.getByRole('menuitem', { name: 'Edit' });
    expect(edit).toHaveFocus();

    await user.keyboard('{End}');
    expect(edit).toHaveFocus();

    await user.keyboard('{Home}');
    expect(edit).toHaveFocus();
  });

  it('activates the highlighted item with Enter and Space', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDuplicate = vi.fn();

    const { unmount } = render(<ActionsMenu onEdit={onEdit} onDuplicate={onDuplicate} />);
    await openActionsMenu(user);
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    unmount();

    render(<ActionsMenu onEdit={onEdit} onDuplicate={onDuplicate} />);
    await openActionsMenu(user);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.keyboard(' ');

    expect(onDuplicate).toHaveBeenCalledTimes(1);
  });

  it('does not activate disabled items', async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();
    render(<ActionsMenu onArchive={onArchive} />);
    await openActionsMenu(user);

    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));

    expect(onArchive).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('moves focus out of the menu on Tab', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ActionsMenu />
        <button type="button">After</button>
      </div>,
    );
    await openActionsMenu(user);
    await user.keyboard('{ArrowDown}');

    await user.tab();

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('renders shortcuts as hidden keyboard hints', async () => {
    render(<ActionsMenu defaultOpen />);
    await screen.findByRole('menu');

    const shortcut = screen.getByText('⌘E');

    expect(shortcut.tagName).toBe('KBD');
    expect(shortcut).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the destructive variant to a single item', async () => {
    render(<ActionsMenu defaultOpen />);
    await screen.findByRole('menu');

    const remove = screen.getByRole('menuitem', { name: 'Delete' });

    expect(remove).toHaveAttribute('data-variant', 'destructive');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute(
      'data-variant',
      'default',
    );
  });

  it('aligns inset items with icon items', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Preferences</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    expect(await screen.findByRole('menuitem', { name: 'Preferences' })).toHaveAttribute(
      'data-inset',
      'true',
    );
  });

  it('renders groups, labels, and separators', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>File</DropdownMenuLabel>
              <DropdownMenuItem>New</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Edit</DropdownMenuLabel>
              <DropdownMenuItem>Undo</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    expect(await screen.findAllByRole('group')).toHaveLength(2);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('toggles checkbox items without closing the menu', async () => {
    const user = userEvent.setup();
    render(itemMenu('checkbox'));

    const grid = await screen.findByRole('menuitemcheckbox', {
      name: 'Show grid',
    });
    const ruler = screen.getByRole('menuitemcheckbox', {
      name: 'Show ruler',
    });

    expect(grid).toHaveAttribute('aria-checked', 'true');
    expect(ruler).toHaveAttribute('aria-checked', 'false');

    await user.click(ruler);

    expect(ruler).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(grid);

    expect(grid).toHaveAttribute('aria-checked', 'false');
  });

  it('selects radio items and keeps the menu open', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup defaultValue="list" onValueChange={onValueChange}>
              <DropdownMenuRadioItem value="list">List</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="grid">Grid</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    const list = await screen.findByRole('menuitemradio', { name: 'List' });
    const grid = screen.getByRole('menuitemradio', { name: 'Grid' });

    expect(list).toHaveAttribute('aria-checked', 'true');
    expect(grid).toHaveAttribute('aria-checked', 'false');

    await user.click(grid);

    expect(grid).toHaveAttribute('aria-checked', 'true');
    expect(list).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).toHaveBeenCalledWith(
      'grid',
      expect.objectContaining({ reason: 'item-press' }),
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('opens a submenu and renders nested items in a portal', async () => {
    const user = userEvent.setup();
    render(itemMenu('submenu'));

    const trigger = await screen.findByRole('menuitem', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    await user.click(trigger);

    expect(await screen.findByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getAllByRole('menu')).toHaveLength(2);
  });

  it('renders link items as anchors and closes after navigation', async () => {
    const user = userEvent.setup();
    const onSettings = vi.fn();
    render(<ActionsMenu onSettings={onSettings} />);
    await openActionsMenu(user);

    const link = screen.getByRole('menuitem', { name: 'Settings' });

    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#settings');

    await user.click(link);

    expect(onSettings).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('applies positioning and width props to the surface', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent minWidth="18rem" maxWidth={320} maxHeight="12rem">
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    const menu = await screen.findByRole('menu');

    expect(menu).toHaveAttribute('data-side', 'bottom');
    expect(menu).toHaveAttribute('data-align', 'start');
    expect(menu).toHaveStyle({
      minWidth: '18rem',
      maxWidth: '320px',
      maxHeight: '12rem',
    });
  });

  it('forwards refs to the menu surface', async () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent ref={ref}>
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    const menu = await screen.findByRole('menu');

    expect(ref.current).toBe(menu);
  });

  it('accepts a custom trigger render element', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" aria-label="Open actions" />} />
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole('button', { name: 'Open actions' });

    expect(trigger).toHaveAttribute('data-variant', 'ghost');

    await user.click(trigger);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  it('supports icons without polluting accessible names', async () => {
    const icon: LucideIcon = Share2;
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem leftIcon={icon}>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    const item = await screen.findByRole('menuitem', { name: 'Share' });

    expect(item.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
