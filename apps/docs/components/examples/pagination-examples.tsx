'use client';

import { useState } from 'react';

import { Pagination, Stack, Text } from '@orkest/ui';

export function PaginationBasicExample() {
  const [page, setPage] = useState(1);

  return (
    <Stack gap={2} align="center">
      <Pagination page={page} totalPages={5} onPageChange={setPage} />
      <Text size="sm" tone="muted">
        Page {page} of 5
      </Text>
    </Stack>
  );
}

export function PaginationManyPagesExample() {
  const [page, setPage] = useState(1);

  return (
    <Stack gap={2}>
      <Pagination page={page} totalPages={20} onPageChange={setPage} />
      <Text size="sm" tone="muted">
        Page {page} of 20
      </Text>
    </Stack>
  );
}

export function PaginationFirstLastExample() {
  const [page, setPage] = useState(10);

  return (
    <Stack gap={2}>
      <Pagination page={page} totalPages={20} showFirstLast onPageChange={setPage} />
      <Text size="sm" tone="muted">
        Page {page} of 20
      </Text>
    </Stack>
  );
}

export function PaginationSizesExample() {
  const [page, setPage] = useState(2);

  return (
    <Stack gap={3} align="start">
      <Pagination size="sm" page={page} totalPages={5} onPageChange={setPage} />
      <Pagination size="md" page={page} totalPages={5} onPageChange={setPage} />
      <Pagination size="lg" page={page} totalPages={5} onPageChange={setPage} />
    </Stack>
  );
}
