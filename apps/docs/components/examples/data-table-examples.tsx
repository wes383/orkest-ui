'use client';

import { useState } from 'react';
import { Copy, Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { Badge, IconButton, Stack, Text } from '@orkest/ui';
import {
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type DataColumn,
} from '@orkest/ui/client';

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
        variant="bordered"
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

const columnsWithActions: DataColumn<Invoice>[] = [
  ...columns,
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => null,
    sortable: false,
    searchable: false,
    align: 'right',
    minWidth: 88,
    cell: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <IconButton
              icon={Ellipsis}
              label={`Actions for ${row.id}`}
              size="sm"
              variant="ghost"
            />
          }
        />
        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <DropdownMenuItem leftIcon={Pencil}>Edit invoice</DropdownMenuItem>
            <DropdownMenuItem leftIcon={Copy}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem leftIcon={Trash2}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    ),
  },
];

export function DataTableActionsExample() {
  return (
    <DataTable
      columns={columnsWithActions}
      data={invoices.slice(0, 5)}
      caption="Invoices"
      paginated={false}
      getRowId={(row) => row.id}
    />
  );
}

interface WideInvoice {
  id: string;
  customer: string;
  email: string;
  owner: string;
  region: string;
  issued: string;
  due: string;
  amount: number;
  tax: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const wideInvoices: WideInvoice[] = invoices.slice(0, 6).map((invoice, index) => ({
  ...invoice,
  email: `${invoice.customer.toLowerCase().split(' ').join('.')}@example.com`,
  region: ['EMEA', 'APAC', 'Americas'][index % 3] ?? 'EMEA',
  issued: `2026-0${(index % 6) + 1}-14`,
  due: `2026-0${(index % 6) + 2}-14`,
  tax: Math.round(invoice.amount * 0.2),
}));

const currency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const wideColumns: DataColumn<WideInvoice>[] = [
  { id: 'id', header: 'Invoice', accessor: (row) => row.id, minWidth: 110 },
  { id: 'customer', header: 'Customer', accessor: (row) => row.customer, minWidth: 170 },
  { id: 'email', header: 'Billing email', accessor: (row) => row.email, minWidth: 220 },
  { id: 'owner', header: 'Owner', accessor: (row) => row.owner, minWidth: 120 },
  { id: 'region', header: 'Region', accessor: (row) => row.region, minWidth: 120 },
  { id: 'issued', header: 'Issued', accessor: (row) => row.issued, minWidth: 120 },
  { id: 'due', header: 'Due', accessor: (row) => row.due, minWidth: 120 },
  {
    id: 'amount',
    header: 'Amount',
    accessor: (row) => row.amount,
    align: 'right',
    minWidth: 120,
    cell: (row) => currency(row.amount),
  },
  {
    id: 'tax',
    header: 'Tax',
    accessor: (row) => row.tax,
    align: 'right',
    minWidth: 100,
    cell: (row) => currency(row.tax),
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    minWidth: 110,
    cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

export function DataTableWideExample() {
  return (
    <DataTable
      columns={wideColumns}
      data={wideInvoices}
      caption="Invoices in a wide table"
      pageSize={5}
      size="sm"
      paginationLabel="Wide table pages"
      getRowId={(row) => row.id}
    />
  );
}
