import {
  Box,
  Button,
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  Grid,
  Separator,
  Stack,
  Text,
} from '@orkest/ui';
import { Inbox, Search } from 'lucide-react';

export function EmptyStateBasicExample() {
  return (
    <EmptyState
      icon={Inbox}
      title="No invoices yet"
      description="Invoices appear here once a customer is billed."
      action={
        <>
          <Button>Create invoice</Button>
          <Button variant="outline">Learn about billing</Button>
        </>
      }
    />
  );
}

export function EmptyStateSizesExample() {
  return (
    <Stack gap={3}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Box key={size} background="surface" border radius="md">
          <EmptyState
            size={size}
            title={`No activity (${size})`}
            description="Events will show up here as your team works."
          />
        </Box>
      ))}
    </Stack>
  );
}

export function EmptyStateAlignExample() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap={3}>
      <Box background="surface" border radius="md">
        <EmptyState
          align="center"
          icon={Search}
          title="Centered"
          description="The default. Use it for a region or a whole page."
        />
      </Box>
      <Box background="surface" border radius="md">
        <EmptyState
          align="start"
          icon={Search}
          title="Start aligned"
          description="Use it when the surrounding content is left aligned."
        />
      </Box>
    </Grid>
  );
}

export function EmptyStateCompositionExample() {
  return (
    <EmptyState size="lg" align="start">
      <EmptyStateIcon icon={Search} />
      <EmptyStateTitle level={2}>{'No results for "quarterly report"'}</EmptyStateTitle>
      <EmptyStateDescription>Check the spelling or try a broader keyword.</EmptyStateDescription>
      <EmptyStateAction>
        <Button>Clear filters</Button>
        <Button variant="outline">Browse all files</Button>
      </EmptyStateAction>
      <EmptyStateDescription>
        Search also supports file type and date filters.
      </EmptyStateDescription>
    </EmptyState>
  );
}

export function EmptyStateEmbeddedExample() {
  return (
    <Box background="surface" border radius="md">
      <Box as="header" padding={4}>
        <Stack direction="row" gap={3} align="center" justify="between">
          <Text weight="semibold">Team members</Text>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </Stack>
      </Box>
      <Separator />
      <EmptyState
        size="sm"
        title="No members yet"
        description="Invite someone to collaborate in this workspace."
      />
    </Box>
  );
}

export function EmptyStateImageExample() {
  return (
    <EmptyState
      size="lg"
      image={{
        src: '/empty-state/empty-inbox.svg',
        alt: 'An empty inbox with no documents',
      }}
      title="Your inbox is all caught up"
      description="New messages will land here as soon as someone writes to you."
      action={<Button variant="outline">Compose a message</Button>}
    />
  );
}
