import {
  Badge,
  Heading,
  Stack,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@orkest/ui';

const badgeVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
};

const invoices = [
  { id: 'INV-1042', customer: 'Northwind', amount: '2,400.00', status: 'Paid' },
  { id: 'INV-1043', customer: 'Contoso', amount: '980.00', status: 'Pending' },
  { id: 'INV-1044', customer: 'Fabrikam', amount: '1,720.00', status: 'Overdue' },
];

export function TableDemo() {
  return (
    <Stack gap={4}>
      <Heading level={2} size="xl">
        Table
      </Heading>

      <Table striped hoverable>
        <TableCaption>Invoices issued this quarter.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead align="right">Amount</TableHead>
            <TableHead align="center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell align="right">{invoice.amount}</TableCell>
              <TableCell align="center">
                <Badge variant={badgeVariant[invoice.status]}>{invoice.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell />
            <TableCell align="right">5,100.00</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      <Table variant="bordered" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead align="right">Q1</TableHead>
            <TableHead align="right">Q2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead scope="row" rowSpan={2}>
              Design
            </TableHead>
            <TableCell align="right">12</TableCell>
            <TableCell align="right">14</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right">9</TableCell>
            <TableCell align="right">11</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align="center">
              Q3 figures are provisional.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}
