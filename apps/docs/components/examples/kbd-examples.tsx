import { Kbd, Stack, Text } from '@orkest/ui';

export function KbdBasicExample() {
  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2} align="center">
        <Text size="sm" tone="muted">
          Open the command menu
        </Text>
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="sm">K</Kbd>
      </Stack>
      <Stack direction="row" gap={2} align="center">
        <Text size="sm" tone="muted">
          Move between results
        </Text>
        <Kbd size="sm">↑</Kbd>
        <Kbd size="sm">↓</Kbd>
      </Stack>
      <Stack direction="row" gap={2} align="center">
        <Text size="sm" tone="muted">
          Accept or dismiss
        </Text>
        <Kbd size="sm">Enter</Kbd>
        <Kbd size="sm">Esc</Kbd>
      </Stack>
      <Stack direction="row" gap={2} align="center">
        <Text size="sm" tone="muted">
          Move focus
        </Text>
        <Kbd size="sm">Tab</Kbd>
      </Stack>
    </Stack>
  );
}
