'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { FileText, FolderOpen, Moon, Plus, Settings, Trash2, User } from 'lucide-react';

import { Box, Button, Icon, Stack, Text } from '@orkest/ui';
import { Command } from '@orkest/ui/client';

const pages = [
  { value: 'Home', icon: FolderOpen },
  { value: 'Projects', icon: FileText },
  { value: 'Settings', icon: Settings },
];

export function CommandBasicExample() {
  const [lastAction, setLastAction] = useState('Nothing yet');

  return (
    <Stack gap={3}>
      <Box border radius="xl" background="surface-raised" style={{ maxWidth: 440 }}>
        <Command label="Command menu">
          <Command.Input placeholder="Type a command or search…" />
          <Command.List>
            <Command.Empty>No matching commands.</Command.Empty>
            <Command.Group heading="Pages">
              {pages.map((page) => (
                <Command.Item
                  key={page.value}
                  value={page.value}
                  onSelect={(value) => setLastAction(`Opened ${value}`)}
                >
                  <Icon icon={page.icon} size="sm" />
                  {page.value}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Actions">
              <Command.Item value="New project" onSelect={() => setLastAction('Created a project')}>
                <Icon icon={Plus} size="sm" />
                New project
              </Command.Item>
              <Command.Item
                value="Invite member"
                onSelect={() => setLastAction('Invited a member')}
              >
                <Icon icon={User} size="sm" />
                Invite member
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </Box>
      <Text size="sm" tone="muted">
        Last action: {lastAction}
      </Text>
    </Stack>
  );
}

const dialogs = [
  { value: 'Open project', icon: FolderOpen },
  { value: 'New note', icon: FileText },
  { value: 'Toggle theme', icon: Moon },
  { value: 'Delete workspace', icon: Trash2 },
];

function subscribeToPlatform() {
  return () => undefined;
}

/** Platform-aware key labels. The server snapshot assumes the non-Mac keyboard. */
function useIsMac() {
  return useSyncExternalStore(
    subscribeToPlatform,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );
}

export function CommandDialogExample() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('No command has run.');
  const shortcut = useIsMac() ? '⌘ K' : 'Ctrl K';

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <Stack gap={3}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command menu
      </Button>
      <Command.Dialog open={open} onOpenChange={setOpen} title="Command menu">
        <Command.Input placeholder="Type a command or search…" />
        <Command.List>
          <Command.Empty>No matching commands.</Command.Empty>
          <Command.Group heading="Suggested">
            {dialogs.map((item) => (
              <Command.Item
                key={item.value}
                value={item.value}
                onSelect={(value) => {
                  setStatus(`Ran ${value.toLowerCase()}`);
                  setOpen(false);
                }}
              >
                <Icon icon={item.icon} size="sm" />
                {item.value}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
      <Text size="sm" tone="muted">
        Shortcut: {shortcut} · {status}
      </Text>
    </Stack>
  );
}

export function CommandShortcutExample() {
  const isMac = useIsMac();
  const mod = isMac ? '⌘' : 'Ctrl+';
  const shiftMod = isMac ? '⇧⌘' : 'Ctrl+Shift+';

  return (
    <Box border radius="xl" background="surface-raised" style={{ maxWidth: 440 }}>
      <Command label="Command menu">
        <Command.Input placeholder="Search commands…" />
        <Command.List>
          <Command.Empty>No matching commands.</Command.Empty>
          <Command.Group heading="Workspace">
            <Command.Item value="New project" keywords={['create']}>
              <Icon icon={Plus} size="sm" />
              New project
              <Command.Shortcut>{mod}N</Command.Shortcut>
            </Command.Item>
            <Command.Item value="Open settings" keywords={['preferences']}>
              <Icon icon={Settings} size="sm" />
              Open settings
              <Command.Shortcut>{mod},</Command.Shortcut>
            </Command.Item>
            <Command.Item value="Archive project" disabled>
              <Icon icon={FolderOpen} size="sm" />
              Archive project
              <Command.Shortcut>{shiftMod}A</Command.Shortcut>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </Box>
  );
}
