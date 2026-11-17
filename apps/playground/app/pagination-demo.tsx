'use client';

import { useState } from 'react';

import { Heading, Pagination, Stack, Text } from '@orkest/ui';

export function PaginationDemo() {
  const [page, setPage] = useState(3);

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Pagination
      </Heading>
      <Stack gap={3} align="start">
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
        <Pagination
          page={page}
          totalPages={40}
          showFirstLast
          onPageChange={(next) => setPage(Math.min(next, 40))}
        />
        <Pagination size="sm" page={Math.min(page, 5)} totalPages={5} onPageChange={setPage} />
        <Pagination page={page} totalPages={1} onPageChange={setPage} />
      </Stack>
      <Text size="sm" tone="muted">
        Page {page}
      </Text>
    </Stack>
  );
}
