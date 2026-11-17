'use client';

import { useState } from 'react';

import { Badge, Heading, Stack, Text } from '@orkest/ui';
import { DataTable, type DataColumn } from '@orkest/ui/client';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const statusVariant = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
} as const;

const invoices: Invoice[] = Array.from({ length: 14 }, (_, index) => ({
  id: `INV-${1042 + index}`,
  customer: ['Northwind', 'Contoso', 'Fabrikam', 'Tailspin'][index % 4] ?? 'Northwind',
  amount: 400 + index * 137,
  status: (['Paid', 'Pending', 'Overdue'] as const)[index % 3] ?? 'Paid',
}));

const columns: DataColumn<Invoice>[] = [
  { id: 'id', header: 'Invoice', accessor: (row) => row.id, minWidth: 96 },
  { id: 'customer', header: 'Customer', accessor: (row) => row.customer, minWidth: 160 },
  {
    id: 'amount',
    header: 'Amount',
    accessor: (row) => row.amount,
    align: 'right',
    cell: (row) => row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export function DataTableDemo() {
  const [selected, setSelected] = useState<Invoice[]>([]);

  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        DataTable
      </Heading>
      <Text size="sm" tone="muted">
        {selected.length === 0 ? 'No rows selected' : `${selected.length} row(s) selected`}
      </Text>
      <DataTable
        columns={columns}
        data={invoices}
        caption="Invoices"
        pageSize={5}
        selectable
        expandable
        getRowId={(row) => row.id}
        onSelectionChange={setSelected}
        renderExpanded={(row) => (
          <Text size="sm" tone="muted">
            {row.customer} owes {row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.
          </Text>
        )}
      />
    </Stack>
  );
}
