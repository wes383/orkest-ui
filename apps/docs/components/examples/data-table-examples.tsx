'use client';

import { useState } from 'react';

import { Badge, Stack, Text } from '@orkest/ui';
import { DataTable, type DataColumn } from '@orkest/ui/client';

interface Invoice {
  id: string;
  customer: string;
  owner: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const statusVariant = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
} as const;

const invoices: Invoice[] = [
  { id: 'INV-1042', customer: 'Northwind', owner: 'Ada', amount: 2400, status: 'Paid' },
  { id: 'INV-1043', customer: 'Contoso', owner: 'Grace', amount: 980, status: 'Pending' },
  { id: 'INV-1044', customer: 'Fabrikam', owner: 'Linus', amount: 1720, status: 'Overdue' },
  { id: 'INV-1045', customer: 'Tailspin', owner: 'Ada', amount: 520, status: 'Paid' },
  { id: 'INV-1046', customer: 'Wide World', owner: 'Grace', amount: 3100, status: 'Paid' },
  { id: 'INV-1047', customer: 'Adventure Works', owner: 'Linus', amount: 1450, status: 'Pending' },
  { id: 'INV-1048', customer: 'Blue Yonder', owner: 'Ada', amount: 640, status: 'Paid' },
  { id: 'INV-1049', customer: 'Coho Vineyard', owner: 'Grace', amount: 2210, status: 'Overdue' },
  { id: 'INV-1050', customer: 'Lucern Publishing', owner: 'Linus', amount: 890, status: 'Pending' },
  { id: 'INV-1051', customer: 'Proseware', owner: 'Ada', amount: 1180, status: 'Paid' },
  { id: 'INV-1052', customer: 'School of Fine Art', owner: 'Grace', amount: 430, status: 'Paid' },
  { id: 'INV-1053', customer: 'Trey Research', owner: 'Linus', amount: 2760, status: 'Pending' },
];

const columns: DataColumn<Invoice>[] = [
  { id: 'id', header: 'Invoice', accessor: (row) => row.id, minWidth: 96 },
  { id: 'customer', header: 'Customer', accessor: (row) => row.customer, minWidth: 160 },
  { id: 'owner', header: 'Owner', accessor: (row) => row.owner },
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

export function DataTableExample() {
  return <DataTable columns={columns} data={invoices} caption="Invoices" getRowId={(row) => row.id} />;
}

export function DataTableSelectionExample() {
  const [selected, setSelected] = useState<Invoice[]>([]);

  return (
    <Stack gap={2}>
      <Text size="sm" tone="muted">
        {selected.length === 0
          ? 'No rows selected'
          : `Selected: ${selected.map((row) => row.id).join(', ')}`}
      </Text>
      <DataTable
        columns={columns}
        data={invoices.slice(0, 5)}
        caption="Invoices"
        selectable
        paginated={false}
        getRowId={(row) => row.id}
        onSelectionChange={setSelected}
      />
    </Stack>
  );
}

export function DataTableExpandableExample() {
  return (
    <DataTable
      columns={columns}
      data={invoices.slice(0, 5)}
      caption="Invoices"
      expandable
      paginated={false}
      getRowId={(row) => row.id}
      renderExpanded={(row) => (
        <Stack gap={1}>
          <Text size="sm" weight="semibold">
            {row.customer}
          </Text>
          <Text size="sm" tone="muted">
            Owner {row.owner} · {row.status.toLowerCase()} invoice for{' '}
            {row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Text>
        </Stack>
      )}
    />
  );
}
