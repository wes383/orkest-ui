import { Kbd, Stack, Text } from '@orkest/ui';

export function KbdBasicExample() {
  return (
    <Stack direction="row" gap={2} align="center">
      <Text size="sm" tone="muted">
        Open the command menu
      </Text>
      <Kbd size="sm">⌘</Kbd>
      <Kbd>K</Kbd>
    </Stack>
  );
}
