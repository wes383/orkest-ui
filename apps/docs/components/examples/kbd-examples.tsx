import { Kbd, Stack, Text } from '@orkest/ui';

export function KbdBasicExample() {
  return (
    <Stack direction="row" gap={2} align="center">
      <Text size="sm" tone="muted">
        Open the command menu
      </Text>
      <Kbd size="sm">⌘</Kbd>
      <Kbd size="sm">K</Kbd>
    </Stack>
  );
}

const keyGroups = [
  { label: 'Modifiers', keys: ['⌘', '⌥', '⌃', '⇧'] },
  { label: 'Editing', keys: ['Esc', 'Tab', 'Enter', 'Space', 'Backspace', 'Delete'] },
  { label: 'Navigation', keys: ['↑', '↓', '←', '→', 'Home', 'End', 'Page Up', 'Page Down'] },
];

export function KbdSpecialKeysExample() {
  return (
    <Stack gap={3}>
      {keyGroups.map(({ label, keys }) => (
        <Stack key={label} gap={1}>
          <Text size="sm" tone="muted">
            {label}
          </Text>
          <Stack direction="row" gap={1} wrap>
            {keys.map((key) => (
              <Kbd key={key} size="sm">
                {key}
              </Kbd>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
