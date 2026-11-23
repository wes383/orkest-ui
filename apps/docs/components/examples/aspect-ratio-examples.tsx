import { AspectRatio, Box, Stack, Text } from '@orkest/ui';

export function AspectRatioExample() {
  return (
    <Box width="100%" maxWidth={320}>
      <AspectRatio>
        <Box height="100%" background="surface-sunken" radius="xl" border>
          <Stack align="center" justify="center" style={{ height: '100%' }}>
            <Text tone="muted">16 : 9</Text>
          </Stack>
        </Box>
      </AspectRatio>
    </Box>
  );
}
