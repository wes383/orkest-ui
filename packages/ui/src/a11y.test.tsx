import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Settings } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './components/alert';
import { Avatar, AvatarFallback } from './components/avatar';
import { Badge } from './components/badge';
import { Button } from './components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/card';
import { Checkbox } from './components/checkbox';
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
import { Field, FieldDescription, FieldLabel, FieldMessage } from './components/field';
import { IconButton } from './components/icon-button';
import { Input, Textarea } from './components/input';
import { Radio, RadioGroup } from './components/radio';
import { Select } from './components/select';
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
});
