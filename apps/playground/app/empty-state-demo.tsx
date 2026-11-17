import {
  Box,
  Button,
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  Heading,
  Stack,
} from '@orkest/ui';
import { FileSearch, Inbox, Search } from 'lucide-react';

export function EmptyStateDemo() {
  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Empty State
      </Heading>

      <Box background="surface" border radius="md">
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
      </Box>

      <Stack direction="row" gap={3} wrap align="stretch">
        <Box background="surface" border radius="md">
          <EmptyState size="sm" title="No activity" description="Nothing happened today." />
        </Box>
        <Box background="surface" border radius="md">
          <EmptyState
            size="sm"
            align="start"
            icon={Search}
            title="No matches"
            description="Try a different keyword."
          />
        </Box>
      </Stack>

      <Box background="surface" border radius="md">
        <EmptyState size="lg" align="start">
          <EmptyStateIcon icon={FileSearch} />
          <EmptyStateTitle level={3}>No results for this filter</EmptyStateTitle>
          <EmptyStateDescription>Check the spelling or widen the date range.</EmptyStateDescription>
          <EmptyStateAction>
            <Button>Clear filters</Button>
            <Button variant="outline">Browse all files</Button>
          </EmptyStateAction>
          <EmptyStateDescription>Search also supports file type filters.</EmptyStateDescription>
        </EmptyState>
      </Box>
    </Stack>
  );
}
