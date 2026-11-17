'use client';

import { Copy, Ellipsis, Pencil, Trash2 } from 'lucide-react';

import {
  IconButton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@orkest/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@orkest/ui/client';

const invoices = [
  { id: 'INV-1042', customer: 'Northwind', amount: '2,400.00' },
  { id: 'INV-1043', customer: 'Contoso', amount: '980.00' },
  { id: 'INV-1044', customer: 'Fabrikam', amount: '1,720.00' },
];

export function TableActionsExample() {
  return (
    <Table hoverable>
      <TableCaption>Invoices with a row actions menu.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead align="right">Amount</TableHead>
          <TableHead align="right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell align="right">{invoice.amount}</TableCell>
            <TableCell align="right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <IconButton
                      icon={Ellipsis}
                      label={`Actions for ${invoice.id}`}
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
