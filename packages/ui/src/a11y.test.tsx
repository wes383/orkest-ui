import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Inbox, Settings } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './components/alert';
import { Avatar, AvatarFallback } from './components/avatar';
import { Badge } from './components/badge';
import { Button } from './components/button';
import { Calendar } from './components/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/card';
import { Checkbox } from './components/checkbox';
import { Combobox } from './components/combobox';
import { DataTable } from './components/data-table';
import { DatePicker } from './components/date-picker';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './components/dialog';
import { EmptyState } from './components/empty-state';
import { Field, FieldDescription, FieldLabel, FieldMessage } from './components/field';
import { IconButton } from './components/icon-button';
import { Input, Textarea } from './components/input';
import { Pagination } from './components/pagination';
import { Radio, RadioGroup } from './components/radio';
import { MultiSelect, Select } from './components/select';
import { Skeleton } from './components/skeleton';
import { Spinner } from './components/spinner';
import { Switch } from './components/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs';
import { Tag } from './components/tag';
import { TimePicker } from './components/time-picker';
import { Heading, Paragraph } from './components/typography';

const planOptions = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
];

describe('accessibility', () => {
  it('renders static content without violations', async () => {
    const { container } = render(
      <main>
        <Heading level={1}>Team settings</Heading>
        <Paragraph>Manage who can access this workspace.</Paragraph>
        <Button>Save changes</Button>
        <IconButton icon={Settings} label="Open settings" />
        <Badge variant="success">Active</Badge>
        <Tag removable onRemove={() => {}}>
          Design
        </Tag>
        <Alert variant="warning" closable>
          <AlertTitle>Unverified domain</AlertTitle>
          <AlertDescription>Members cannot join until the domain is verified.</AlertDescription>
        </Alert>
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Skeleton width={160} />
        <Spinner label="Loading" />
        <Card>
          <CardHeader>
            <CardTitle level={2}>Billing</CardTitle>
            <CardDescription>Invoices and payment method.</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Table>
          <TableCaption>Invoices issued this quarter.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead align="right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV-1042</TableCell>
              <TableCell align="right">2400.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DataTable
          caption="Invoices"
          data={[{ name: 'Ada' }, { name: 'Grace' }]}
          columns={[{ id: 'name', header: 'Name', accessor: (row: { name: string }) => row.name }]}
          getRowId={(row) => row.name}
        />
        <Pagination page={2} totalPages={5} onPageChange={() => {}} />
        <EmptyState
          icon={Inbox}
          title="No invoices"
          description="Invoices appear here once a customer is billed."
          action={<Button>Create invoice</Button>}
        />
      </main>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders labelled form controls without violations', async () => {
    const { container } = render(
      <form>
        <Field required>
          <FieldLabel>Work email</FieldLabel>
          <Input type="email" placeholder="you@company.com" />
          <FieldDescription>Used for account recovery.</FieldDescription>
        </Field>
        <Field invalid>
          <FieldLabel>Workspace URL</FieldLabel>
          <Input defaultValue="admin" />
          <FieldMessage icon>This workspace name is reserved.</FieldMessage>
        </Field>
        <Textarea aria-label="Notes" />
        <Checkbox label="Accept terms" />
        <RadioGroup aria-label="Plan">
          <Radio value="personal" label="Personal" />
          <Radio value="team" label="Team" />
        </RadioGroup>
        <Switch label="Email notifications" />
        <Field>
          <FieldLabel>Team</FieldLabel>
          <Select options={planOptions} />
        </Field>
      </form>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders tabs without violations', async () => {
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel.</TabsContent>
        <TabsContent value="activity">Activity panel.</TabsContent>
      </Tabs>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders an open select listbox without violations', async () => {
    const user = userEvent.setup();

    render(<Select aria-label="Team" options={planOptions} />);

    await user.click(screen.getByRole('combobox', { name: 'Team' }));
    await screen.findByRole('listbox');

    // The popup renders in a portal outside any landmark, so the page-level
    // region rule cannot apply to this isolated fixture.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('renders an open combobox without violations', async () => {
    const user = userEvent.setup();

    render(<Combobox aria-label="Team" options={planOptions} clearable />);

    const combobox = screen.getByRole('combobox', { name: 'Team' });

    await user.click(combobox);
    await user.type(combobox, 'eng');
    await screen.findByRole('listbox');

    // The popup renders in a portal outside any landmark, so the page-level
    // region rule cannot apply to this isolated fixture.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('renders a multi-select with the select-all row without violations', async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        aria-label="Team"
        options={planOptions}
        selectAll
        maxVisible={1}
        defaultValue={['design', 'engineering']}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Team' }));
    await screen.findByRole('listbox');

    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('renders an open month listbox in the calendar without violations', async () => {
    const user = userEvent.setup();

    render(<Calendar defaultMonth="2026-11" captionLayout="select" />);

    await user.click(screen.getByRole('combobox', { name: 'Month' }));
    await screen.findByRole('listbox');

    // The popup renders in a portal outside any landmark, so the page-level
    // region rule cannot apply to this isolated fixture.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('renders an open modal dialog without violations', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your account details.</DialogDescription>
            <DialogBody>
              <Input aria-label="Display name" defaultValue="Ada Lovelace" />
            </DialogBody>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await screen.findByRole('dialog');

    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('renders an open date picker without violations', async () => {
    const user = userEvent.setup();

    render(<DatePicker defaultValue="2026-11-18" />);

    await user.click(screen.getByRole('button', { name: 'Nov 18, 2026' }));
    await screen.findByRole('dialog', { name: 'Choose a date' });

    // The popup renders in a portal outside any landmark, so the page-level
    // region rule cannot apply to this isolated fixture.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('renders an open time picker without violations', async () => {
    const user = userEvent.setup();

    render(<TimePicker defaultValue="09:30" />);

    await user.click(screen.getByRole('button', { name: 'Open time picker' }));
    await screen.findByRole('dialog', { name: 'Choose a time' });

    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
