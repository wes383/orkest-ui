import { Heading, Skeleton, Spinner, Stack, Text } from '@orkest/ui';

export function LoadingDemo() {
  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Loading states
      </Heading>

      <Stack gap={2}>
        <Text size="sm" tone="muted">
          Skeleton
        </Text>
        <Stack direction="row" gap={3} align="center">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack gap={2}>
            <Skeleton width="35%" />
            <Skeleton width="65%" />
          </Stack>
        </Stack>
        <Skeleton variant="rectangular" height={72} animation="wave" />
      </Stack>

      <Stack gap={2}>
        <Text size="sm" tone="muted">
          Spinner
        </Text>
        <Stack direction="row" gap={5} align="center" wrap>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Stack direction="row" gap={2} align="center" role="status">
            <Spinner size="sm" label={null} />
            <Text size="sm" tone="muted">
              Syncing changes…
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
